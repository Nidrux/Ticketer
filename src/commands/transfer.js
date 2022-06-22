/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Guild = require('../util/models/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer a ticket to another member')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user to transfer the ticket to.')
      .setRequired(false)),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
      const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
      if (!dbTicket) {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket does not exist in our database!')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (dbTicket.claimed == 'none') {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription('This ticket is not claimed yet.')

          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (interaction.options.getUser('user')) {
        const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
        if (!user.roles.cache.has(dbGuild.settings.staff.role) && !dbGuild.settings.staff.members.includes(user.id)) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Error')
            .setColor('RED')
            .setDescription('The user you specified is not a staff member.')
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (user.id == dbTicket.claimed) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Error')
            .setColor('RED')
            .setDescription('This ticket is already claimed.')

            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        dbTicket.claimed = user.id;
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        const transferEmbed = new MessageEmbed()
          .setTitle('> Transfer ticket')
          .setColor('BLURPLE')
          .setDescription(`You transfered the ticket to ${user}`)

          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        const transferMessageEmbed = new MessageEmbed()
          .setTitle('> Transfer ticket')
          .setColor('BLURPLE')

          .setDescription(`This ticket has been transferred to ${user}. He will now help you with your problem.`)
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [transferEmbed], ephemeral: true });
        interaction.channel.send({ embeds: [transferMessageEmbed] });
      } else {
        if (dbTicket.claimed == interaction.user.id) {
          const errorEmbed = new MessageEmbed()
            .setTitle('> Transfer ticket')
            .setColor('RED')
            .setDescription('You cannot transfer your own ticket to yourself.')

            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        dbTicket.claimed = interaction.user.id;
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        const transferEmbed = new MessageEmbed()
          .setTitle('> Transfer ticket')
          .setColor('BLURPLE')
          .setDescription('You have transfered the ticket to yourself.')
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        const transferMessageEmbed = new MessageEmbed()
          .setTitle('> Transfer ticket')
          .setColor('BLURPLE')

          .setDescription(`This ticket has been transferred to ${interaction.user}. He will now help you with your problem.`)
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [transferEmbed], ephemeral: true });
        interaction.channel.send({ embeds: [transferMessageEmbed] });
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('You are missing the `TICKETER_STAFF` permission.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
