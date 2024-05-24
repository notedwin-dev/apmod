const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(
      `\x1b[32m[APMod Status]:\x1b[0m ${client.user.tag} is online✅`
    );

    console.log(
      `\x1b[32m[APMod Invite]:\x1b[0m You can invite me by using this link: `
    );
    console.log(
      `\x1b[36m[APMod Invite]: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands\x1b[0m`
    );
  },
};
