const { Client, Message, EmbedBuilder, MessageAttachment } = require("discord.js");
const config = require("../../lib/config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "level",
  description: "Shows your current rank & level!",
  usage: "level",
  aliases: "",
  category: "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await Levels.fetch(target.id, message.guild.id);

    if (!user) {
      const u = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle(`${target.username} Level`)
        .setThumbnail(target.displayAvatarURL())
        .setDescription("Oops, it seems like this user has not earned any XP so far.")
        .setFooter({ text: "Leveling System By Ruchira" });

      message.channel.send({ embeds: [u] });
      return;
    }

    if (user) {
      const levelEmbed = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle(`${target.username} Level`)
        .setThumbnail(target.displayAvatarURL())
        .setDescription(`> **${target.tag}** is currently level ${user.level}.`)
        .setFooter({ text: "Leveling System By Ruchira" });

      message.channel.send({ embeds: [levelEmbed] });
    }
  },
};
