const { Client, Message, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { prefix } = require('../..'); // Adjust the path to your prefix configuration

module.exports = {
  name: 'g-create',
  aliases: ['create-giveaway'],
  description: 'Create a giveaway',
  usage: '',
  category: 'giveaway',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Initialize embeds
    const embed = new EmbedBuilder()
      .setTitle('Create A Giveaway!')
      .setColor('#FF0000')
      .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const xembed = new EmbedBuilder()
      .setTitle('Oops! Looks Like We Met A Timeout! 🕖')
      .setColor('#FF0000')
      .setDescription(
        '💥 Snap our luck!\nYou took too much time to decide!\nUse `create` again to start a new giveaway!\nTry to respond within **30 seconds** this time!'
      )
      .setFooter({ text: `Coded by ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    // Send the initial message
    const msg = await message.channel.send({
      embeds: [
        embed.setDescription(
          'In which channel would you like the giveaway to start in?\nPlease tag the channel or provide its ID.\n**Must Reply within 30 seconds!**'
        ),
      ],
    });

    // Create a message collector
    const filter = (m) => m.author.id === message.author.id && !m.author.bot;
    const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

    collector.on('collect', async (collect) => {
      const response = collect.content;
      let chn =
        collect.mentions.channels.first() ||
        message.guild.channels.cache.get(response);
      if (!chn) {
        return msg.edit({
          embeds: [
            embed.setDescription(
              'Uh-Oh! Looks like you provided an invalid channel!\n**Try Again?**\nExample: `#giveaways`, `677813783523098627`'
            ),
          ],
        });
      } else {
        channel = chn;
        collector.stop();
        msg.edit({
          embeds: [
            embed.setDescription(
              `Alright! Next, how long do you want me to host the giveaway in ${channel} for?\n**Must Reply within 30 seconds!**`
            ),
          ],
        });

        // Collect duration
        const collector2 = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
        collector2.on('collect', async (collect2) => {
          let mss = ms(collect2.content);
          if (!mss) {
            return msg.edit({
              embeds: [
                embed.setDescription(
                  'Aw snap! Looks like you provided me with an invalid duration\n**Try Again?**\nExample: `10 minutes`, `10m`, `10`'
                ),
              ],
            });
          } else {
            time = mss;
            collector2.stop();
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Alright! Next, how many winners should I roll for the giveaway?\n**Must Reply within 30 seconds!**`
                ),
              ],
            });

            // Collect number of winners
            const collector3 = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
            collector3.on('collect', async (collect3) => {
              const response3 = collect3.content;
              if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
                return msg.edit({
                  embeds: [
                    embed.setDescription(
                      'Boi! Winners must be a number greater than or equal to one!\n**Try Again?**\nExample: `1`, `10`, etc.'
                    ),
                  ],
                });
              } else {
                winnersCount = parseInt(response3);
                collector3.stop();
                msg.edit({
                  embeds: [
                    embed.setDescription(
                      `Alright! Next, what should be the prize for the giveaway?\n**Must Reply within 30 seconds!**`
                    ),
                  ],
                });

                // Collect prize
                const collector4 = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                collector4.on('collect', async (collect4) => {
                  prize = collect4.content;
                  collector4.stop();
                  msg.edit({
                    embeds: [
                      embed.setDescription(
                        "Alright! Next, do you want to have a server joining requirement for the giveaway? If yes, provide the server's permanent invite link!\n**Must Reply within 30 seconds!**\n**Bot Must Be In The Server!**\n**Respond with `none` if no requirements!**"
                      ),
                    ],
                  });

                  // Collect server invite
                  const collector5 = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });
                  collector5.on('collect', async (collect5) => {
                    const response5 = collect5.content;
                    if (response5.toLowerCase() !== 'none') {
                      try {
                        const guild = message.guild;
                        const invites = await guild.invites.fetch();
                        const invite = invites.find((inv) => inv.url === response5);
                        if (!invite) {
                          return message.channel.send({
                            embeds: [
                              new EmbedBuilder()
                                .setColor('#FF0000')
                                .setTitle('Invalid Invite Link')
                                .setDescription('The invite link provided is not valid or I am not a member of that server.')
                                .setFooter({ text: `Coded by ${client.user.username}` })
                                .setTimestamp(),
                            ],
                          });
                        }

                        collector5.stop();
                        msg.edit({
                          embeds: [
                            embed.setDescription(
                              `Alright! Giveaway has been started in ${channel} for **${prize}** which will last for **${ms(
                                time,
                                { long: true }
                              )}** and there will be **${winnersCount}** winner(s)! Users would have to join ${response5}`
                            ),
                          ],
                        });
                        client.giveawaysManager.start(channel, {
                          time: parseInt(time),
                          prize: prize,
                          hostedBy: client.config.hostedBy ? message.author : null,
                          winnerCount: parseInt(winnersCount),
                          messages: {
                            giveaway: '**Giveaway!**',
                            giveawayEnded: '**GIVEAWAY ENDED**',
                            timeRemaining: '**Time Remaining : {duration}**',
                            inviteToParticipate: '**React with 🎉 to participate!**',
                            winMessage: 'Congratulations, {winners}! You won **{prize}**!',
                            embedFooter: 'Giveaways',
                            hostedBy: '**Hosted By: {user}**',
                            noWinner: '**Uh oh! Looks like we got no reactions on this giveaway :<**.',
                            winners: 'Lucky Winner(s) In This Giveaway',
                            endedAt: 'Winners rolled at',
                            units: {
                              seconds: 'seconds',
                              minutes: 'minutes',
                              hours: 'hours',
                              days: 'days',
                            },
                          },
                          extraData: {
                            server: `${invite.guild.id}`,
                          },
                        });
                      } catch (error) {
                        console.error('Error fetching invite:', error);
                        message.channel.send({
                          embeds: [
                            new EmbedBuilder()
                              .setColor('#FF0000')
                              .setTitle('Error')
                              .setDescription('An error occurred while processing the invite.')
                              .setFooter({ text: `Coded by ${client.user.username}` })
                              .setTimestamp(),
                          ],
                        });
                      }
                    } else {
                      message.channel.send(
                        `**Please use the command \`\`${prefix}start\`\` instead to make a giveaway without a server requirement**`
                      );
                    }
                  });
                });
              }
            });
          }
        });
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        message.channel.send({ embeds: [xembed] });
      }
    });
  },
};
