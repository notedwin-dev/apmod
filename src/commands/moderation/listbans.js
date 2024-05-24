const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listbans")
    .setDescription("Get a list of banned users"),
  async execute(interaction) {
    // Check if the user has permission to view the ban list
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.BanMembers
      ) &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      interaction.user.id !== interaction.guild.ownerId
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }

    try {
      const banList = await interaction.guild.bans.fetch();
      if (banList.size === 0) {
        return interaction.reply("There are no banned users in this server.");
      }

      const embed = new EmbedBuilder()
        .setTitle("Banned Users")
        .setColor("Grey");

      banList.forEach((ban) => {
        embed.addFields({
          name: ban.user.tag,
          value: `ID: ${ban.user.id}\nReason: ${
            ban.reason || "No reason provided"
          }`,
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching ban list:", error);
      await interaction.reply(
        "There was an error while trying to fetch the ban list."
      );
    }
  },
};
