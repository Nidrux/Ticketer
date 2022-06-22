/* Import modules */
const {
  MessageEmbed,
} = require('discord.js');

/* Export */
module.exports = (interaction, dbGuild) => {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
  const feedbackEmbed = new MessageEmbed()
    .setTitle('> Submit Feedback')
    .setColor('BLURPLE')
    .setDescription(`To submit feedback go to this [website](https://ticketer.developersdungeon.xyz/${interaction.guild.id}/${dbTicket.channel}/feedback)`)
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  interaction.reply({ embeds: [feedbackEmbed], ephemeral: false });
};
