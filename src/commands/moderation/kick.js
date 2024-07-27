const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a user from the guild.",
  aliases: ["nikal"],
  usage: "kick <@user/ID> [reason]",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the user has the required permission
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(`:x: You don't have \`KICK_MEMBERS\` permissions.`)
        ],
      });
    }

    // Find the member to kick
    const kickmember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    let kickReason = args.slice(1).join(" ");
    if (!kickReason) kickReason = "Not Specified.";

    // If no member is mentioned or found
    if (!kickmember) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("Missing Arguments")
            .setDescription(`
              **Name**: kick\n
              **Description**: Kick a user from the guild.\n
              **Aliases**: nikal\n
              **Usage**: kick <@user/ID> [reason]\n
            `)
            .setFooter({ text: "Coded by: Tech Boy Gaming" })
            .setTimestamp()
        ],
      });
    }

    // If the member cannot be kicked
    if (!kickmember.kickable) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(`**That person can't be kicked!**`)
        ],
      });
    }

    // Check if the bot's role is higher than the member's highest role
    if (
      message.guild.members.me.roles.highest.comparePositionTo(
        kickmember.roles.highest
      ) < 0
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(
              `**My role must be higher than \`${kickmember.user.tag}\`'s highest role!**`
            )
        ],
      });
    }

    try {
      await kickmember.kick(kickReason);
      
      const kick = new EmbedBuilder()
        .setColor('#0000FF')
        .setTitle("You have been kicked!")
        .setDescription(
          `**Server: \`${message.guild.name}\`\nReason: \`${kickReason}\`\nModerator: \`${message.author.tag}\`**`
        );

      kickmember.send({ embeds: [kick] }).catch((err) => console.log(err.toString()));

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle("Member Kicked")
        .setTimestamp()
        .setDescription(
          `**Kicked:** \`${kickmember.user.tag}\`\n**Moderator:** ${message.member}\n**Reason:** \`${kickReason}\``
        );

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(`**Something went wrong. Check my permissions and try again!**`)
        ],
      });
    }
  },
};
