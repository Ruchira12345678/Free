const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'g-end',
  aliases: ['givewayend'],
  description: 'End a Giveaway',
  usage: '',
  category: 'giveaway',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // If the member doesn't have enough permissions
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
      !message.member.roles.cache.some((r) => r.name === 'Giveaways')
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You need to have the manage messages permissions to reroll giveaways.')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // If no message ID or giveaway name is specified
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to specify a valid message ID!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Try to find the giveaway with prize then with ID
    let giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === args.join(' ')
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if (!giveaway) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription('Unable to find a giveaway for `' + args.join(' ') + '`.'),
        ],
      });
    }

    // Edit the giveaway
    client.giveawaysManager
      .edit(giveaway.messageID, {
        setEndTimestamp: Date.now(),
      })
      // Success message
      .then(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription(
                'Giveaway will end in less than ' +
                  client.giveawaysManager.options.updateCountdownEvery / 1000 +
                  ' seconds...'
              )
              .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
              .setTimestamp(),
          ],
        });
      })
      .catch((e) => {
        if (
          e.startsWith(
            `Giveaway with message ID ${giveaway.messageID} is already ended.`
          )
        ) {
          message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('This giveaway is already ended!')
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
                .setDescription('An error occurred...')
                .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp(),
            ],
          });
        }
      });
  },
};
