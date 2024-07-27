const { Client, Message, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  name: 'channelinfo',
  aliases: ['ci', 'channeli', 'cinfo'],
  category: 'information',
  description: 'Shows Channel Info',
  usage: '[channel mention | channel name | ID] (optional)',
  accessableby: 'everyone',

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Fetch the channel
    const channel =
      message.mentions.channels.first() ||
      client.guilds.cache.get(message.guild.id)?.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find(
        (r) => r.name.toLowerCase() === args.join(' ').toLowerCase()
      ) ||
      message.channel;

    if (!channel) return message.channel.send('**Channel Not Found!**');

    // Ensure the thumbnail URL is valid
    const guildIconURL = message.guild.iconURL();
    const thumbnailURL = guildIconURL ? guildIconURL : 'https://example.com/default-image.png';

    // Create the embed
    const channelembed = new EmbedBuilder()
      .setTitle(`Channel Information for ${channel.name}`)
      .setThumbnail(thumbnailURL)
      .addFields(
        { name: '**NSFW**', value: channel.nsfw ? 'Yes' : 'No', inline: true },
        { name: '**Channel ID**', value: channel.id, inline: true },
        { name: '**Channel Type**', value: capitalize(channel.type), inline: true },
        { name: '**Channel Description**', value: channel.topic || 'No Description', inline: false },
        { name: '**Channel Created At**', value: new Date(channel.createdTimestamp).toLocaleDateString(), inline: false }
      )
      .setColor('#00FF00'); // Use a hex color code for Green

    // Send the embed
    message.channel.send({ embeds: [channelembed] });
  },
};

/**
 * Capitalize the first letter of each word
 * @param {any} value - The value to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalize(value) {
  if (typeof value !== 'string') {
    return 'Unknown'; // Return a default value if not a string
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}
