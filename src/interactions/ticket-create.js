/* Import packages */
const {
  MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Permissions,
} = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  const panelId = interaction.customId.substring(interaction.customId.indexOf('_') + 1, interaction.customId.length);
  const panel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)];
  let option = panel.options[panel.options.findIndex((o) => String(o.value) === interaction.values[0])];

  if (!option) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('> Error')
      .setDescription('This option does not exist.')
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  /* Send wait message */
  const waitEmbed = new MessageEmbed()
    .setTitle('> Please wait')
    .setColor('BLURPLE')
    .setDescription('Your ticket will be created!')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  try {
    await interaction.reply({ embeds: [waitEmbed], ephemeral: true });
  } catch (e) {
    return;
  }

  /* Generate permissions */
  let permissions = [
    { id: client.user.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'], deny: [] },
    { id: interaction.member.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'], deny: [] },
    { id: interaction.guild.roles.everyone.id, deny: ['VIEW_CHANNEL'] },
  ];

  const permissionRole = await interaction.guild.roles.cache.get(option.permissions);
  const staffRole = await interaction.guild.roles.cache.get(dbGuild.settings.staff.role);
  if (option.permissions !== 'none' && permissionRole) {
    permissions.push({
      id: option.permissions,
      allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
      deny: [],
    });
  } else {
    if (dbGuild.settings.staff.role !== 'none' && staffRole) {
      permissions.push({
        id: dbGuild.settings.staff.role,
        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
        deny: [],
      });
    }

    dbGuild.settings.staff.members.forEach((staff) => {
      if (!interaction.guild.members.cache.get(staff)) return;
      permissions.push({
        id: staff,
        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
        deny: [],
      });
    });
  }

  /* Check if client has permissions */
  if (!interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES])) {
    const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('I\'m missing the `MANAGE_ROLES` permission.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
  }
  if (!interaction.guild.me.permissions.has([Permissions.FLAGS.SEND_MESSAGES])) {
    const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('I\'m missing the `SEND_MESSAGES` permission.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
  }
  if (!interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) {
    const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('I\'m missing the `MANAGE_CHANNELS` permission.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
  }
  if (!interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES])) {
    const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('I\'m missing the `MANAGE_MESSAGES` permission.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
  }

  /* Sets channel prefix */
  if (!panel.prefix) {
    panel.prefix = 'ticket-{id}';
    dbGuild.save();
  }

  setTimeout(async () => {
    let ticket;
    const noCategory = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('Im missing `SEND_MESSAGES` permissions here.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
    const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor('RED')
      .setDescription('An unknown error occurred while trying to create the ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    if (panel.category == 'none') {
      try {
        ticket = await interaction.guild.channels.create(panel.prefix.replaceAll('{id}', dbGuild.ticketid).replaceAll('{user_name}', interaction.user.username).replaceAll('{user_tag}', interaction.user.tag.replace(`${interaction.user.username}#`, '')), {
          type: 'text',
          permissionOverwrites: permissions,
        });
      } catch (e) {
        errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
        return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
      }
    } else {
      try {
        ticket = await interaction.guild.channels.create(panel.prefix.replaceAll('{id}', dbGuild.ticketid).replaceAll('{user_name}', interaction.user.username).replaceAll('{user_tag}', interaction.user.tag.replace(`${interaction.user.username}#`, '')), {
          type: 'text',
          permissionOverwrites: permissions,
          parent: panel.category,
        });
      } catch (e) {
        errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
        return interaction.editReply({ embeds: [noCategory], ephemeral: true });
      }
    }

    if (!ticket) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('An unknown error occurred while trying to create the ticket.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      let channel = await client.channels.fetch(ticket.id);
      if (channel) channel.permissionOverwrites.set(permissions);
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to change this channels permissions.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    const ticketEmbed = new MessageEmbed()
      .setTitle(`> Ticket ${dbGuild.ticketid}`)
      .setColor('BLURPLE')
      .setDescription(`Welcome to this ticket. Please briefly describe your issue in detail. A staff member will be there with you in just a moment\n\nPanel: \`${panel.name}\`\nReason: \`${option.label}\``)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('ticket-claim')
          .setLabel('Claim')
          .setStyle('PRIMARY')
          .setEmoji('977920180711723098'),
        new MessageButton()
          .setCustomId('ticket-transcript')
          .setLabel('Transcript')
          .setStyle('PRIMARY')
          .setEmoji('978041593313501184'),
        /* new MessageButton()
          .setCustomId('ticket-members')
          .setLabel('Add user')
          .setStyle('PRIMARY')
          .setEmoji('978747421892968538'), */
        new MessageButton()
          .setCustomId('ticket-lock')
          .setLabel('Lock/Unlock')
          .setStyle('DANGER')
          .setEmoji('979002078154358784'),
        new MessageButton()
          .setCustomId('ticket-close')
          .setLabel('Close')
          .setStyle('DANGER')
          .setEmoji('977712715554488391'),
      );

    try {
      if (option.permissions == 'none' && dbGuild.settings.staff.role !== 'none') {
        if (!staffRole) {
          const errorEmbed = new MessageEmbed()
            .setTitle('Error')
            .setColor('RED')
            .setDescription('The staff role does no longer exists. Please contact the server admins for them to change it on the dashboard.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          ticket.send(`${interaction.user}`);
          ticket.send({ embeds: [errorEmbed] });
        } else ticket.send(`<@&${dbGuild.settings.staff.role}>, ${interaction.user}`);
      } else if (option.permissions !== 'none') {
        if (!permissionRole) {
          const errorEmbed = new MessageEmbed()
            .setTitle('Error')
            .setColor('RED')
            .setDescription('The ticket role does no longer exists. Please contact the server admins for them to change it on the dashboard.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          ticket.send(`${interaction.user}`);
          ticket.send({ embeds: [errorEmbed] });
        } else ticket.send(`<@&${option.permissions}>, ${interaction.user}`);
      } else {
        ticket.send(`${interaction.user}`);
      }
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I\'m missing the `SEND_MESSAGES` permission in this ticket.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    let msg;
    try {
      msg = await ticket.send({ embeds: [ticketEmbed], components: [row] });
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to send messages to this tickets.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    dbGuild.tickets.push({
      id: dbGuild.ticketid,
      reason: option.value,
      created: new Date(),
      channel: ticket.id,
      creator: interaction.user.id,
      members: [{
        id: interaction.user.id,
        name: interaction.user.tag,
      }],
      messages: [],
      claimed: 'none',
      state: 'open',
      message: msg.id,
      panel: panelId,
      closed: 'none',
    });

    const successEmbed = new MessageEmbed()
      .setTitle('> Ticket created')
      .setColor('BLURPLE')
      .setDescription(`${ticket} has been successfully created! If you cant see the ticket please contact your server Admin.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    try {
      interaction.editReply({ embeds: [successEmbed], ephemeral: true });
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.customId}.js`);
    }

    guild.log(client, interaction, `**${interaction.user.tag}** created ticket: (\`${dbGuild.ticketid}\`)`, dbGuild);

    dbGuild.ticketid += 1;
    dbGuild.save();
  }, 100);
};
