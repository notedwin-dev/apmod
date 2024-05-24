const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user for a specified duration")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the timeout in seconds")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the timeout")
        .setRequired(false)
    ),
  async execute(interaction) {
    // Check if the user has permission to timeout members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
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

    const targetUser = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(targetUser.id);
    const duration = interaction.options.getInteger("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member) {
      return interaction.reply(
        "The specified user is not a member of this server."
      );
    }

    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply(
        "You cannot timeout someone who has the admin role."
      );
    }

    try {
      await member.timeout(duration * 1000, reason);
      const embed = new EmbedBuilder()
        .setTitle("User Timed Out")
        .setDescription(`Successfully timed out <@!${targetUser.id}>`)
        .addFields({ name: "Duration", value: `${duration} seconds` })
        .addFields({ name: "Reason", value: reason })
        .setColor("Yellow");
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error timing out user:", error);
      await interaction.reply(
        "There was an error while trying to timeout the user."
      );
    }
  },
};
