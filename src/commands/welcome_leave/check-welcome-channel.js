const { Client, Message, EmbedBuilder } = require("discord.js");
const Schema = require("../../lib/utils/models/welcome");

module.exports = {
  name: "check-welcome-channel",
  description: "Checks the welcome channel for the guild.",
  usage: "",
  aliases: ["cwchannel"],
  category: "welcome_leave",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("**You don't have the permissions to check welcome channels! - [MANAGE_MESSAGES]**")
            .setFooter({ text: "Coded by: Ruchira" })
            .setTimestamp()
        ]
      }).then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    try {
      const data = await Schema.findOne({ Guild: message.guild.id }).exec();

      if (!data)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setDescription("**This guild has no data stored!!**")
              .setFooter({ text: "Coded by: Ruchira" })
              .setTimestamp()
          ]
        });

      const channel = client.channels.cache.get(data.Channel);

      const welcome = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Welcome Channel")
        .setDescription(`Welcome Channel => ${channel}`)
        .setThumbnail("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
        .setFooter({ text: "Coded by: Ruchira" })
        .setTimestamp();

      message.channel.send({ embeds: [welcome] });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("**There was an error while fetching the data!**")
            .setFooter({ text: "Coded by: Ruchira " })
            .setTimestamp()
        ]
      });
    }
  },
};
