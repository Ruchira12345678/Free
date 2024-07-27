const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "massban",
  aliases: ["multiban"],
  description: "Ban multiple users at once",
  usage: "massban <@user1 @user2 @user3> [reason]",
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
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**You don't have the permissions to ban members! - [BAN_MEMBERS]**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    const bannedCollection = message.mentions.members;
    if (bannedCollection.size === 0) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription("**Please mention at least one user to ban**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    let banReason = args.slice(bannedCollection.size + 1).join(" ");
    if (!banReason) banReason = "No reason provided";

    function checkPerms(collection) {
      const data = [];
      collection.forEach((member) => {
        if (
          member.roles.highest.position >= message.member.roles.highest.position ||
          member.roles.highest.position >= message.guild.me.roles.highest.position
        ) {
          data.push(member);
        }
      });
      return data.length === 0 ? false : data;
    }

    const permsCheck = checkPerms(bannedCollection);
    if (permsCheck) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setAuthor({ name: message.author.tag })
            .setDescription(`**You cannot ban the following members because their roles are higher or equal to yours or my roles:** ${permsCheck.map(m => m.user.tag).join(", ")}`)
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    const confirmationMessage = await message.channel.send({
      content: `:warning: **Are you sure you want to ban ${bannedCollection.map((mem) => `${mem}`).join(", ")}?**\nPlease reply with \`yes\` or \`cancel\``
    });

    const filter = (response) => response.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 60 * 1000 });

    collector.on("collect", async (response) => {
      if (["yes", "y"].includes(response.content.toLowerCase())) {
        try {
          bannedCollection.forEach(async (member) => {
            await member.ban({ reason: banReason, days: 7 });
          });
          confirmationMessage.edit({
            embeds: [
              new EmbedBuilder()
                .setColor('#FF0000') // Blue color for success
                .setAuthor({ name: message.author.tag })
                .setTitle("Massban Successful")
                .setDescription(`I have banned ${bannedCollection.map(m => `**${m.user.tag}**`).join(", ")} | ${banReason}`)
                .setFooter({ text: "Coded by: Ruchira" })
            ]
          });
        } catch (e) {
          console.error(`Massban failed: ${e}`);
          message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor('#FF0000') // Red color for error
                .setDescription(`**An error occurred while banning users**`)
                .setFooter({ text: "Coded by: Ruchira" })
            ]
          });
        }
        collector.stop();
      } else if (response.content.toLowerCase() === "cancel") {
        confirmationMessage.edit({
          content: "Massban cancelled."
        });
        collector.stop();
      } else {
        confirmationMessage.edit({
          content: `**Invalid response**: Please reply with \`yes\` or \`cancel\`.`
        });
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF0000') // Red color for timeout
              .setDescription("**You took too long to respond. The massban has been cancelled.**")
              .setFooter({ text: "Coded by: Ruchira" })
          ]
        });
      }
    });
  },
};
