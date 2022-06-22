/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Shows you the dashboard for this guild'),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.permissions.has('MANAGE_GUILD')) {
      const dashboardEmbed = new MessageEmbed()
        .setColor('BLURPLE')

        .setDescription(
          `You can open the dashboard by clicking [here](${process.env.WEB}/dashboard/${interaction.guild.id}) or using the button below!`,
        )
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('Dashboard')
          .setURL(
            `${process.env.WEB}/dashboard/${interaction.guild.id}`,
          )
          .setStyle('LINK'),
      );

      await interaction.reply({
        embeds: [dashboardEmbed],
        ephemeral: true,
        components: [row],
      });
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
