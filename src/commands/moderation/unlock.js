const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unlock",
  aliases: [],
  description: "Unlocks a channel in your guild.",
  usage: "unlock",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const noPermissionEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("**User Permission Error!**")
      .setDescription("**Sorry, you don't have permissions to use this command! ❌**")
      .setFooter({ text: "Coded by: Ruchira" });

    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel.send({ embeds: [noPermissionEmbed] });
    }

    let channel = message.channel;

    try {
      // Unlock the channel for all roles
      message.guild.roles.cache.forEach(async (role) => {
        try {
          await channel.permissionOverwrites.edit(role.id, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true,
          });
        } catch (error) {
          console.error(`Failed to update permissions for role ${role.id}:`, error);
        }
      });

      let successEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("✅ Channel has been successfully unlocked!")
        .setFooter({ text: "Coded by: Ruchira" });

      await message.channel.send({ embeds: [successEmbed] });

    } catch (error) {
      console.error("Error unlocking channel:", error);
      let errorEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("❌ An error occurred while trying to unlock the channel.")
        .setFooter({ text: "Coded by: Ruchira" });

      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
