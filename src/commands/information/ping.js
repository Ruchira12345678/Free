const { Client, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: "ping",
  aliases: ["api"],
  description: "Get Bot Ping..",
  usage: "ping",
  category: "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const pingEmbed = new EmbedBuilder()
      .setColor(Colors.Red) // Use Colors.Red or a hex color code
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setTitle(`🎈 Ping : ${client.ws.ping}ms`)
      .setFooter({ text: "Coded by: Ruchira" });

    message.channel.send({ embeds: [pingEmbed] });
  },
};