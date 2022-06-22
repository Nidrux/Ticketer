/* Import files */
const { errorLog } = require('../util/functions/error');
const Guild = require('../util/models/guild');

/* Export */
module.exports = (guild) => {
  Guild.findOne({ id: guild.id }).then((dbGuild) => {
    if (!dbGuild) {
      try {
        const g = new Guild({
          id: guild.id,
          botJoined: (Date.now() / 1000) | 0,
        });

        g.save();
      } catch (e) {
        return;
      }
    }
  });
};
