const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  async execute() {
    const commands = [];

    const clientId = process.env.CLIENT_ID;
    const token = process.env.BOT_TOKEN;

    // Grab all the command files from the commands directory you created earlier
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      // Grab all the command files from the commands directory you created earlier
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `\x1b[33m[APMOD WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.\x1b[0m`
          );
        }
      }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);

    try {
      console.log(
        `\x1b[32m[APMod Status]:\x1b[0m Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });

      console.log(
        `\x1b[32m[APMod Status]:\x1b[0m Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  },
};
