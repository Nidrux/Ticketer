/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  try {
    interaction.channel.messages.cache.get(interaction.message.id).delete();
  } catch (e) {}
};
