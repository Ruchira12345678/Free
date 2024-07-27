const { Client, Message, EmbedBuilder } = require("discord.js");
const db = require("../../lib/utils/models/on_of");
const mongoose = require('mongoose');
const config = require("../../lib/config/config.json");


mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));


module.exports = {
  name: "levelsetup",
  aliases: [""],
  description: "Setup the leveling system",
  usage: "",
  category: "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   */
  run: async (client, message, args, prefix) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply("You don't have permission to execute this command!");
    }

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        .setDescription(
          `❌ Missing arguments. Usage:\n\`\`${prefix}levelsetup <on/off>\`\`\n\nArguments:\n\`\`on/off\`\`: Turn the leveling system on or off`
        )
        .setColor("#ff4545");
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(() => msg.delete(), 6000);
      return;
    }

    const option = args[0].toLowerCase();
    if (option !== "on" && option !== "off") {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        .setDescription(`❌ Invalid option. Use \`\`on\`\` or \`\`off\`\`.`)
        .setColor("#ff4545");
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(() => msg.delete(), 6000);
      return;
    }

    try {
      const data = await db.findOne({ guildID: message.guild.id, type: "levels" });

      if (option === "on") {
        if (data) {
          await db.findOneAndUpdate(
            { guildID: message.guild.id, type: "levels" },
            { onOrOff: "on" }
          );
        } else {
          const newData = new db({
            guildID: message.guild.id,
            type: "levels",
            onOrOff: "on",
          });
          await newData.save();
        }

        const color = message.guild.me ? message.guild.me.displayHexColor || "#00FF00" : "#00FF00";
        const embed = new EmbedBuilder()
          .setDescription("✅ Level System is now **enabled**")
          .setColor(color);
        const msg = await message.channel.send({ embeds: [embed] });
        setTimeout(() => msg.delete(), 6000);
      } else if (option === "off") {
        if (data) {
          const levels = require("discord-xp/models/levels");
          await db.findOneAndDelete({ guildID: message.guild.id, type: "levels" });
          await levels.deleteMany({ guildID: message.guild.id });

          const color = message.guild.me ? message.guild.me.displayHexColor || "#FF0000" : "#FF0000";
          const embed = new EmbedBuilder()
            .setDescription("✅ Level System is now **disabled**")
            .setColor(color);
          const msg = await message.channel.send({ embeds: [embed] });
          setTimeout(() => msg.delete(), 6000);
        } else {
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(`❌ The leveling system is already off.`)
            .setColor("#ff4545");
          const msg = await message.channel.send({ embeds: [embed] });
          setTimeout(() => msg.delete(), 6000);
        }
      }
    } catch (err) {
      console.error(err);
      const embed = new EmbedBuilder()
        .setDescription("❌ An error occurred while updating the leveling system.")
        .setColor("#ff4545");
      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(() => msg.delete(), 6000);
    }
  },
};
