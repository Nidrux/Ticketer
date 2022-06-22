const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Displays the invite url'),

  async execute(interaction) {
    const inviteembed = new MessageEmbed()

      .setTitle('Invite Ticketer!')
      .setColor('BLURPLE')
      .setDescription(
        'You can invite **Ticketer** by pressing [here](https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands) or using the button bellow!',
      )
      .setTimestamp()
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const invitebutton = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Invite')
        .setStyle('LINK')
        .setURL(
          'https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands',
        ),
    );

    await interaction.reply({
      embeds: [inviteembed],
      components: [invitebutton],
    });
  },
};
