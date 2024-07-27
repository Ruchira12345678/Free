const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'role',
  aliases: ['rl', 'roleinfo'], // Fixed the spelling from 'aliase' to 'aliases'
  description: 'This command provides information about a role.',
  usage: 'prefix <role>',
  category: 'information',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Determine the role based on arguments
    let role;
    if (args[0] && isNaN(args[0]) && message.mentions.roles.size > 0) {
      role = message.mentions.roles.first();
    } else if (args[0] && isNaN(args[0])) {
      role = message.guild.roles.cache.find(
        (e) =>
          e.name.toLowerCase() === args.join(' ').toLowerCase().trim()
      );
    } else if (args[0] && !isNaN(args[0])) {
      role = message.guild.roles.cache.get(args[0]);
    }

    // Error handling if role is not found
    if (!role) return message.reply(':x: Role not found');

    // Build role members list
    let rolemembers = role.members.size > 20
      ? role.members
          .map((e) => `<@${e.id}>`)
          .slice(0, 20)
          .join(', ') + ` and ${role.members.size - 20} more members...`
      : role.members.map((e) => `<@${e.id}>`).join(', ');

    // Create and send the embed
    let embed = new MessageEmbed()
      .setColor(role.color || '#FFFFFF') // Default to white if role.color is not available
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(
        `**Role Name:** ${role.name} (<@&${role.id}>)\n\n` +
        `**Role ID:** \`${role.id}\`\n\n` +
        `**Role Mentionable:** ${role.mentionable ? 'Yes' : 'No'}\n\n` +
        `**Role Members Size:** ${role.members.size || 0}`
      )
      .addField('Role Members:', rolemembers || 'Not Found');

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error('Error sending role info embed:', e);
      await message.channel.send(`Oh no! An error occurred! \`${e.message}\``);
    }
  },
};
