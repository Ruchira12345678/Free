const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "djs",
  aliases: ["discord.js"],
  category: "utility",
  description: "search docs about discord.js",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const searchQuery = args.join(" ");
    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
      searchQuery
    )}`;
    
    try {
      const res = await fetch(url);
      const embed = await res.json();

      if (embed && !embed.error) {
        message.channel.send({ embeds: [embed] });
      } else {
        const embed2 = new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(`There isn't anything related to \`${searchQuery}\``);
        return message.channel.send({ embeds: [embed2] });
      }
    } catch (err) {
      const embed3 = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("**There was an error doing that!**");
      return message.channel.send({ embeds: [embed3] });
    }
  },
};
