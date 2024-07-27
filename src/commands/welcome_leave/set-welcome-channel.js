const { Client, Message, EmbedBuilder } = require("discord.js");
const Schema = require("../../lib/utils/models/welcome");

module.exports = {
  name: "set-welcome",
  description: "Sets the channel for welcome messages.",
  usage: "<#channel>",
  aliases: ["swelcome"],
  category: "welcome_leave",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if user has permission
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("**You don't have the permissions to set a welcome channel! - [MANAGE_MESSAGES]**")
            .setFooter({ text: "Coded by: Ruchira" })
            .setTimestamp()
        ]
      }).then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    // Get the mentioned channel or default to current channel
    const channel = message.mentions.channels.first() || message.channel;
    if (!channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("**Please mention a valid channel!**")
            .setFooter({ text: "Coded by: Ruchira" })
            .setTimestamp()
        ]
      }).then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    try {
      // Check if the guild data already exists
      const data = await Schema.findOne({ Guild: message.guild.id }).exec();
      
      if (data) {
        // Update existing data
        data.Channel = channel.id;
        await data.save();
      } else {
        // Create new entry
        await new Schema({
          Guild: message.guild.id,
          Channel: channel.id,
        }).save();
      }

      // Send success message
      const welcomeEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Welcome Channel")
        .setDescription(`${channel} has been set as the Welcome Channel`)
        .setThumbnail("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
        .setFooter({ text: "Coded by: Ruchira" })
        .setTimestamp();

      message.channel.send({ embeds: [welcomeEmbed] });
    } catch (error) {
      console.error(error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("**There was an error while setting the welcome channel!**")
            .setFooter({ text: "Coded by: Ruchira" })
            .setTimestamp()
        ]
      });
    }
  },
};
