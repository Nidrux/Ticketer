const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Displays the clients ping'),

  async execute(interaction, client) {
    const pingembed = new MessageEmbed()

      .setColor('BLURPLE')
      .setTitle('> Ping')
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .addFields(
        {
          name: '**Bot** latency',
          value: `**${Math.abs(
            Date.now() - interaction.createdTimestamp,
          )}**ms`,
          inline: false,
        },
        {
          name: '**API** latency',
          value: `**${Math.round(client.ws.ping)}**ms`,
          inline: false,
        },
      )
      .setTimestamp();
    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Discord latency')
        .setStyle('LINK')
        .setURL('https://discordstatus.com/'),
    );

    await interaction.reply({
      embeds: [pingembed],
      components: [button],
    });
  },
};
