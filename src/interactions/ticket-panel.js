/* Import packages */
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

/* Import file */
const guild = require('../util/functions/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  const panelId = interaction.customId.substring(interaction.customId.indexOf('_') + 1, interaction.customId.length);
  const panel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)];
  const user = await interaction.guild.members.fetch(interaction.user.id);
  let today = new Date();
  let last = new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000));
  if (dbGuild.settings.raid && new Date(user.joinedTimestamp) > last) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('> Error')
      .setDescription('This server is currently in raid mode, so only users who have been on the server for more than 3 days are allowed to create tickets. If you beleave that this is an error please contact your server Admin.')
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  last = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000));
  if (dbGuild.tickets.filter((t) => t.creator == interaction.user.id && t.state !== 'closed' && new Date(t.created) > last).length >= Number(dbGuild.settings.maxtickets)) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Error')
      .setColor('RED')
      .setDescription(
        'You have reached the maximum amount of tickets at once on this guild.',
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
    .setDescription('Please specify a reason for your ticket.')
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.avatarURL({ dynamic: true }),
    });

  if (!panel) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('> Error')
      .setDescription('This panel does not exist.')
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  if (!panel.options) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('> Error')
      .setDescription('This panel does not have any option.')
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  let options = [];
  panel.options.forEach((o) => {
    options.push({
      label: o.label,
      description: o.description,
      value: String(o.value),
      permissions: o.permissions,
    });
  });

  const input = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(`ticket-create_${panelId}`)
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
