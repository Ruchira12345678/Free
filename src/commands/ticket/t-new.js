const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "t-new",
  aliases: ["open-ticket", "newtick"],
  category: "ticket",
  description: "Creates a new ticket.",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Ensure the bot is in a guild and has the required permissions
    const botMember = message.guild.members.me || message.guild.members.cache.get(client.user.id);

    if (!botMember || !botMember.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send(
        "I need the `MANAGE_CHANNELS` permission to use this command."
      );
    }

    // Check if the user already has a ticket
    const existingTicket = message.guild.channels.cache.find(
      (channel) => channel.name === `ticket-${message.author.id}`
    );
    if (existingTicket) {
      return message.reply(
        "You already have an open ticket. Please close your existing ticket before opening a new one."
      );
    }

    try {
      // Create a new ticket channel
      const channel = await message.guild.channels.create(`ticket-${message.author.id}`, {
        type: 'GUILD_TEXT', // Use 'GUILD_TEXT' for Discord.js v14
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
      });

      // Send a confirmation message to the user
      message.reply(
        `You have successfully created a ticket! Please click on ${channel} to view your ticket.`
      );

      // Send a welcome message in the new ticket channel
      channel.send(
        `Hi ${message.author}, welcome to your ticket! Please be patient; we will assist you shortly. If you would like to close this ticket, please run \`${config.prefix}close\`.`
      );

      // Log ticket creation in the ticket logs channel
      const logChannel = message.guild.channels.cache.find(
        (ch) => ch.name === 'ticket-logs'
      );
      if (logChannel) {
        logChannel.send(
          `Ticket ${message.author.tag} (ID: ${message.author.id}) created. Click the following to view: <#${channel.id}>`
        );
      }
    } catch (error) {
      console.error(`Error creating ticket: ${error}`);
      message.channel.send("There was an error trying to create your ticket. Please try again later.");
    }
  },
};
