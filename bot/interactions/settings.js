const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageActionRow, Permissions, MessageButton,
} = require('discord.js');
const Guild = require('../../db/models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Shows the current settings of this guild'),
  async execute(interaction, client) {
    if (interaction.member.permissions.has(Permissions.MANAGE_GUILD)) {
      Guild.findOne({ id: interaction.guild.id }).then((dbGuild) => {
        const dashEmbed = new MessageEmbed()
          .setTitle('> Settings')
          .setDescription('These are the settings of this guild.')
          .addFields(
            {
              name: 'Staff Role:',
              value: `${dbGuild.settings.staff.role == 'none' ? '`none`' : `<@&${dbGuild.settings.staff.role}>`}`,
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
              name: 'Staff Members:',
              value: `${dbGuild.settings.staff.members.length == 0 ? '`none`' : `<@!${dbGuild.settings.staff.members.join('>, <@!')}>`}`,
              inline: true,
            },
            {
              name: 'Transcript saving:',
              value: `${dbGuild.settings.transcript.enabled ? '`disabled`' : '`enabled`'}`,
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
              name: 'Transcript type:',
              value: `\`${dbGuild.settings.transcript.type}\``,
              inline: true,
            },
          )
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setDisabled(false)
              .setLabel('Dashboard')
              .setURL(`https://ticketer.developersdungeon.xyz/dashboard/${interaction.guild.id}`)
              .setStyle('LINK'),
          );

        interaction.reply({ embeds: [dashEmbed], components: [row], ephemeral: true });
      });
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Settings')
        .setDescription('You are not a server administrator of this guild.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
