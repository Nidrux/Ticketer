const api = require('dungeon-api');
const { Webhook } = require('@top-gg/sdk');

module.exports = (client) => {
  api.fetchDungeonSingle('ticketer', process.env.API_KEY, client);
  api.fetchDungeon('ticketer', process.env.API_KEY, client);

  // const webhook = new Webhook(process.env.TOPGG_KEY);
};
