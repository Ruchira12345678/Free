const { Client, Message, PermissionsBitField, MessageEmbed } = require('discord.js');
const config = require('../../lib/config/config.json');

module.exports = {
  name: 't-add',
  aliases: ['ticketadd'],
  category: 'ticket',
  description: 'Adds a member to a specified ticket.',
  usage: '<member>',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check for required permissions
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.channel.send(
        'I need the `MANAGE_CHANNELS` permission to use this command.'
      );
    }

    // Ensure the command is used in a ticket channel
    if (message.channel.name.startsWith('ticket-')) {
      // Lookup the member
      const member = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(m => m.user.username === args.join(' '));

      if (!member) {
        return message.channel.send(
          `Incorrect usage! Correct usage: \`${config.prefix}${module.exports.name} <member>\``
        );
      }

      try {
        // Update channel permissions
        await message.channel.permissionOverwrites.edit(member.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        });

        // Send confirmation message
        return message.channel.send(
          `Successfully added ${member} to ${message.channel}`
        );
      } catch (error) {
        console.error(error);
        return message.channel.send(
          '**An error occurred, please try again!**'
        );
      }
    } else {
      return message.channel.send(
        'This command can only be used in a ticket channel.'
      );
    }
  },
};
