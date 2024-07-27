const { Client, Message, EmbedBuilder } = require("discord.js");
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
  run: async (client, message, args, prefix) => {
    try {
      let user = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;

      let roles = user.roles.cache
        .map(x => x)
        .filter(z => z.name !== "@everyone");

      let messagecount = db.get(`${message.guild.id}.${user.id}.messageCount`);
      if (typeof messagecount !== 'number') messagecount = 0;

      if (roles.length > 100) {
        roles = "There are too many roles to show.";
      }

      const status = {
        online: "Online",
        idle: "Idle",
        dnd: "Do Not Disturb",
        offline: "Offline/Invisible",
      };

      let permissions = [];
      let acknowledgements = "None";

      const member = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;

      if (message.member.permissions.has("KICK_MEMBERS")) {
        permissions.push("Kick Members");
      }

      if (message.member.permissions.has("BAN_MEMBERS")) {
        permissions.push("Ban Members");
      }

      if (message.member.permissions.has("ADMINISTRATOR")) {
        permissions.push("Administrator");
      }

      if (message.member.permissions.has("MANAGE_MESSAGES")) {
        permissions.push("Manage Messages");
      }

      if (message.member.permissions.has("MANAGE_CHANNELS")) {
        permissions.push("Manage Channels");
      }

      if (message.member.permissions.has("MENTION_EVERYONE")) {
        permissions.push("Mention Everyone");
      }

      if (message.member.permissions.has("MANAGE_NICKNAMES")) {
        permissions.push("Manage Nicknames");
      }

      if (message.member.permissions.has("MANAGE_ROLES")) {
        permissions.push("Manage Roles");
      }

      if (message.member.permissions.has("MANAGE_WEBHOOKS")) {
        permissions.push("Manage Webhooks");
      }

      if (message.member.permissions.has("MANAGE_EMOJIS")) {
        permissions.push("Manage Emojis");
      }

      if (permissions.length == 0) {
        permissions.push("No Key Permissions Found");
      }

      if (member.user.id == message.guild.ownerId) {
        acknowledgements = "Server Owner";
      }

      let safe = message.author.createdTimestamp;
      if (safe > 604800017) {
        safe = "`Reliable`";
      } else {
        safe = "`Suspicious`";
      }

      let durumm;
      let durum = user.presence?.status;

      if (durum === "online") durumm = `Online`;
      if (durum === "offline") durumm = `Offline`;
      if (durum === "idle") durumm = `Idle`;
      if (durum === "dnd") durumm = `Do not disturb`;

      let lastMessage;
      let lastMessageTime;
      let nitroBadge = user.user.avatarURL({ dynamic: true });
      let flags = user.user.flags.toArray().join(``);

      if (!flags) {
        flags = "User doesn't have any badge";
      }

      flags = flags.replace("HOUSE_BRAVERY", "• HypeSquad Bravery");
      flags = flags.replace("EARLY_SUPPORTER", "• Early Supporter");
      flags = flags.replace("VERIFIED_DEVELOPER", "• Verified Bot Developer");
      flags = flags.replace("EARLY_VERIFIED_DEVELOPER", "• Verified Bot Developer");
      flags = flags.replace("HOUSE_BRILLIANCE", "• HypeSquad Brilliance");
      flags = flags.replace("HOUSE_BALANCE", "• HypeSquad Balance");
      flags = flags.replace("DISCORD_PARTNER", "• Partner");
      flags = flags.replace("HYPESQUAD_EVENTS", "• Hypesquad Event");
      flags = flags.replace("DISCORD_CLASSIC", "• Discord Classic");

      if (nitroBadge.includes("gif")) {
        flags += "\n• Nitro";
      }

      let voice = db.get(`${message.guild.id}.${user.user.id}.voicetime`);
      let stat = user.presence?.activities[0];
      let custom;

      if (user.presence?.activities.some(r => r.name === "Spotify")) {
        custom = "Listening to Spotify";
      } else if (stat && stat.name !== "Custom Status") {
        custom = stat.name;
      } else {
        custom = "Nothing";
      }

      if (
        user.presence?.activities.some(r => r.name !== "Spotify") &&
        stat &&
        stat.state !== null
      ) {
        stat = stat.state;
      } else {
        stat = "Nothing";
      }

      if (!voice) {
        voice = "0 hours, 0 minutes and 0 seconds";
      } else {
        voice = moment.duration(voice).format("h [hours,] m [minutes and] s[seconds]");
      }

      if (user.lastMessage) {
        lastMessage = user.lastMessage.content;
        lastMessageTime = moment(user.lastMessage.createdTimestamp).format("MMMM Do YYYY, H:mm:ss a");
      } else {
        lastMessage = "None";
        lastMessageTime = "None";
      }

      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setTitle(`Information about: ${user.user.username}#${user.user.discriminator}`)
        .addFields(
          { name: "**❯ ID:**", value: `\`${user.id}\``, inline: true },
          { name: "**❯ Username:**", value: `\`${user.user.username}#${user.user.discriminator}\``, inline: true },
          { name: "**❯ Avatar:**", value: `[Link to avatar](${user.user.displayAvatarURL({ format: "png" })})`, inline: true },
          { name: "**❯ Bot:**", value: `\`${user.user.bot ? "Yes" : "No"}\``, inline: true },
          { name: "**❯ Date Joined DC:**", value: `\`${moment(user.user.createdTimestamp).format("LT")} ${moment(user.user.createdTimestamp).format("LL")} ${moment(user.user.createdTimestamp).fromNow()}\``, inline: true },
          { name: "**❯ Date Joined Server:**", value: `\`${moment(user.joinedAt).format("LL LTS")}\``, inline: true },
          { name: "**❯ Messages Count:**", value: `\`${messagecount}\``, inline: true },
          { name: "**❯ Last Message:**", value: `\`${lastMessage}\``, inline: true },
          { name: "**❯ Last Message At:**", value: `\`${lastMessageTime}\``, inline: true },
          { name: "**❯ Badge Information:**", value: `\`${flags}\``, inline: true },
          { name: "**❯ Safety Check:**", value: `\`${safe}\``, inline: true },
          { name: "Permissions:", value: `${permissions.join(", ")}`, inline: true },
          { name: "Acknowledgements:", value: `${acknowledgements}`, inline: true },
          { name: "Status", value: `${status[member.user.presence?.status]}`, inline: true },
          { name: "Member", value: `**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? "None" : member.roles.highest.name}\n**❯ Server Join Date:** ${moment(member.joinedAt).format("LL LTS")}\n**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : "None"}\n**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(", ") : roles.length > 10 ? "Too many roles to display" : "None"}`, inline: false }
        )
        .setFooter({ text: "Coded by: Ruchira" })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error retrieving user info:", error);
      message.channel.send(`Error retrieving user info: ${error.message}`);
    }
  },
};
