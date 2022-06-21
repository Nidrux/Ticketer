const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides you a list default commands'),
  async execute(interaction) {
    const helpMessage = `
    <:right:977610957985558628> **/help** \`Shows you this list.\`
    <:right:977610957985558628> **/ping** \`Returns the bots latency.\`
    <:right:977610957985558628> **/info** \`General statistics about the bot.\`
    <:right:977610957985558628> **/invite** \`Posts the invite link for the bot.\`
    <:right:977610957985558628> **/dashboard** \`Shows you the dashboard for this guild.\`
    <:right:977610957985558628> **/resend** \`Resends the ticket message.\`
    <:right:977610957985558628> **/claim** \`Claims the current ticket.\`
    <:right:977610957985558628> **/transfer** \`Transfer the ticket to another user.\`
    <:right:977610957985558628> **/transcript** \`Generate a transcript for the current ticket.\`
    <:right:977610957985558628> **/adduser** \`Add a user to the current ticket.\`
    <:right:977610957985558628> **/close** \`Close the current ticket.\`
    <:right:977610957985558628> **/lock** \`Lock the current ticket.\`
    <:right:977610957985558628> **/unlock** \`Unlock the current ticket.\`
    `;

    const helpEmbed = new MessageEmbed()
      .setTitle('> Help')
      .setColor('BLURPLE')
      .setDescription(
        `These are our most used commands! Please keep in mind that you can find every command on our [Website](https://ticketer.developersdungeon.xyz/commands).\n\n__Commands__${helpMessage}\n__Support__\nFeel free to contact us on our [Discord Server](https://discord.gg/NqDGtcB8Zt) if you have any questions or suggestions.\n\n__Developers Dungeon__\nThis project is brought to you by [Developers Dungeon Studios](https://developersdungeon.xyz/).\n\n__Data Usage__\n[Our Privacy Policy](https://github.com/Developer-Dungeon-Studio/Ticketer/blob/main/PRIVACY-POLICY\n)`,
      )
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Discord')
        .setURL('https://discord.gg/NqDGtcB8Zt')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Invite')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Github')
        .setURL('https://github.com/Developer-Dungeon-Studio/Ticketer')
        .setStyle('LINK'),
    );

    await interaction.reply({
      embeds: [helpEmbed],
      ephemeral: false,
      components: [row],
    });
  },
};
