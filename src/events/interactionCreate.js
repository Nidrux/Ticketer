/* Import files */
const Guild = require('../util/models/guild');
const { errorLog } = require('../util/functions/error');

/* Export */
module.exports = (interaction) => {
  if (!interaction.guild) {
    interaction.reply({
      content: 'You need to be in a server to use this command.',
      ephemeral: true,
    });
  } else {
    const { client } = interaction;

    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      Guild.findOne({ id: interaction.guild.id }).then((dbGuild) => {
        if (!dbGuild) {
          try {
            const g = new Guild({
              id: interaction.guild.id,
              botJoined: (Date.now() / 1000) | 0,
            });

            g.save();
            dbGuild = g;
          } catch (e) {
            errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `commands/${interaction.commandName}.js`);
          }
        }
        command.execute(interaction, client, dbGuild);
      });
    } catch (err) {
      if (err) console.error(err);
      interaction.reply({
        content: 'An error occurred while executing that command.',
        ephemeral: true,
      });
    }
  }
};
