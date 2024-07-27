const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lock",
  aliases: [""],
  description: "Lock a Channel in Your Guild",
  usage: "lock <channel>",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let lockPermErr = new EmbedBuilder()
      .setTitle("**User Permission Error!**")
      .setDescription("**Sorry, you don't have permissions to use this! ❌**")
      .setColor('#FF0000'); // Optional: Set a color for the embed

    if (!message.channel.permissionsFor(message.member).has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [lockPermErr] });

    let channel = message.channel;

    try {
      message.guild.roles.cache.forEach((role) => {
        channel.permissionOverwrites.edit(role.id, {
          SendMessages: false,
          AddReactions: false,
        }).catch((e) => console.log(e));
      });
    } catch (e) {
      console.log(e);
    }

    const successEmbed = new EmbedBuilder()
      .setColor('#FF0000') // Optional: Set a color for the embed
      .setDescription('Done | Channel Locked!');

    message.channel.send({ embeds: [successEmbed] });
  },
};
