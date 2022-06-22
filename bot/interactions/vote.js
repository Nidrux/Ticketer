const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for Ticketer!'),

  async execute(interaction, client) {
    const votemebed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.avatarURL(),
      })
      .setColor('BLURPLE')
      .setTitle(
        'Voting helps **Ticketer** gain more active users! So make sure to vote every day!',
      )
      .addFields(
        {
          name: 'Infinity Bot List',
          value: '> [ Click to vote  ](https://infinitybots.gg/bots/977591057711792178/vote)',
          inline: true,
        },
        {
          name: 'Botlist.me',
          value: '> [ Click to vote  ](https://botlist.me/bots/977591057711792178/vote)',
          inline: true,
        },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({
      embeds: [votemebed],
    });
  },
};
