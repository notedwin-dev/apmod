const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user with a specified reason")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the warning")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has permission to warn members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.KickMembers
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
    const reason = interaction.options.getString("reason");

    if (!member) {
      return interaction.reply(
        "The specified user is not a member of this server."
      );
    }

    if (
      (member.permissions.has(PermissionsBitField.Flags.Administrator) &&
        interaction.user.id !== interaction.guild.ownerId) ||
      (member.permissions.has(PermissionsBitField.Flags.BanMembers) &&
        interaction.user.id !== interaction.guild.ownerId)
    ) {
      return interaction.reply(
        "You don't have the permission to warn someone who has the admin role."
      );
    }

    try {
      // Here you might want to implement your own warning system, for example, storing warnings in a database.
      // For this example, we'll just send a message.
      const embed = new EmbedBuilder()
        .setTitle("User Warned")
        .setDescription(`Successfully warned <@!${targetUser.id}>`)
        .addFields({ name: "Reason", value: reason })
        .setColor("Orange");
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error warning user:", error);
      await interaction.reply(
        "There was an error while trying to warn the user."
      );
    }
  },
};
