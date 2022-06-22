/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const guild = require('../util/functions/guild');
const Guild = require('../util/models/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock the current ticket'),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];
      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket does not exist in our database!')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (dbTicket.state == 'paused') {
        dbTicket.members.forEach(async (member) => {
          const user = await interaction.guild.members.fetch(member.id);
          interaction.channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
        });

        dbTicket.state = 'open';
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        const sucEmbed = new MessageEmbed()
          .setTitle('> Unlock ticket')
          .setColor('BLURPLE')
          .setDescription('This ticket has been unlocked.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [sucEmbed], ephemeral: false });
        guild.log(client, interaction, `**${interaction.user.tag}** unlocked ticket: (\`${dbTicket.id}\`)`, dbGuild);
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket is already unlocked')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('You are not allowed to unlock tickets.')

        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
