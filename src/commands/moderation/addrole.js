const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const db = require("quick.db");
const ee = require("../../lib/config/bot.json");

module.exports = {
  name: "addrole",
  aliases: ["giverole"],
  description: "Add role to any user",
  usage: "",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the message author has the MANAGE_ROLES permission
    if (!message.member.permissions.has("MANAGE_ROLES"))
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription(
              "**You Don't Have The Permissions To Add Roles To Users! - [MANAGE_ROLES]**"
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });

    // Check if the bot has the MANAGE_ROLES permission
    const botMember = await message.guild.members.fetch(client.user.id);
    if (!botMember.permissions.has("MANAGE_ROLES"))
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription(
              "**I Don't Have The Permissions To Add Roles To Users! - [MANAGE_ROLES]**"
            )
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    // Check if a role is provided
    if (!args[0])
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please Enter A Role!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    // Find the mentioned member or the member by ID or username
    let rMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLowerCase()
      ) ||
      message.guild.members.cache.find(
        (ro) => ro.displayName.toLowerCase() === args[0].toLowerCase()
      );

    if (!rMember)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please Enter A User Name!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    // Check if the bot can manage the role of the member
    if (rMember.roles.highest.comparePositionTo(botMember.roles.highest) >= 0)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Cannot Add Role To This User!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    // Find the role mentioned or by ID or name
    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find(
        (rp) =>
          rp.name.toLowerCase() === args.slice(1).join(" ").toLowerCase()
      );

    if (!args[1])
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please Enter A Role!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    if (!role)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Could Not Find That Role!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    if (role.managed)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription("**Cannot Add That Role To The User!**")
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    if (botMember.roles.highest.comparePositionTo(role) <= 0)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription(
              "**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**"
            )
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    if (rMember.roles.cache.has(role.id))
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: message.author.tag })
            .setDescription(
              "**User Already Has That Role!**"
            )
            .setFooter({ text: "Coded by: Ruchira" }),
        ],
      });

    if (!rMember.roles.cache.has(role.id)) await rMember.roles.add(role.id);

    var sembed = new EmbedBuilder()
      .setAuthor({
        name: rMember.user.username,
        iconURL: rMember.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
      .setColor(Colors.Red)
      .setDescription(
        `${role} Role has been added to ${rMember.user.username}\n
            \`Enjoy Dear\``
      )
      .setFooter({
        text: `Role added by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    message.channel.send({ embeds: [sembed] }).then((msg) => {
      setTimeout(() => msg.delete(), 7000);
    });

    let channel = db.fetch(`modlog_${message.guild.id}`);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${message.guild.name} Modlogs`, iconURL: message.guild.iconURL() })
      .setColor(Colors.Red)
      .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .addFields(
        { name: "**Moderation**", value: "addrole" },
        { name: "**Added Role to**", value: rMember.user.username },
        { name: "**Role Added**", value: role.name },
        { name: "**Added By**", value: message.author.username },
        { name: "**Date**", value: message.createdAt.toLocaleString() }
      )
      .setTimestamp();

    let sChannel = message.guild.channels.cache.get(channel);
    if (!sChannel) return;
    sChannel.send({ embeds: [embed] });
  },
};
