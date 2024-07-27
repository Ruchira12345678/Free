const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av", "pfp", "pic"],
  category: "utility",
  description: "Get your own or someone else's avatar",
  usage: "[user mention]",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;

    const av = new EmbedBuilder()
      .setColor("FF0000")
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Here is the avatar of ${user.tag}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setDescription(
        `:frame_photo: [PNG](${user.displayAvatarURL({
          format: "png",
        })}) | :frame_photo: [JPG](${user.displayAvatarURL({
          format: "jpg",
        })}) | :frame_photo: [WEBP](${user.displayAvatarURL({ format: "webp" })})\nYour PFP is Op :blush:`
      )
      .setFooter({ text: `Coded by: Ruchira`, iconURL: client.user.displayAvatarURL() });

    message.channel.send({ embeds: [av] });
  },
};
