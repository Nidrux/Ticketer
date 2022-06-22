/* Import packages */
const { MessageEmbed } = require('discord.js');
const { encrypt, decrypt } = require('simple-encryptor')(process.env.DECRYPT_KEY);

/* Import files */
const Guild = require('../util/models/guild');

/* Export */
module.exports = (message) => {
  const { client } = message;

  if (message.content == `<@${client.user.id}>`) {
    const msgEmbed = new MessageEmbed()
      .setTitle('> Hey :wave:')
      .setColor('BLURPLE')
      .setDescription(`This bot uses \`/\` commands. Use \`/help [category]\` to get a list of commands or visit our [website](${process.env.WEB}/commands).`)
      .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) });

    return message.channel.send({ embeds: [msgEmbed] });
  }

  Guild.findOne({ id: message.guild.id }).then((dbGuild) => {
    if (!dbGuild || message.author.bot) return;
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((ticket) => ticket.channel == message.channel.id)];
    if (!dbTicket) return;
    if (dbTicket.members.findIndex((m) => m.id == message.author.id)) dbTicket.members.push({ id: message.author.id, name: message.author.tag });
    dbTicket.messages.push({
      message: encrypt(message.content), author: message.author.id, name: message.author.tag, timestamp: new Date(),
    });

    Guild.findOneAndUpdate({ id: message.guild.id }, { tickets: dbGuild.tickets }).catch();
  });
};
