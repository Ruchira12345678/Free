const { Client, Message, EmbedBuilder } = require("discord.js");
const math = require("mathjs");

module.exports = {
  name: "calculate",
  aliases: ["cal", "math"],
  category: "utility",
  description: "Get the answer to a math problem",
  usage: "cal <question>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) return message.channel.send("Please provide a question");

    let resp;

    try {
      resp = math.evaluate(args.join(" "));
    } catch (e) {
      return message.channel.send("Please provide a **valid** question");
    }

    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(`Getting Answer of ${args}`)
            .setFooter({ text: `Coded by: Ruchira` }),
        ],
      })
      .then((msg) => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Calculator")
              .addFields(
                { name: "Question", value: `\`\`\`css\n${args.join(" ")}\`\`\`` },
                { name: "Answer", value: `\`\`\`css\n${resp}\`\`\`` }
              )
              .setFooter({ text: `Coded by: Ruchira` }),
          ],
        });
      });
  },
};
