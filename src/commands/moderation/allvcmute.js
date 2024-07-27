const { Client, Message, EmbedBuilder, ChannelType, Colors } = require("discord.js");

module.exports = {
  name: "allvcmute",
  aliases: [""],
  description: "Mute all members in a specified voice channel or your current voice channel.",
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
            .setDescription("You don't have permission to mute members.")
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

    // Mute all members in the voice channel except administrators
    const membersMuted = [];
    channel.members
      .filter((x) => !x.permissions.has("ADMINISTRATOR"))
      .forEach((x) => {
        x.voice.setMute(true);
        membersMuted.push(x.user.username);
      });

    // Send confirmation message
    if (membersMuted.length > 0) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Green color for success
            .setTitle("Voice Channel Muted")
            .setDescription(`All members in the \`${channel.name}\` channel have been silenced: ${membersMuted.join(', ')}.`)
        ],
      }).catch(console.error); // Catch potential errors
    } else {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Yellow color for caution
            .setTitle("No Members Muted")
            .setDescription(`There were no members to mute in the \`${channel.name}\` channel.`)
        ],
      }).catch(console.error); // Catch potential errors
    }
  },
};
