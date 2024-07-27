const { Client, Message, EmbedBuilder } = require('discord.js'); // Use EmbedBuilder for v14+
const config = require('../../../src/lib/config/config.json');

module.exports = {
  name: 'roles',
  aliases: ['serverroles'],
  description: 'Show all roles of the guild.',
  usage: 'roles',
  category: 'information',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      // Fetch and sort roles
      const roles = message.guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString());

      // Determine the role display content
      let rolesDisplay;
      if (roles.length <= 150) {
        rolesDisplay = roles.join(' ');
      } else {
        rolesDisplay = roles.slice(0, 150).join(' ') + ' ...'; // Show only the first 150 roles and append an ellipsis
      }

      // Create and send the embed
      const rolesEmbed = new EmbedBuilder()
        .setColor('#FF0000') // Use hex code for blue color
        .setTitle(`**❯ All Roles Of: ${message.guild.name}**`)
        .setDescription(rolesDisplay)
        .setThumbnail(message.guild.iconURL())
        .setImage('https://i.ibb.co/NYv9TFp/48820448e8362899b824035666cd57d2.jpg')
        .setFooter({ text: 'Thanks using Red Dragon bot Coded by: Ruchira' });

      await message.channel.send({ embeds: [rolesEmbed] });
    } catch (e) {
      console.error('Error sending roles embed:', e);
      await message.channel.send(`Oh no! An error occurred! \`${e.message}\``);
    }
  },
};
