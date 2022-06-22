/* Import modules */
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  if (
    dbGuild.tickets.filter(
      (t) => t.creator == interaction.user.id && t.state !== 'closed',
    ).length >= Number(dbGuild.settings.maxtickets)
  ) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription(
        'You have reached the maximum number of tickets at once on this guild.',
      )
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  const createEmbed = new MessageEmbed()
    .setTitle('> Create Ticket')
    .setColor('BLURPLE')
    .setDescription('Please specify the reason for your ticket.')
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.avatarURL({ dynamic: true }),
    });

  const options = dbGuild.options;

  const input = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('ticket-create-reason')
      .setPlaceholder('Nothing selected')
      .addOptions(options)
      .setMaxValues(1)
      .setMinValues(1),
  );

  interaction.reply({
    embeds: [createEmbed],
    ephemeral: true,
    components: [input],
  });
};
