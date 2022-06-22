const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Shows you the dashboard for this guild'),
  async execute(interaction) {
    const dashboardEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTimestamp()
      .setDescription(
        `You can open the dashboard by clicking [here](https://ticketer.developersdungeon.xyz/dashboard/${interaction.guild.id}) or using the button below!`,
      )
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Dashboard')
        .setURL(
          `https://ticketer.developersdungeon.xyz/dashboard/${interaction.guild.id}`,
        )
        .setStyle('LINK'),
    );

    await interaction.reply({
      embeds: [dashboardEmbed],
      ephemeral: true,
      components: [row],
    });
    setTimeout(() => {
      row.components[0].setDisabled(true);
      interaction.editReply({ embeds: [dashboardEmbed], components: [row] });
    }, 120000);
  },
};
