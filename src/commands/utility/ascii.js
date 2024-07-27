const { Client, Message, EmbedBuilder } = require("discord.js");
const figlet = require("figlet");

module.exports = {
  name: "ascii",
  aliases: ["i-text"],
  category: "utility",
  description: "Get ascii Text",
  usage: "ascii <text>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.channel.send("Please provide some text");
    }

    const msg = args.join(" ");

    figlet.text(msg, (err, data) => {
      if (err) {
        console.log("Something went wrong");
        console.dir(err);
        return;
      }
      if (data.length > 2000) {
        return message.channel.send(
          "Please provide text shorter than 2000 characters"
        );
      }

      const asciiEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`${msg} converted to Ascii text`)
        .setDescription("```" + data + "```")
        .setFooter({ text: "Coded by: Ruchira" });

      message.channel.send({ embeds: [asciiEmbed] });
    });
  },
};
