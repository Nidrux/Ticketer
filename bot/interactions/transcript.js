const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

const { createTranscript, guildLog } = require('../../functions/bot');
const Guild = require('../../db/models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Posts the transcript of the ticket.'),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then((dbGuild) => {
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Transcript')
          .setColor('RED')
          .setDescription('This ticket does not exist.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
          .setTimestamp();

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      } else if (!dbGuild.settings.transcript.enabled) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Ticket transcript')
          .setColor('RED')
          .setTimestamp()
          .setDescription('Transcripts are disabled on this server.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      } else {
        createTranscript(interaction.guild.id, dbTicket);
        const transcriptEmbed = new MessageEmbed()
          .setTitle('> Ticket transcript')
          .setColor('BLURPLE')
          .setTimestamp()
          .setDescription('This is the transcript of this ticket.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setURL(`https://ticketer.developersdungeon.xyz/ticket/${interaction.guild.id}/${dbTicket.channel}?password=${String(interaction.guild.id).substring(0, interaction.guild.id.length / 2)}${String(dbTicket.channel).substring(dbTicket.channel.length / 2, dbTicket.channel.length)}`)
              .setLabel('Download')
              .setStyle('LINK'),
          );

        guildLog(dbGuild.settings.log, interaction.user, `**${interaction.user.tag}** created a transcript of a ticket (\`${dbTicket.id}\`).`, client);
        return interaction.reply({
          embeds: [transcriptEmbed],
          ephemeral: true,
          components: [row],
        });
      }
    });
  },
};
