const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const Guild = require('../../db/models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-user')
    .setDescription('Add a user to the ticket')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to add.')
      .setRequired(true)),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
      if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
        const value = interaction.options.getUser('user').id;
        const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];
        if (!dbTicket) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Claim ticket')
            .setColor('RED')
            .setDescription('This ticket does not exist.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp();

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const user = await interaction.guild.members.fetch(value);

        if (!/^[0-9]*$/.test(value) || !user) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Add user')
            .setColor('RED')
            .setDescription('The user you specified was not found.')
            .setTimestamp()
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
            .setDescription(`The user <@!${value}> has been added to this ticket.`)
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          interaction.deferReply();
          interaction.deleteReply();
          await interaction.channel.send({ embeds: [addEmbed], ephemeral: true });
        } else {
          const addEmbed = new MessageEmbed()
            .setTitle('> Add user')
            .setColor('RED')
            .setDescription(`The user <@!${value}> is already in this ticket.`)
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          interaction.deferReply();
          interaction.deleteReply();
          await interaction.channel.send({ embeds: [addEmbed], ephemeral: true });
        }
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Add user')
          .setColor('BLURPLE')
          .setDescription('You are not a staff member of this guild.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
          .setTimestamp();

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    });
  },
};
