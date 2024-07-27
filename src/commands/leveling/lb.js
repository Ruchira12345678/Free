const { Client, Message, EmbedBuilder } = require("discord.js");
const config = require("../../lib/config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "leaderboard",
  category: "leveling",
  description: "Shows the message experience leaderboard",
  aliases: ["lb"],
  usage: "leaderboard <global|guild|channel>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

      if (rawLeaderboard.length < 1) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000) // Red color
          .setDescription("Nobody's on the leaderboard yet.");
        return message.channel.send({ embeds: [embed] });
      }

      const leaderboard = await Levels.computeLeaderboard(
        client,
        rawLeaderboard,
        true
      ); // We process the leaderboard.

      const lb = leaderboard.map(
        (e) =>
          `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
            e.level
          }\nXP: ${e.xp.toLocaleString()}`
      ); // We map the outputs.

      const lb2 = new EmbedBuilder()
        .setColor(0xFF0000) // Green color
        .setThumbnail(message.guild.iconURL())
        .setTitle("**Leaderboard**")
        .setDescription(`\n\n${lb.join("\n\n")}`)
        .setFooter({ text: "Coded By Ruchira" });

      message.channel.send({ embeds: [lb2] });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      const embed = new EmbedBuilder()
        .setColor(0xFF0000) // Red color
        .setDescription("An error occurred while fetching the leaderboard.");
      message.channel.send({ embeds: [embed] });
    }
  },
};
