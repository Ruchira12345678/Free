const { Client, Message, EmbedBuilder } = require('discord.js'); // Use EmbedBuilder for v14+
const moment = require('moment');

// Helper constants for the command
const filterLevels = {
  DISABLED: 'Off',
  MEMBERS_WITHOUT_ROLES: 'No Role',
  ALL_MEMBERS: 'Everyone',
};

const verificationLevels = {
  NONE: 'None',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: '(╯°□°）╯︵ ┻━┻',
  VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻',
};

const regions = {
  brazil: 'Brazil',
  europe: 'Europe',
  hongkong: 'Hong Kong',
  india: 'India',
  japan: 'Japan',
  russia: 'Russia',
  singapore: 'Singapore',
  southafrica: 'South Africa',
  sydeny: 'Sydeny',
  'us-central': 'US Central',
  'us-east': 'US East',
  'us-west': 'US West',
  'us-south': 'US South',
};

module.exports = {
  name: 'serverinfo',
  aliases: ['sinfo'],
  description: 'Shows info about a server',
  usage: 'serverinfo',
  category: 'information',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;
      const icon = message.guild.iconURL();
      const roles = message.guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString())
        .slice(0, -1); // Exclude @everyone role

      // Determine the role display content
      let rolesDisplay;
      if (roles.length <= 200) {
        rolesDisplay = roles.join(' ');
      } else {
        rolesDisplay = roles.slice(0, 200).join(' ') + ' ...'; // Show first 200 roles and add ellipsis
      }

      const emojis = message.guild.emojis.cache.map((e) => e.toString());
      const emojicount = message.guild.emojis.cache;

      // Create and send the embed
      const serverInfoEmbed = new EmbedBuilder()
        .setColor('#FF0000') // Red color
        .setTitle('Server Info')
        .setThumbnail(icon || 'https://i.ibb.co/NYv9TFp/48820448e8362899b824035666cd57d2.jpg') // Default thumbnail if icon is not available
        .setAuthor({ name: `This Guild Name is ${guild.name}` })
        .addFields([
          { name: 'Guild Owner', value: `${guild.owner}`, inline: true },
          { name: 'Server Region', value: regions[guild.preferredLocale] || 'Unknown', inline: true },
          { name: 'Member Count', value: `${guild.memberCount}`, inline: true },
          { name: 'Verification Level', value: verificationLevels[guild.verificationLevel] || 'Unknown', inline: true },
          { name: 'Rules Channel', value: guild.rulesChannel ? `${guild.rulesChannel}` : 'None', inline: true },
          { name: 'Boost Count', value: `${guild.premiumSubscriptionCount}`, inline: true },
          { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true },
          {
            name: 'Server Stats',
            value: `${
              guild.channels.cache.filter((channel) => channel.type === 'GUILD_TEXT').size
            } Text\n${
              guild.channels.cache.filter((channel) => channel.type === 'GUILD_VOICE').size
            } Voice\n${
              guild.channels.cache.filter((channel) => channel.type === 'GUILD_NEWS').size
            } News\n${
              guild.channels.cache.filter((channel) => channel.type === 'GUILD_CATEGORY').size
            } Categories`,
            inline: false,
          },
          {
            name: 'Emoji Count',
            value: `${emojicount.size}\n${
              emojicount.filter((emoji) => !emoji.animated).size
            } Non-Animated\n${
              emojicount.filter((emoji) => emoji.animated).size
            } Animated`,
            inline: true,
          },
          { name: 'Total Real Members', value: `${guild.members.cache.filter((member) => !member.user.bot).size}`, inline: true },
          { name: 'Total Bots', value: `${guild.members.cache.filter((member) => member.user.bot).size}`, inline: true },
          { name: 'Total Channels', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Total Text Channels', value: `${guild.channels.cache.filter((ch) => ch.type === 'GUILD_TEXT').size}`, inline: true },
          { name: 'Total Voice Channels', value: `${guild.channels.cache.filter((ch) => ch.type === 'GUILD_VOICE').size}`, inline: true },
          { name: 'Created On', value: `${guild.createdAt.toLocaleString()}`, inline: true },
          { name: 'Roles Count', value: `${guild.roles.cache.size}`, inline: true },
        ])
        .setFooter({ text: 'Coded by: Ruchira' });

      await message.channel.send({ embeds: [serverInfoEmbed] });
    } catch (e) {
      console.error('Error sending server info embed:', e);
      await message.channel.send(`Oh no! An error occurred! \`${e.message}\``);
    }
  },
};
