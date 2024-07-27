const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unban",
  aliases: ["ajabsdk"],
  description: "Unbans a member from a guild.",
  usage: "unban <UserID> [reason]",
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
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**You don't have the permissions to unban users! - [BAN_MEMBERS]**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    if (!args[0] || isNaN(args[0])) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**You need to provide a valid ID.**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }

    let userId = args[0];
    let reason = args.slice(1).join(" ") || "No reason given!";

    try {
      let bannedMember = await client.users.fetch(userId);
      
      await message.guild.members.unban(bannedMember.id, reason);

      let confirmationEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setAuthor({ name: bannedMember.tag })
        .setFooter({ text: "Coded by: Ruchira" })
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`✅ **${bannedMember.tag}** has been successfully unbanned!`);

      await message.channel.send({ embeds: [confirmationEmbed] });

      let unbannedMessage = new EmbedBuilder()
        .setColor("#00FF00")
        .setAuthor({ name: message.author.tag })
        .setDescription(`> You've been unbanned from **${message.guild.name}**. ${reason}`)
        .setFooter({ text: "Coded by: Ruchira" });

      // Create an invite link for the unbanned user
      try {
        let invite = await message.guild.channels.cache
          .get(message.channel.id)
          .createInvite({ unique: true });

        unbannedMessage.addFields({ name: 'Invite Link', value: invite.url });

        await bannedMember.send({ embeds: [unbannedMessage] });
      } catch (error) {
        console.error("Error creating invite: ", error);
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("Unable to create an invite for the channel.")
              .setFooter({ text: "Coded by: Ruchira" })
          ]
        });
      }

    } catch (error) {
      console.error("Error unbanning user: ", error);
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({ name: message.author.tag })
            .setDescription("**An error occurred while trying to unban the user.**")
            .setFooter({ text: "Coded by: Ruchira" })
        ]
      });
    }
  },
};
