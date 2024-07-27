const { Client, Message, EmbedBuilder, ChannelType } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "createchat",
  aliases: ["makechannel", "createchannel"],
  description: "Create Text Channels in your Server",
  usage: "createchat <name>",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send("You don't have enough Permissions");
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color as fallback
            .setAuthor({ name: message.author.tag })
            .setTitle(`Usage: ${config.prefix}createchat <channel>`)
            .setDescription("Please mention the name for the Channel")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    try {
      await message.guild.channels.create({
        name: args.join(" "),
        type: ChannelType.GuildText, // Correct enum for text channel
        topic: "For chat"
      });

      const embed = new EmbedBuilder()
        .setTitle("Channel Updates")
        .setDescription(`Channel ${args.join(" ")} has been created`)
        .setColor('#FF0000') // Green color as fallback
        .setFooter({ text: config.footertext });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while creating the channel.");
    }
  },
};
