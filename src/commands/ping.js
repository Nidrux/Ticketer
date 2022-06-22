/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Returns the bot's ping status"),

  async execute(interaction, client, dbGuild) {
    const pingEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('> Ping')
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .addFields(
        {
          name: '**Client** latency',
          value: `**${Math.abs(
            Date.now() - interaction.createdTimestamp,
          )}**ms`,
          inline: true,
        },
        {
          name: '**API** latency',
          value: `**${Math.round(client.ws.ping)}**ms`,
          inline: true,
        },
      );

    const button = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('Discord status')
          .setStyle('LINK')
          .setURL('https://discordstatus.com/'),
      );

    await interaction.reply({
      embeds: [pingEmbed],
      components: [button],
    });
  },
};
