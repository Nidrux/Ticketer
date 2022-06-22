const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const Guild = require('../../db/models/guild');
const { guildLog } = require('../../functions/bot');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current ticket'),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
      if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
        const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];
        if (!dbTicket) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Lock ticket')
            .setColor('RED')
            .setDescription('This ticket does not exist.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (dbTicket.state == 'open') {
          dbTicket.members.forEach(async (member) => {
            let permissions = { SEND_MESSAGES: false };
            const user = await interaction.guild.members.fetch(member.id);
            if (interaction.member.roles.cache.has(dbGuild.settings.staff.role)) permissions = { SEND_MESSAGES: true };
            interaction.channel.permissionOverwrites.edit(user, permissions);
          });

          dbTicket.state = 'stopped';

          Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

          const sucEmbed = new MessageEmbed()
            .setTitle('> Lock ticket')
            .setColor('BLURPLE')
            .setDescription('This ticket has been locked.')
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          await interaction.reply({ embeds: [sucEmbed], ephemeral: false });
          guildLog(dbGuild.settings.log, interaction.user, `**${interaction.user.tag}** locked a ticket (\`${dbTicket.id}\`).`, client);
        } else {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Lock ticket')
            .setColor('RED')
            .setDescription('This ticket is already locked')
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Lock ticket')
          .setColor('RED')
          .setDescription('You are not allowed to lock tickets.')
          .setTimestamp()
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    });
  },
};
