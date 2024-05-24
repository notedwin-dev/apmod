const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The ID of the user to unban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the unban")
        .setRequired(false)
    ),
  async execute(interaction) {
    // Check if the user has permission to unban members
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

    // Get the user ID and reason
    const userId = interaction.options.getString("userid");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    try {
      await interaction.guild.members.unban(userId, reason);
      const embed = new EmbedBuilder()
        .setTitle("User Unbanned")
        .setDescription(`Successfully unbanned user with ID: \`${userId}\``)
        .addFields({ name: "Reason", value: reason })
        .setColor("Green");
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error unbanning user:", error);
      await interaction.reply(
        "There was an error while trying to unban the user. Please make sure the user ID is correct and the user is banned."
      );
    }
  },
};
