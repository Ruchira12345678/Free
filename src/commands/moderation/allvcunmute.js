const { Client, Message, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "allvcunmute",
  aliases: [""],
  description: "Unmute all members in a voice channel.",
  usage: "[channelID]",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the user has permission to mute members
    if (!message.member.permissions.has("MUTE_MEMBERS")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color
            .setTitle("Permission Denied")
            .setDescription("You don't have permission to unmute members.")
        ],
      }).catch(console.error); // Catch potential errors
    }

    // Determine the voice channel
    let channel =
      message.guild.channels.cache.get(args[0]) || message.member.voice.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color
            .setTitle("Invalid Channel")
            .setDescription("You must enter a valid channel ID or be in a voice channel.")
        ],
      }).catch(console.error); // Catch potential errors
    }

    // Unmute all members in the voice channel except administrators
    channel.members
      .filter((x) => !x.permissions.has("ADMINISTRATOR"))
      .forEach((x) => {
        x.voice.setMute(false).catch(console.error); // Catch potential errors
      });

    // Send confirmation message
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FF0000') // Green color for success
          .setTitle(`All members in the \`${channel.name}\` channel have been unmuted.`)
      ],
    }).catch(console.error); // Catch potential errors
  },
};
