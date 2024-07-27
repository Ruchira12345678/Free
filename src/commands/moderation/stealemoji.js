const { Client, Message, EmbedBuilder } = require('discord.js');
const { parse } = require('twemoji-parser');

module.exports = {
  name: 'stealemoji',
  aliases: ['addemoji', 'steal'],
  description: 'Steal an emoji from a different server',
  usage: '',
  category: 'moderation',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has('MANAGE_EMOJIS')) {
      const embed = new EmbedBuilder()
        .setDescription("You don't have the permissions to manage emojis")
        .setColor('#FF0000'); // Red color
      return message.channel.send({ embeds: [embed] });
    }

    const emoji = args[0];
    const name = args.slice(1).join(' ') || 'default_name';
    if (!emoji) {
      const embed = new EmbedBuilder()
        .setDescription('Please provide an emoji!')
        .setColor('#FF0000'); // Red color
      return message.channel.send({ embeds: [embed] });
    }

    try {
      // Handle URL emojis
      if (emoji.startsWith('https://cdn.discordapp.com')) {
        await message.guild.emojis.create({
          name: name,
          url: emoji
        });

        const embed = new EmbedBuilder()
          .setTitle('Emoji Added')
          .setThumbnail(emoji)
          .setColor('#00FF00') // Green color
          .setDescription(`Emoji has been added! | Name: ${name}`);
        return message.channel.send({ embeds: [embed] });
      }

      // Handle custom emojis
      const customEmojiRegex = /(?:<a?:\w+:(\d+)>)|(?:<a?:\w+:((?:\d+))>)/;
      const match = emoji.match(customEmojiRegex);
      
      if (match) {
        const emojiId = match[1] || match[2];
        const link = `https://cdn.discordapp.com/emojis/${emojiId}.${match[0].startsWith('<a:') ? 'gif' : 'png'}`;

        await message.guild.emojis.create({
          name: name,
          url: link
        });

        const embed = new EmbedBuilder()
          .setTitle(`Emoji Added <:${emojiId}>`)
          .setColor('#00FF00') // Green color
          .setThumbnail(link)
          .setDescription(`Emoji has been added! | Name: ${name} | Preview: [Click me](${link})`);
        return message.channel.send({ embeds: [embed] });
      } else {
        // Handle Unicode emojis
        const foundEmoji = parse(emoji, { assetType: 'png' });
        if (!foundEmoji[0]) {
          const embed = new EmbedBuilder()
            .setDescription('Please provide a valid emoji.')
            .setColor('#FF0000'); // Red color
          return message.channel.send({ embeds: [embed] });
        }
        const embed = new EmbedBuilder()
          .setDescription('This is a normal emoji, not an emoji that can be added to the server.')
          .setColor('#FF0000'); // Red color
        return message.channel.send({ embeds: [embed] });
      }
    } catch (e) {
      if (String(e).includes('DiscordAPIError: Maximum number of emojis reached (50)')) {
        const embed = new EmbedBuilder()
          .setDescription('Maximum emoji count reached for this server!')
          .setColor('#FF0000'); // Red color
        return message.channel.send({ embeds: [embed] });
      }

      console.error(e);
      const embed = new EmbedBuilder()
        .setDescription('An error occurred while adding the emoji.')
        .setColor('#FF0000'); // Red color
      return message.channel.send({ embeds: [embed] });
    }
  },
};
