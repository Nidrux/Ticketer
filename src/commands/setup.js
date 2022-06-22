/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Guild = require('../util/models/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Gives you instructions to setup the bot'),

  async execute(interaction, client, dbGuild) {
    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('> Error')
        .setDescription('You are missing the `MANAGE_GUILD` permission.')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const setupEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('> Setup')
      .setDescription('Please wait. I\'m checking a few things. This may take a few seconds.')
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    await interaction.reply({ embeds: [setupEmbed], ephemeral: false });

    let changes = [];

    if (dbGuild.panels.length <= 0) {
      changes.push('<:right:977610957985558628> A default panel was created');

      dbGuild.panels = [{
        id: 'default',
        name: 'Create ticket',
        description: 'To create a ticket please use the button below.',
        options: [{
          label: 'No reason provided',
          description: 'This reason has no further description.',
          value: '0',
          permissions: 'none',
        }],
        category: 'none',
        channel: 'none',
        message: 'none',
        prefix: 'ticket-{id}',
      }];
    }

    setTimeout(() => {
      Guild.findOneAndUpdate({ id: interaction.guild.id }, { panels: dbGuild.panels }).catch();
      if (changes.length <= 0) changes = ['<:right:977610957985558628> No changes were made'];
      const successEmbed = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle('> Setup')
        .setDescription('The override has been successfully completed.')
        .addField('Changes', changes.join('\n'))
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        });

      interaction.editReply({ embeds: [successEmbed], ephemeral: false });
    }, 2500);
  },
};
