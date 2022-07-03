/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Guild = require('../util/models/guild');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current ticket'),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];
      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket does not exist in our database!')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (dbTicket.state == 'open') {
        dbTicket.members.forEach(async (member) => {
          let permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: false };
          const user = await interaction.guild.members.fetch(member.id);
          if (user.roles.cache.has(dbGuild.settings.staff.role)) permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: true };
          interaction.channel.permissionOverwrites.edit(user.user.id, permissions);
        });

        dbTicket.state = 'paused';
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        const sucEmbed = new MessageEmbed()
          .setTitle('> Lock ticket')
          .setColor('BLURPLE')
          .setDescription('This ticket has been locked.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [sucEmbed] });
        guild.log(client, interaction, `**${interaction.user.tag}** locked ticket: (\`${dbTicket.id}\`)`, dbGuild);
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket is already locked')

          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('You are missing the **staff** role set on the dashboard or no staff role is configured yet. Please contact a server admin!')

        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
