/* Import packages */
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');
const Guild = require('../util/models/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];
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
      .setDescription('This ticket has already been closed.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  try {
    dbTicket.state = 'closed';
    dbTicket.closed = new Date();
    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();
  } catch (e) {
    errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.commandName);

    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription('An error occurred while trying to closing this ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  const deleteEmbed = new MessageEmbed()
    .setTitle('> Delete Ticket')
    .setColor('BLURPLE')
    .setDescription('This ticket will be deleted in **10** seconds.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  interaction.channel.send({ embeds: [deleteEmbed], ephemeral: true });

  try {
    interaction.channel.messages.cache.get(interaction.message.id).delete();
  } catch (e) {
    errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.commandName);

    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription('An error occurred while trying to deleting this ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  let errored = false;
  if (dbGuild.settings.transcript.enabled) {
    const transcriptEmbed = new MessageEmbed()
      .setTitle('> Ticket transcript')
      .setColor('BLURPLE')
      .setDescription('This is the transcript of this ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL(`${process.env.WEB}/dashboard/${interaction.guild.id}/transcript/${dbTicket.channel}`)
          .setLabel('Download')
          .setStyle('LINK'),
      );

    try {
      guild.createTranscript(interaction.guild.id, dbTicket, client);
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.commandName);
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('An error occurred while trying to create the transcript of this ticket.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      errored = true;
    }

    if (!errored) {
      interaction.channel.send({
        embeds: [transcriptEmbed],
        components: [row],
      });
    }
  }

  if (!errored) {
    setTimeout(() => {
      try {
        interaction.channel.delete();
        guild.log(client, interaction, `**${interaction.user.tag}** deleted ticket: (\`${dbTicket.id}\`)`, dbGuild);
      } catch (e) {
        errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.commandName);
        const errorEmbed = new MessageEmbed()
          .setTitle('Error')
          .setColor('RED')
          .setDescription('I don\'t have permission to delete this channel.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        try {
          return interaction.channel.send({ embeds: [errorEmbed], ephemeral: true });
        } catch (e) { return; }
      }
    }, 10000);
  }
};
