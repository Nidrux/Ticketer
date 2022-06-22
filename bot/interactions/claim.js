const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const Guild = require('../../db/models/guild');
const { guildLog } = require('../../functions/bot');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim the current ticket'),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then((dbGuild) => {
      if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
        const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
        if (!dbTicket) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Claim ticket')
            .setColor('RED')
            .setDescription('This ticket does not exist.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (dbTicket.claimed == 'none') {
          dbTicket.claimed = interaction.user.id;

          Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

          const claimEmbed = new MessageEmbed()
            .setTitle('> Claim ticket')
            .setColor('BLURPLE')
            .setDescription(`This ticket has been claimed by ${interaction.user}. He will now help you with your problem.`)
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

          interaction.reply({ embeds: [claimEmbed] });
          guildLog(dbGuild.settings.log, interaction.user, `**${interaction.user.tag}** claimed a ticket (\`${dbTicket.id}\`).`, client);
        } else {
          const claimEmbed = new MessageEmbed()
            .setTitle('> Claim ticket')
            .setColor('RED')
            .setDescription(`This ticket is already claimed by <@${client.users.cache.get(dbTicket.claimed).id}>.`)
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

          interaction.reply({ embeds: [claimEmbed], ephemeral: true });
        }
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Claim ticket')
          .setColor('RED')
          .setDescription('You are not a staff member of this guild.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
          .setTimestamp();

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    });
  },
};
