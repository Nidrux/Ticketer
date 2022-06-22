/* Import packages */
const { MessageEmbed } = require('discord.js');

/* Export */
module.exports = {
  errorLog: (message, client, messageBlank, guild, user, channel, location) => {
    if (message) console.log(message);

    if (messageBlank) {
      const consoleEmbed = new MessageEmbed()
        .setTitle('> Console')
        .setColor('BLURPLE')
        .setDescription(`\`\`\`js\n${String(messageBlank)}\`\`\``)
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.avatarURL(),
        })
        .addField('Guild', `\`${guild}\``)
        .addField('User', `\`${user}\``)
        .addField('Channel', `\`${channel}\``)
        .addField('Location', `\`${location}\``);

      client.channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [consoleEmbed] });
    }
  },
};
