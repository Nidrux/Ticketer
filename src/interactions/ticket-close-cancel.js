/* Export */
module.exports = async (client, interaction, dbGuild) => {
  try {
    interaction.channel.messages.cache.get(interaction.message.id).delete();
  } catch (e) { return; }
};
