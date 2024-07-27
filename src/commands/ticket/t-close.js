const { Client, Message, MessageEmbed, PermissionsBitField } = require('discord.js');
const sourcebin = require('sourcebin_js');

module.exports = {
  name: 't-close',
  aliases: [],
  category: 'ticket',
  description: 'Closes the ticket.',
  usage: '',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the command is used in a ticket channel
    if (message.channel.name.startsWith('ticket-')) {
      const memberId = message.channel.name.split('ticket-').join('');
      const member = message.guild.members.cache.get(memberId);

      // Check if the user has appropriate permissions or is the ticket owner
      if (message.member.permissions.has(PermissionsBitField.Flags.Administrator) || 
          message.channel.name === `ticket-${message.author.id}`) {

        try {
          // Fetch messages from the channel
          const messages = await message.channel.messages.fetch();
          const output = messages
            .array()
            .reverse()
            .map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`)
            .join('\n');

          // Create a sourcebin for the transcript
          const response = await sourcebin.create(
            [{
              name: ' ',
              content: output,
              languageId: 'text'
            }],
            {
              title: `Chat transcript for ${message.channel.name}`,
              description: ' '
            }
          );

          // Send the transcript link to the member
          const embed = new MessageEmbed()
            .setDescription(`[📄 View](${response.url})`)
            .setColor('#FF0000');
          await member.send({
            content: 'Here is a transcript of your ticket, please click the link below to view the transcript:',
            embeds: [embed]
          });

          // Update channel permissions to prevent further interaction
          await message.channel.permissionOverwrites.edit(member.id, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false
          });

          // Notify the channel that the ticket has been closed
          await message.channel.send(`Successfully closed ${message.channel}!`);

        } catch (error) {
          console.error(error);
          return message.channel.send('An error occurred, please try again!');
        }
      } else {
        return message.reply('You do not have permission to close this ticket.');
      }
    } else {
      return message.reply('You cannot use this command here. Please use this command when you\'re closing a ticket.');
    }
  }
};
