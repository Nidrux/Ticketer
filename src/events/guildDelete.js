/* Import files */
const { errorLog } = require('../util/functions/error');
const Guild = require('../util/models/guild');

/* Export */
module.exports = (guild) => {
  Guild.findOne({ id: guild.id }).then((dbGuild) => {
    if (!dbGuild) return;

    Guild.findOneAndDelete({ id: guild.id }).catch();
  });
};
