const { Client, Message, EmbedBuilder, Channel } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "delchannel",
  aliases: ["delch", "deletechannel"],
  description: "Delete Channels From your Server",
  usage: "delchannel <channel>",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for permission error
            .setAuthor({ name: message.author.tag })
            .setDescription("You don't have enough permissions to manage channels!")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    const fetchedChannel = message.mentions.channels.first() || 
                           message.guild.channels.cache.get(args[0]);
                           
    if (!fetchedChannel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for usage error
            .setAuthor({ name: message.author.tag })
            .setTitle(`Usage: ${config.prefix}delchannel <channel>`)
            .setDescription("Please mention a channel or provide its ID to delete.")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    try {
      await fetchedChannel.delete();
      
      const embed = new EmbedBuilder()
        .setTitle(`Channel ${fetchedChannel.name} has been deleted`)
        .setColor('#FF0000') // Green color for success
        .setFooter({ text: config.footertext });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setDescription("An error occurred while deleting the channel. Please try again.")
            .setFooter({ text: config.footertext })
        ]
      });
    }
  },
};
