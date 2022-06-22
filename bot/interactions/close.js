const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require('discord.js');

const Guild = require('../../db/models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket'),
  async execute(interaction) {
    Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Close ticket')
          .setColor('RED')
          .setDescription('This ticket does not exist.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
          .setTimestamp();

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
      if (dbTicket.state == 'closed') {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Close ticket')
          .setColor('RED')
          .setDescription('This ticket is already closed')
          .setTimestamp()
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      } else {
        const closeEmbed = new MessageEmbed()
          .setTitle('> Close ticket')
          .setColor('BLURPLE')
          .setDescription('Are you sure you want to close this ticket?')
          .setTimestamp()
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
      }
    });
  },
};
