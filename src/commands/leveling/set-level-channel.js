const { Client, Message, EmbedBuilder } = require("discord.js");
const Schema = require("../../lib/utils/models/level");

module.exports = {
  name: "set-levelup-channel",
  description: "Sets the channel where level-up messages will be sent.",
  usage: "set-levelup-channel #channel",
  aliases: ["setlevelup", "levelchannel"],
  category: "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply("You don't have permission to execute this command!");
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.channel.send("Please mention a channel like #level");
    }

    try {
      const data = await Schema.findOne({ Guild: message.guild.id });

      if (data) {
        data.Channel = channel.id;
        await data.save();
      } else {
        await new Schema({
          Guild: message.guild.id,
          Channel: channel.id,
        }).save();
      }

      const levelup = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("Level-UP Channel")
        .setDescription(`${channel} has been set as the Level-UP Channel`)
        .setThumbnail(
          "https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600"
        )
        .setFooter({ text: "Thanks using Red Dragon bot" });

      message.channel.send({ embeds: [levelup] });
    } catch (error) {
      console.error(error);
      message.reply("There was an error setting the level-up channel.");
    }
  },
};
