const { Client, Message, EmbedBuilder } = require("discord.js");
const { afk } = require("../../lib/utils/etc/afk");

module.exports = {
  name: "afk",
  description: "An AFK command!",
  category: "utility",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const reason = args.join(" ") || "No reason!";

    afk.set(message.author.id, [Date.now(), reason]);

    const afkEmbed = new EmbedBuilder()
      .setDescription(`You have been set as AFK. \`${reason}\``)
      .setTimestamp()
      .setColor("#FF0000")
      .setFooter({ text: "Coded by: Ruchira" });

    message.channel.send({ embeds: [afkEmbed] });
  },
};
