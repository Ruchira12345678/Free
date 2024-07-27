const { Client, Message, PermissionsBitField, MessageEmbed } = require('discord.js');
const config = require('../../lib/config/config.json');

module.exports = {
  name: 't-remove',
  aliases: ['ticketremove'],
  description: 'Removes a member from a specified ticket.',
  category: 'ticket',
  usage: '',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the command is used in a ticket channel
    if (message.channel.name.startsWith('ticket-')) {
      // Fetch the member from the arguments
      const member = 
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          (x) =>
            x.user.username === args.slice(0).join(' ') ||
            x.user.username === args[0]
        );

      // Validate member
      if (!member) {
        return message.channel.send(
          `Incorrect Usage! Correct Usage: \`${config.prefix}remove <member>\``
        );
      }

      try {
        // Update channel permissions to remove the member
        await message.channel.permissionOverwrites.edit(member.user, {
          VIEW_CHANNEL: false,
          SEND_MESSAGES: false,
          ATTACH_FILES: false,
          READ_MESSAGE_HISTORY: false,
        });

        message.channel.send(
          `Successfully removed ${member} from ${message.channel}`
        );
      } catch (e) {
        console.error(e);
        return message.channel.send('An error occurred, please try again!');
      }
    } else {
      return message.reply(
        'You cannot use this command here. Please use this command in a ticket channel.'
      );
    }
  },
};
