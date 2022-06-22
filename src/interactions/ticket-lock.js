/* Import packages */
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');
const Guild = require('../util/models/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];

    if (dbTicket.state == 'open') {
      dbTicket.members.forEach(async (member) => {
        let permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: false };
        const user = await interaction.guild.members.fetch(member.id);
        if (user.roles.cache.has(dbGuild.settings.staff.role)) permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: true };
        interaction.channel.permissionOverwrites.edit(user.user.id, permissions);
      });

      dbTicket.state = 'paused';
      Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

      const lockEmbed = new MessageEmbed()
        .setTitle('> Lock ticket')
        .setColor('BLURPLE')
        .setDescription('This ticket has been locked.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [lockEmbed] });
      guild.log(client, interaction, `**${interaction.user.tag}** locked ticket: (\`${dbTicket.id}\`)`, dbGuild);
    } else if (dbTicket.state == 'paused') {
      dbTicket.members.forEach(async (member) => {
        const user = await interaction.guild.members.fetch(member.id);
        interaction.channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
      });

      dbTicket.state = 'open';
      Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

      const unlockEmbed = new MessageEmbed()
        .setTitle('> Unlock ticket')
        .setColor('BLURPLE')
        .setDescription('This ticket has been unlocked.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [unlockEmbed] });
      guild.log(client, interaction, `**${interaction.user.tag}** unlocked ticket: (\`${dbTicket.id}\`)`, dbGuild);
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Lock ticket')
        .setColor('RED')
        .setDescription('This ticket is not locked nor unlocked. There might be a deletion proccess running.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  } else {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Lock ticket')
      .setColor('RED')
      .setDescription('You are not allowed to lock/unlock tickets.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
