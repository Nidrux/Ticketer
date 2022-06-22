/* Import modules */
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  const closeEmbed = new MessageEmbed()
    .setTitle('> Close ticket')
    .setColor('BLURPLE')
    .setDescription('Are you sure you want to close this ticket?')
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.avatarURL({ dynamic: true }),
    });

  const rowConfirm = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('ticket-close-confirm')
      .setEmoji('977921614651981824')
      .setLabel('Confirm')
      .setStyle('SUCCESS'),
    new MessageButton()
      .setCustomId('ticket-close-cancel')
      .setEmoji('977712715554488391')
      .setLabel('Cancel')
      .setStyle('DANGER'),
  );

  /*
  new MessageButton()
  .setCustomId("ticket-feedback")
  .setEmoji("📙")
  .setLabel("Feedback")
  .setStyle("SECONDARY")
  */

  interaction.reply({
    embeds: [closeEmbed],
    ephemeral: false,
    components: [rowConfirm],
  });
};
