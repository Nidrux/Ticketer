/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Posts the transcript of the ticket'),

  async execute(interaction, client, dbGuild) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
    if (!dbTicket) {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('This ticket does not exist in our database!')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    } else if (!dbGuild.settings.transcript.enabled) {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')

        .setDescription('Transcripts are disabled for this server.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    } else {
      try {
        guild.createTranscript(interaction.guild.id, dbTicket, client);
      } catch (e) {
        errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `commands/${interaction.commandName}.js`);
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('An error occurred while trying to create the transcript of this ticket.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      const transcriptEmbed = new MessageEmbed()
        .setTitle('> Ticket transcript')
        .setColor('BLURPLE')

        .setDescription('This is the transcript for this ticket.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setURL(`${process.env.WEB}/dashboard/${interaction.guild.id}/transcript/${dbTicket.channel}`)
            .setLabel('Download')
            .setStyle('LINK'),
        );

      guild.log(client, interaction, `**${interaction.user.tag}** created a transcript for ticket: (\`${dbTicket.id}\`)`, dbGuild);
      return interaction.reply({
        embeds: [transcriptEmbed],
        ephemeral: true,
        components: [row],
      });
    }
  },
};
