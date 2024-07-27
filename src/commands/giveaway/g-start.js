const { Client, Message, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'g-start',
  aliases: ['givewaystart'],
  description: 'Start a Giveaway in Server',
  usage: '',
  category: 'giveaway',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let rolename = null;
    let BonusEntries = null;

    // Check permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && 
        !message.member.roles.cache.some(r => r.name === 'Giveaways')) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You need to have the manage messages permission to start giveaways.')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Giveaway channel
    const giveawayChannel = message.mentions.channels.first();
    if (!giveawayChannel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to mention a valid channel!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Giveaway duration
    const giveawayDuration = args[1];
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to specify a valid duration!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Number of winners
    const giveawayNumberWinners = parseInt(args[2]);
    if (isNaN(giveawayNumberWinners) || giveawayNumberWinners <= 0) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to specify a valid number of winners!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Giveaway prize
    const giveawayPrize = args.slice(3).join(' ');
    if (!giveawayPrize) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(':x: You have to specify a valid prize!')
            .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp(),
        ],
      });
    }

    // Ask for bonus entries
    await message.channel.send('Do you want any bonus entries? (yes/no)');
    const filter = (m) => m.author.id === message.author.id;
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });

    if (collected.first().content.toLowerCase() === 'yes') {
      await message.channel.send('Alright, which role will have bonus entries?');
      const roleMsg = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      rolename = roleMsg.first().content;

      const role = message.guild.roles.cache.find(r => r.name === rolename);
      if (!role) {
        await message.channel.send(`No such role found! Skipping bonus entries.`);
        rolename = null;
      } else {
        await message.channel.send(`How many bonus entries will we have for ${rolename}?`);
        const bonusMsg = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        BonusEntries = parseInt(bonusMsg.first().content);
        await message.channel.send(`✅ Alright **${rolename}** will have **${BonusEntries}** extra entries.`);
      }
    } else if (collected.first().content.toLowerCase() === 'no') {
      await message.channel.send('Alright, skipping bonus entries.');
    } else {
      await message.channel.send('Invalid response, skipping bonus entries.');
    }

    // Start the giveaway
    await client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayNumberWinners,
      bonusEntries: rolename ? [
        {
          bonus: (member) => member.roles.cache.some(r => r.name === rolename) ? BonusEntries : null,
          cumulative: false,
        },
      ] : [],
      hostedBy: client.config.hostedBy ? message.author : null,
      messages: {
        giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY** 🎉🎉",
        giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: "React with 🎉 to participate!",
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false,
        },
      },
    });

    // Notify about bonus entries
    if (rolename) {
      const mentionfetch = message.guild.roles.cache.find(r => r.name === rolename);
      const giveawayEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Bonus Entries Alert!' })
        .setDescription(`**${mentionfetch}** has **${BonusEntries}** extra entries in this giveaway!`)
        .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() });
      await giveawayChannel.send({ embeds: [giveawayEmbed] });
    }

    // Confirmation message
    await message.channel.send(`Giveaway started in ${giveawayChannel}!`);
  },
};
