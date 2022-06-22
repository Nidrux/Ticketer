/* Import modules */
const {
  MessageEmbed,
} = require('discord.js');

/* Import files */
const Guild = require('../../db/models/guild');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  // return;
  const value = interaction.getTextInputValue('ticket-members-add-value');
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];

  const user = await interaction.guild.members.fetch(value);

  if (!/^[0-9]*$/.test(value) || !user) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setColor('RED')
      .setDescription('The user you specified was not found.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.channel.send({ embeds: [errorEmbed], ephemeral: true });
  }
  if (dbTicket.members.findIndex((m) => m.id == value) == -1) {
    dbTicket.members.push({ id: user.user.id, name: user.user.tag });

    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

    interaction.channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

    const addEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setColor('BLURPLE')
      .setDescription(`The user <@!${value}> has been added to this ticket.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.deferReply();
    interaction.deleteReply();
    await interaction.channel.send({ embeds: [addEmbed], ephemeral: true });
  } else {
    const addEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setColor('RED')
      .setDescription(`The user <@!${value}> is already in this ticket.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.deferReply();
    interaction.deleteReply();
    await interaction.channel.send({ embeds: [addEmbed], ephemeral: true });
  }
};
