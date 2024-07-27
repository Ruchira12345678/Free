const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: ["jabsdk"],
  description: "Bans a Member from a Guild",
  usage: "ban @User",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setAuthor({ name: message.author.tag })
            .setDescription("**You don't have the permissions to ban users! - [BAN_MEMBERS]**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    let banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!banMember) {
      const missingArgs = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle("Missing arguments")
        .setDescription(`
          **Name**: ban\n
          **Description**: Bans a member from a guild\n
          **Aliases**: jabsdk\n
          **Usage**: ban <@user/ID> [reason]
        `)
        .setFooter({ text: "Coded by: Ruchira" })
        .setTimestamp();

      return message.channel.send({ embeds: [missingArgs] });
    }

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    if (!message.guild.members.me.permissions.has(["BAN_MEMBERS", "ADMINISTRATOR"])) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setAuthor({ name: message.author.tag })
            .setDescription("I don't have the permissions to ban users!")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    let Sembed = new EmbedBuilder()
      .setColor('#FF0000')
      .setAuthor({ name: banMember.user.tag })
      .setFooter({ text: "Coded by: Ruchira" })
      .setThumbnail(banMember.user.displayAvatarURL())
      .setDescription(`> You've been banned from ${message.guild.name} because of ${reason}. You are permanently banned.`);

    let i = 0;
    banMember.send({ embeds: [Sembed] }).catch((err) => console.log(err.toString().red));

    banMember.ban({ reason })
      .catch((err) => {
        console.log(err.toString().red);
        i++;
      })
      .then(() => {
        let embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setAuthor({ name: banMember.user.tag })
          .setFooter({ text: "Coded by: Ruchira" })
          .setThumbnail(banMember.user.displayAvatarURL())
          .setDescription(`✅ **${banMember.user.tag}** successfully banned!`);

        if (i === 1) return message.reply("Missing permissions to ban this user!");

        message.reply({ embeds: [embed] }).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      });
  },
};
