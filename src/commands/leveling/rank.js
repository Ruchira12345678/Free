const { Client, Message, MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
const db = require("quick.db");
const config = require("../../lib/config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "rank",
  description: "Displays the user's rank and experience.",
  usage: "rank",
  aliases: [],
  category: "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      if (!user) {
        return message.reply("You have no rank information yet.");
      }

      const neededXp = Levels.xpFor(parseInt(user.level) + 1);

      const rank = new canvacord.Rank()
        .setAvatar(
          message.author.displayAvatarURL({ dynamic: false, format: "png" })
        )
        .setCurrentXP(user.xp)
        .setLevel(user.level)
        .setRequiredXP(neededXp)
        .setStatus(message.member.presence.status || "offline")
        .setProgressBar("WHITE", "COLOR")
        .setUsername(message.author.username)
        .setDiscriminator(message.author.discriminator);

      const data = await rank.build();
      const attachment = new MessageAttachment(data, "AxelRank.png");
      message.channel.send({ files: [attachment] });
    } catch (e) {
      console.error(e);
      message.reply("There was an error generating your rank card.");
    }
  },
};
