const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'g-reroll',
  aliases: ['greroll'],
  description: 'Reroll a giveaway to select new winners.',
  usage: '<message_id> | <prize>',
  category: 'giveaway',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && 
        !message.member.roles.cache.some(r => r.name === 'Giveaways')) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You need to have the manage messages permission to reroll giveaways.')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Check for a valid message ID or giveaway prize
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to specify a valid message ID or giveaway prize!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Find the giveaway by prize or message ID
    let giveaway =
      client.giveawaysManager.giveaways.find(g => g.prize === args.join(' ')) ||
      client.giveawaysManager.giveaways.find(g => g.messageID === args[0]);

    // If no giveaway was found
    if (!giveaway) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(`:x: Unable to find a giveaway for \`${args.join(' ')}\`.`)
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
      .then(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#00FF00')
              .setDescription('✅ Giveaway rerolled successfully!')
              .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
              .setTimestamp(),
          ],
        });
      })
      .catch((e) => {
        if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)) {
          message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ This giveaway is not ended yet!')
                .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp(),
            ],
          });
        } else {
          console.error(e);
          message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ An error occurred while rerolling the giveaway.')
                .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp(),
            ],
          });
        }
      });
  },
};
