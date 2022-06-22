/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket'),

  async execute(interaction, client, dbGuild) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
    if (!dbTicket) {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('This ticket does not exist in our database!')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (dbTicket.state == 'closed') {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('This ticket has already been closed')

        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    } else {
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

      return interaction.reply({
        embeds: [closeEmbed],
        components: [rowConfirm],
      });
    }
  },
};
