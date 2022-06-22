const { MessageEmbed } = require('discord.js');

/* Import Modules */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function createTranscript(id, ticket) {
  let t = ticket;
  if(!t || !t.members) return null;
  t.members.sort();
  fetch('http://localhost:7080/api/ticket/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guild: id,
      ticket,
    }),
  });
}

async function guildLog(id, user, message, client) {
  let log = new MessageEmbed()
    .setColor('BLURPLE')
    .setTitle('> Log')
    .setDescription(message)
    .setFooter({ text: user.tag, iconURL: user.avatarURL({ dynamic: true }) })
    .setTimestamp();

  if (id == 'none') return console.log(1);
  const channel = await client.channels.fetch(id);
  if (channel) channel.send({ embeds: [log] });
}

module.exports = {
  createTranscript,
  guildLog,
};
