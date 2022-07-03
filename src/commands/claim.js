/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Guild = require('../util/models/guild');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim the current ticket'),

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
        dbTicket.claimed = interaction.user.id;
        Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

        const claimEmbed = new MessageEmbed()
          .setTitle('> Claim ticket')
          .setColor('BLURPLE')
          .setDescription(`This ticket has been claimed by ${interaction.user}. He will now help you with your problem.`)
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [claimEmbed] });
        guild.log(client, interaction, `**${interaction.user.tag}** claimed ticket: (\`${dbTicket.id}\`)`, dbGuild);
      } else {
        const claimEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription(`This ticket is already claimed by ${client.users.cache.get(dbTicket.claimed)}. You can transfer the ticket to yourself by using the \`/transfer\` command`)
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [claimEmbed], ephemeral: true });
      }
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('You are missing the **staff** role set on the dashboard or no staff role is configured yet. Please contact a server admin!')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
