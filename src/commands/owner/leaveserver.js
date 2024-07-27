const { Client, Message, EmbedBuilder, PermissionsBitField } = require("discord.js");
let ownerid = "1245350752940200010";
let ownerid2 = "1245350752940200010";

module.exports = {
  name: "leaveserver",
  aliases: ["lvs"],
  description: "Bot can leave a server with this command",
  category: "owner",
  usage: "",
  accessibleby: "Owner",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== ownerid && message.author.id !== ownerid2) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**You don't have permission to use this command!**")
            .setFooter({ text: "Coded by Ruchira" })
        ]
      });
    }

    const guildId = args[0];

    if (!guildId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please provide a Guild ID.**")
            .setFooter({ text: "Coded by Ruchira" })
        ]
      }).then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**Guild not found.**")
            .setFooter({ text: "Coded by Ruchira" })
        ]
      }).then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    try {
      await guild.leave();
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription(`Successfully left guild: **${guild.name}**`)
            .setFooter({ text: "Coded by Ruchira" })
        ]
      });
    } catch (error) {
      message.channel.send("An error occurred while trying to leave the guild.");
    }
  },
};
