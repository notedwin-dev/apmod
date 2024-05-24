const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user is an admin or server owner
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

    // Check if the ban target is the server owner
    const targetUser = interaction.options.getUser("user");
    if (targetUser.id === interaction.guild.ownerId) {
      return interaction.reply("You cannot ban the server owner.");
    }

    const reason = interaction.options.getString("reason");
    //Embed setup
    const embed = new EmbedBuilder()
      .setTitle("User Banned")
      .setDescription(`Successfully banned <@${targetUser.id}>`)
      .addFields({ name: "Reason", value: reason })
      .addFields({ name: "Moderator", value: `<@${interaction.user.id}>` })
      .addFields({ name: "Banned User ID", value: `\`${targetUser.id}\`` })
      .setColor("Red");

    // Check if the ban target is an admin
    const member = interaction.guild.members.cache.get(targetUser.id);
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      // If the command user is the server owner, allow banning an admin
      if (interaction.user.id === interaction.guild.ownerId) {
        try {
          await interaction.guild.members.ban(targetUser.id, { reason });
          return interaction.reply(
            `Successfully banned ${targetUser.tag} for: ${reason}`
          );
        } catch (error) {
          console.error("Error banning user:", error);
          return interaction.reply({ embeds: [embed] });
        }
      } else {
        return interaction.reply(
          "You cannot ban someone who has the admin role."
        );
      }
    }

    // Perform ban
    try {
      await interaction.guild.members.ban(targetUser.id, { reason });
      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error banning user:", error);
      await interaction.reply(
        "There was an error while trying to ban the user."
      );
    }
  },
};
