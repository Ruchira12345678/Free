const { Client, Message, EmbedBuilder } = require("discord.js");
const Zalgo = require("to-zalgo");

module.exports = {
  name: "zalgo",
  aliases: ["zlg"],
  description: "Converts your text to Zalgo",
  category: "utility",
  usage: "zalgo <text>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args.length) return message.reply("Please provide text to convert to Zalgo!");

    const text = args.join(" ");

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Your Text`)
      .setDescription(Zalgo(text))
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
