const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of all commands supported by the bot')
    .addSubcommand((subCommand) => subCommand.setName('general').setDescription('List of all general commands'))
    .addSubcommand((subCommand) => subCommand.setName('tickets').setDescription('List of all ticket commands'))
    .addSubcommand((subCommand) => subCommand.setName('admin').setDescription('List of all admin commands')),

  async execute(interaction, client) {
    if (interaction.options._subcommand) {
      let helpEmbed = new MessageEmbed();

      switch (interaction.options.getSubcommand()) {
        case 'general': {
          helpEmbed
            .setColor('BLURPLE')
            .setTitle('> Help')
            .addField(
              '> Commands',
              [
                '<:right:977610957985558628> `/help` Shows you this list.',
                '<:right:977610957985558628> `/info` General statistics about the bot.',
                '<:right:977610957985558628> `/invite` Posts the invite link for the bot.',
                '<:right:977610957985558628> `/dashboard` Shows you the dashboard for this guild.',
                `What happends with my data? Find our Privacy policy by clicking [here](${process.env.WEB}/privacy)`,
              ].join('\n'),
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
          break;
        }
        case 'tickets': {
          helpEmbed
            .setColor('BLURPLE')
            .setTitle('> Help')
            .addField(
              '> Commands',
              [
                '<:right:977610957985558628> `/claim` Claims the current ticket.',
                '<:right:977610957985558628> `/transfer` Transfer the ticket to another user.',
                '<:right:977610957985558628> `/transcript` Generate a transcript for the current ticket.',
                '<:right:977610957985558628> `/adduser` Add a user to the current ticket.',
                '<:right:977610957985558628> `/close` Close the current ticket.',
                '<:right:977610957985558628> `/lock` Lock the current ticket.',
                '<:right:977610957985558628> `/unlock` Unlock the current ticket.',
                `What happends with my data? Find our Privacy policy by clicking [here](${process.env.WEB}/privacy)`,
              ].join('\n'),
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
          break;
        }
        case 'admin': {
          helpEmbed
            .setColor('BLURPLE')
            .setTitle('> Help')
            .addField(
              '> Commands',
              [
                '<:right:977610957985558628> `/debug` Used to debug bot permissiosn',
                '<:right:977610957985558628> `/resend` Resends the ticket message.',
                `What happends with my data? Find our Privacy policy by clicking [here](${process.env.WEB}/privacy)`,

              ].join('\n'),
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
          break;
        }
        default:
          break;
      }
      await interaction.reply({
        embeds: [helpEmbed],
      });
    } else {
      const helpEmbed = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle('> Help')
        .addField(
          '> Help Options',
          [
            '<:right:977610957985558628> `/help general` List of all general commands',
            '<:right:977610957985558628> `/help tickets`List of all ticket commands',
            '<:right:977610957985558628> `/help admin` List of all admin commands.',
            `What happends with my data? Find our Privacy policy by clicking [here](${process.env.WEB}/privacy)`,
          ].join('\n'),
        )
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.reply({ embeds: [helpEmbed] });
    }
  },
};
