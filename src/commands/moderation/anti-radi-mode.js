const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../lib/utils/models/anti-raid");

module.exports = {
  name: "anti-raidmode",
  description: "Enables anti-raidmode and won't allow new members to join.",
  usage: "enable/disable",
  aliases: ["anti-raid"],
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Ensure bot has the necessary permissions
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("You do not have the permission `ADMINISTRATOR`");
    }

    const botMember = message.guild.me;

    // Check if bot is present in the guild and has the required permissions
    if (!botMember) {
      return message.reply("I am not in this server.");
    }

    if (!botMember.permissions.has("KICK_MEMBERS")) {
      return message.reply("I do not have the permission `KICK_MEMBERS`.");
    }

    const options = ["enable", "disable"];

    if (!args.length) {
      return message.reply("Please enter either **enable** or **disable**");
    }

    const opt = args[0].toLowerCase();

    if (!options.includes(opt)) {
      return message.reply("Please enter either **enable** or **disable**");
    }

    if (opt === "enable") {
      schema.findOne({ Guild: message.guild.id }, async (err, data) => {
        if (err) {
          console.error(err);
          return message.reply("An error occurred while enabling anti-raid mode.");
        }
        if (!data) {
          data = new schema({ Guild: message.guild.id });
          await data.save();
          message.reply("Success! Anti-raid mode is enabled.");
        } else {
          message.reply("Anti-raid mode is already enabled.");
        }
      });
    } else if (opt === "disable") {
      schema.findOne({ Guild: message.guild.id }, async (err, data) => {
        if (err) {
          console.error(err);
          return message.reply("An error occurred while disabling anti-raid mode.");
        }
        if (!data) {
          return message.reply("Anti-raid mode is already disabled.");
        }
        await data.delete();
        message.reply("Anti-raid mode has been disabled.");
      });
    }
  },
};
