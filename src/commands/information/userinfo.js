const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("../../../src/lib/config/config.json");
const db = require("quick.db");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "userinfo",
  aliases: ["uinfo"],
  description: "Get information about a user",
  usage: "userinfo [@USER]",
  category: "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
      
    let durumm;
    let durum = user.presence?.status || "offline";
    let roles = user.roles.cache
      .map((x) => x)
      .filter((z) => z.name !== "@everyone");
    let messagecount;
    let voice;
    
    try {
      messagecount = await db.get(`${message.guild.id}.${user.id}.messageCount`);
      if (messagecount === null) messagecount = 0;
    } catch (error) {
      console.error('Error retrieving message count from database:', error);
      messagecount = 0;
    }

    try {
      voice = db.get(`${message.guild.id}.${user.id}.voicetime`);
      if (!voice) voice = "0 hours, 0 minutes and 0 seconds";
    } catch (error) {
      console.error('Error retrieving voice time from database:', error);
      voice = "0 hours, 0 minutes and 0 seconds";
    }

    if (roles.length > 100) {
      roles = "There are too many roles to display.";
    }

    const status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline/Invisible",
    };

    const permissions = [
      { permission: "KICK_MEMBERS", name: "Kick Members" },
      { permission: "BAN_MEMBERS", name: "Ban Members" },
      { permission: "ADMINISTRATOR", name: "Administrator" },
      { permission: "MANAGE_MESSAGES", name: "Manage Messages" },
      { permission: "MANAGE_CHANNELS", name: "Manage Channels" },
      { permission: "MENTION_EVERYONE", name: "Mention Everyone" },
      { permission: "MANAGE_NICKNAMES", name: "Manage Nicknames" },
      { permission: "MANAGE_ROLES", name: "Manage Roles" },
      { permission: "MANAGE_WEBHOOKS", name: "Manage Webhooks" },
      { permission: "MANAGE_EMOJIS", name: "Manage Emojis" }
    ]
      .filter(({ permission }) => message.member.permissions.has(permission))
      .map(({ name }) => name);

    if (permissions.length === 0) {
      permissions.push("No Key Permissions Found");
    }

    let acknowledgements = user.id === message.guild.ownerID ? "Server Owner" : "None";

    let safe = message.author.createdTimestamp > 604800017
      ? "`Reliable` <:discordinvisible:757485982227365939>"
      : "`Suspicious` <:discorddnd:757485967266545704>";

    durumm = status[durum] || "Unknown";

    let lastMessage = user.lastMessage?.content || "None";
    let lastMessageTime = user.lastMessage ? moment(user.lastMessage.createdTimestamp).format("MMMM Do YYYY, H:mm:ss a") : "None";
    
    let nitroBadge = user.user.avatarURL({ dynamic: true });
    let flags = user.user.flags.toArray().map(flag => {
      switch (flag) {
        case "HOUSE_BRAVERY": return "• <:hsquadbravery:757488491792826410> `HypeSquad Bravery`";
        case "EARLY_SUPPORTER": return "• <a:nitro:740923343548579890> `Early Supporter`";
        case "VERIFIED_DEVELOPER": return "• <:discordbotdev:757489652214267904> `Verified Bot Developer`";
        case "EARLY_VERIFIED_DEVELOPER": return "• <:discordbotdev:757489652214267904> `Verified Bot Developer`";
        case "HOUSE_BRILLIANCE": return "• <:hsquadbrilliance:757487710775672863> `HypeSquad Brilliance`";
        case "HOUSE_BALANCE": return "• <:hsquadbalance:757487549605347348> `HypeSquad Balance`";
        case "DISCORD_PARTNER": return "• <:partner:739714991732686848> `Partner`";
        case "HYPESQUAD_EVENTS": return "• <a:hypesquad:755471122430034060> `Hypesquad Event`";
        case "DISCORD_CLASSIC": return "• <a:classic:740922817683652754> `Discord Classic`";
        default: return "";
      }
    }).join("\n");

    if (nitroBadge.includes("gif")) {
      flags += `\n• <a:nitroboost:740923077973508156>  \`Nitro\``;
    }

    let embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setTitle(`Information about: ${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "**❯ ID:**", value: `\`${user.id}\``, inline: true },
        { name: "**❯ Username:**", value: `\`${user.user.username}#${user.user.discriminator}\``, inline: true },
        { name: "**❯ Avatar:**", value: `[\`Link to avatar\`](${user.user.displayAvatarURL({ format: "png" })})`, inline: true },
        { name: "**❯ Bot:**", value: `\`${user.user.bot ? "Yes" : "No"}\``, inline: true },
        { name: "**❯ Date Joined DC:**", value: `\`${moment(user.user.createdTimestamp).format("LT")} ${moment(user.user.createdTimestamp).format("LL")} ${moment(user.user.createdTimestamp).fromNow()}\``, inline: true },
        { name: "**❯ Date Joined Server:**", value: `\`${moment(user.joinedAt).format("LL LTS")}\``, inline: true },
        { name: "**❯ Messages Count:**", value: `\`${messagecount}\`\n**❯ Last Message:** \`${lastMessage}\`\n**❯ Last Message At:** \`${lastMessageTime}\``, inline: true },
        { name: "**❯ __**Badge Information**__:**", value: `\`${flags}\``, inline: true },
        { name: "**❯ __**Safety Check**__:**", value: `\`${safe}\``, inline: true },
        { name: "Permissions:", value: `${permissions.join(", ")}`, inline: true },
        { name: "Acknowledgements:", value: `${acknowledgements}`, inline: true },
        { name: "Status", value: `${durumm}`, inline: true },
        { name: "Member", value: [
          `**❯ Highest Role:** ${user.roles.highest.id === message.guild.id ? "None" : user.roles.highest.name}`,
          `**❯ Server Join Date:** ${moment(user.joinedAt).format("LL LTS")}`,
          `**❯ Hoist Role:** ${user.roles.hoist ? user.roles.hoist.name : "None"}`,
          `**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(", ") : roles.length > 10 ? "Many Roles" : "None"}`
        ].join('\n')}
      )
      .setFooter({ text: "Coded by: Ruchira" })
      .setTimestamp();

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};
