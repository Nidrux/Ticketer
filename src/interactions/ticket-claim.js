/* Import packages */
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');
const Guild = require('../util/models/guild');

/* Export */
module.exports = async (client, interaction, dbGuild) => {
  if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
    if (!dbTicket) {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription('This ticket does not exist in our database!')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    } if (dbGuild.settings.transcript.enabled) {}

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
      const errorEmbed = new MessageEmbed()
        .setTitle('> Error')
        .setColor('RED')
        .setDescription(`This ticket is already claimed by ${client.users.cache.get(dbTicket.claimed)}. You can transfer the ticket to yourself by using the \`/transfer\` command`)
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  } else {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Claim ticket')
      .setColor('RED')
      .setDescription('You are missing the `TICKETER_STAFF` permission.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
