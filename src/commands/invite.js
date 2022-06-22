/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Posts the invite url'),

  async execute(interaction, client, dbGuild) {
    const inviteEmbed = new MessageEmbed()

      .setTitle('> Invite')
      .setColor('BLURPLE')
      .setDescription(
        'You can invite **Ticketer** by pressing [here](https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands) or using the button bellow!',
      )
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Invite')
        .setStyle('LINK')
        .setURL(
          'https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands',
        ),
    );

    await interaction.reply({
      embeds: [inviteEmbed],
      components: [row],
    });
  },
};
