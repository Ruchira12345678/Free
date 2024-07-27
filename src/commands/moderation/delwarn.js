const { Client, Message, EmbedBuilder } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "delwarns",
  aliases: ["resetwarns"],
  description: "Reset warnings of mentioned person",
  usage: "delwarns <@user>",
  category: "moderation",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the user has the right permissions
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**You don't have the required permissions to reset warnings! - [ADMINISTRATOR]**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    // Fetch the user to reset warnings for
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please mention the user to reset warnings - `delwarns @mention`**")
            .setFooter({ text: "Coded by: TRuchira" })
        ]
      });
    }

    // Check if the user is a bot
    if (user.user.bot) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**You cannot reset warnings for bots**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    // Prevent resetting warnings for the command issuer
    if (message.author.id === user.id) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**You cannot reset your own warnings**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    // Check if there are warnings to reset
    const warnings = db.get(`warnings_${message.guild.id}_${user.id}`);
    if (warnings === null) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription(`**${user.user.tag}** does not have any warnings`)
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    // Delete warnings from the database
    db.delete(`warnings_${message.guild.id}_${user.id}`);

    // Notify the user about the reset
    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for reset notification
            .setAuthor({ name: message.author.tag })
            .setDescription(`**All your warnings have been reset by ${message.author.username} from ${message.guild.name}**`)
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    } catch (error) {
      console.error(`Could not send DM to ${user.user.tag}. Error: ${error.message}`);
    }

    // Notify the server about the reset
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FF0000') // Green color for success
          .setAuthor({ name: message.author.tag })
          .setDescription(`**All warnings for ${user.user.tag} have been reset**`)
          .setFooter({ text: "Coded by: Ruchira" })
      ]
    });
  },
};
