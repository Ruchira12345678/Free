const { Client, Message, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const { prefix } = require("../..");

module.exports = {
  name: "translate",
  aliases: ["ts"],
  category: "utility",
  description: "Google Translate",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const query = args.slice(1).join(" ");
      if (!query) {
        return message.reply(
          `Don't leave this blank! Try this: \`${prefix}translate <language> Hello! I'm Altmr!\``
        );
      }
      const arg = args[0];

      const translated = await translate(query, { to: `${arg}` });
      const embed = new EmbedBuilder()
        .setTitle("Translated!")
        .addFields(
          { name: "Your Query", value: `\`\`\`fix\n${query}\`\`\``, inline: false },
          { name: "Selected Language", value: `\`\`\`fix\n${arg}\`\`\``, inline: false },
          { name: "Result", value: `\`\`\`fix\n${translated.text}\`\`\``, inline: false }
        )
        .setFooter({ text: `© ${client.user.username}` })
        .setColor("#FF0000");

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return message.channel.send(
        `Your question is invalid! Try this: \`${prefix}translate <language> <query>\``
      );
    }
  },
};
