/* Import modules */
const {
  MessageEmbed,
} = require('discord.js');
const discordModals = require('discord-modals');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  discordModals(client);

  const modal = new discordModals.Modal()
    .setCustomId('ticket-members-add')
    .setTitle('Add user')
    .addComponents(
      new discordModals.TextInputComponent()
        .setCustomId('ticket-members-add-value')
        .setLabel('User id to add')
        .setStyle('SHORT')
        .setMinLength(18)
        .setMaxLength(18)
        .setPlaceholder('User id')
        .setRequired(true),
    );

  await discordModals.showModal(modal, {
    client,
    interaction,
  });
};
