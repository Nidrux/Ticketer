/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageButton, MessageActionRow, Permissions,
} = require('discord.js');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('raidmode')
    .setDescription('Changes the raid mode of the guild')
    .addStringOption((option) => option
      .setName('mode')
      .setRequired(true)
      .setDescription('The mode to set the guild to')
      .setChoices(
        { name: 'on', value: 'on' },
        { name: 'off', value: 'off' },
      )),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const mode = interaction.options.getString('mode');

      switch (mode) {
        case 'on':
          if (dbGuild.settings.raid) {
            const errorEmbed = new MessageEmbed()
              .setColor('RED')
              .setTitle('> Error')
              .setDescription('This server has already activated raid mode.')
              .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              });

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          }
          dbGuild.settings.raid = true;
          dbGuild.save();

          const raidEmbed = new MessageEmbed()
            .setTitle('> Raid mode')
            .setColor('BLURPLE')
            .setDescription('Raid mode has been enabled.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          await interaction.reply({ embeds: [raidEmbed] });
          guild.log(client, interaction, `**${interaction.user.tag}** enabled raid mode`, dbGuild);
          break;
        case 'off':
          if (!dbGuild.settings.raid) {
            const errorEmbed = new MessageEmbed()
              .setColor('RED')
              .setTitle('> Error')
              .setDescription('This server has already disabled the raid mode.')
              .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              });

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          }

          dbGuild.settings.raid = false;
          dbGuild.save();

          const unraidEmbed = new MessageEmbed()
            .setTitle('> Raid mode')
            .setColor('BLURPLE')
            .setDescription('Raid mode has been disabled.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          await interaction.reply({ embeds: [unraidEmbed] });
          guild.log(client, interaction, `**${interaction.user.tag}** disabled raid mode`, dbGuild);
          break;
        default:
          const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('> Error')
            .setDescription('I could not read out any value.')
            .setFooter({
              text: interaction.user.tag,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            });

          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          break;
      }
    } else {
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
  },
};
