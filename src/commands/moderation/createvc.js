const { Client, Message, EmbedBuilder, ChannelType } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "createvc",
  aliases: ["makevc", "voicechannel"],
  description: "Create voice Channels in your Server",
  usage: "createvc <name>",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send("You don't have enough permissions");
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color as fallback
            .setAuthor({ name: message.author.tag })
            .setTitle(`Usage: ${config.prefix}createvc <channel>`)
            .setDescription("Please provide a name for the channel")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    try {
      await message.guild.channels.create({
        name: args.join(" "),
        type: ChannelType.GuildVoice // Correct enum for voice channel
        // No topic for voice channels
      });

      const embed = new EmbedBuilder()
        .setTitle("Channel Updates")
        .setDescription(`Voice channel ${args.join(" ")} has been created`)
        .setColor('#FF0000') // Green color as fallback
        .setFooter({ text: config.footertext });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while creating the channel.");
    }
  },
};
