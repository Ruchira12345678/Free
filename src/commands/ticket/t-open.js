const { Client, Message, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
  name: 't-open',
  aliases: ['ticketopen'],
  description: 'Re-opens a ticket.',
  category: 'ticket',
  usage: '',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Ensure the command is used in a ticket channel
    if (message.channel.name.startsWith('ticket-')) {
      // Extract member ID from the channel name
      const memberId = message.channel.name.split('ticket-').join('');
      const member = message.guild.members.cache.get(memberId);

      if (!member) {
        return message.channel.send('The member associated with this ticket could not be found.');
      }

      try {
        // Update channel permissions to reopen the ticket
        await message.channel.permissionOverwrites.edit(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        });

        message.channel.send(`Successfully re-opened ${message.channel}`);
      } catch (e) {
        console.error(e);
        return message.channel.send('An error occurred while trying to reopen the ticket. Please try again.');
      }
    } else {
      return message.reply('You cannot use this command here. Please use this command in a closed ticket.');
    }
  },
};
