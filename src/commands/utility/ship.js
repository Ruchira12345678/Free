const { Client, Message, EmbedBuilder } = require("discord.js");
const block = "⬛";
const heart = ":red_square:";

module.exports = {
  name: "ship",
  aliases: ["love"],
  category: "utility",
  description: "Check your relation with someone",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.channel.send("Please specify a user to ship with!");
    }
    
    if (user.id === message.author.id) {
      return message.reply("Bruh you want to ship yourself xd");
    }
    
    const user1 = message.author;
    const user2 = user;

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("Shipping...")
      .setDescription(`Shipped ${user1} and ${user2}!`)
      .setImage(
        `https://api.popcatdev.repl.co/ship?user1=${user1.displayAvatarURL(
          { dynamic: false, format: "png" }
        )}&user2=${user2.displayAvatarURL({ dynamic: false, format: "png" })}`
      )
      .addFields({ name: '**Ship Meter**', value: ship() });

    return message.channel.send({ embeds: [embed] });
  },
};

function ship() {
  const hearts = Math.floor(Math.random() * 110);
  const hearte = hearts / 10;

  const str = `${heart.repeat(hearte)}${block.repeat(11 - hearte)} ${hearts}%`;
  return str;
}
