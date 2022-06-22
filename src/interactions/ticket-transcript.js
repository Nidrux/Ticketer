/* Import packages */
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');
const Guild = require('../util/models/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
  if (!dbTicket) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription('This ticket does not exist in our database!')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  if (!dbGuild.settings.transcript.enabled) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription('Transcripts are disabled for this server. You can enable them on the dashboard!')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  try {
    guild.createTranscript(interaction.guild.id, dbTicket, client);
  } catch (e) {
    errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription('An error occurred while trying to create the transcript for this ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  const transcriptEmbed = new MessageEmbed()
    .setTitle('> Transcript')
    .setColor('BLURPLE')
    .setDescription('Here is the transcript for this ticket.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setURL(`${process.env.WEB}/dashboard/${interaction.guild.id}/transcript/${dbTicket.channel}`)
      .setLabel('Download')
      .setStyle('LINK'),
  );

  interaction.reply({ embeds: [transcriptEmbed], components: [row] });
  guild.log(client, interaction, `**${interaction.user.tag}** generated the transcript for ticket: (\`${dbTicket.id}\`)`, dbGuild);
};
