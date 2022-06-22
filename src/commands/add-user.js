/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Guild = require('../util/models/guild');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-user')
    .setDescription('Add a user to the ticket')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to add.')
      .setRequired(true)),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
      const value = interaction.options.getUser('user').id;
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];

      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket does not exist in our database!')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      const user = await interaction.guild.members.fetch(value);
      if (!user) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Add user')
          .setColor('RED')
          .setDescription('I couldn\'t find the user you wanted to add.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.channel.send({ embeds: [errorEmbed], ephemeral: true });
      }

      if (dbTicket.members.findIndex((m) => m.id == value) == -1) {
        dbTicket.members.push({ id: user.user.id, name: user.user.tag });
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        interaction.channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

        const addEmbed = new MessageEmbed()
          .setTitle('> Add user')
          .setColor('BLURPLE')
          .setDescription(`${user} has been added to this ticket.`)

          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.deferReply();
        interaction.deleteReply();
        await interaction.channel.send({ embeds: [addEmbed], ephemeral: true });
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription(`${user} already got added to this ticket.`)

          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.deferReply();
        interaction.deleteReply();
        await interaction.channel.send({ embeds: [errorEmbed], ephemeral: true });
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('> Error')
        .setDescription('You are missing the `TICKETER_STAFF` permission.')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
