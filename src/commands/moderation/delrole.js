const { Client, Message, EmbedBuilder } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "delrole",
  aliases: ["role", "deleterole", "roleremove"],
  description: "Delete a Role in Your Server",
  usage: "delrole <role mention/role id>",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for permission error
            .setAuthor({ name: message.author.tag })
            .setDescription("You don't have enough permissions to manage roles!")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    // Fetch the role from mentions or by ID
    const role = message.mentions.roles.first() || 
                 message.guild.roles.cache.get(args[0]);
                 
    if (!role) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for missing role error
            .setAuthor({ name: message.author.tag })
            .setTitle(`Usage: ${config.prefix}delrole <role>`)
            .setDescription("Please mention a role or provide its ID to delete.")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    // Check if the bot's role is high enough to delete the role
    if (message.guild.me.roles.highest.position <= role.position) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for role hierarchy error
            .setAuthor({ name: message.author.tag })
            .setDescription("I cannot delete this role as it is higher or equal to my highest role.")
            .setFooter({ text: config.footertext })
        ]
      });
    }

    try {
      await role.delete();

      const embed = new EmbedBuilder()
        .setTitle("Role Update")
        .setDescription(`Role ${role.name} has been deleted.`)
        .setColor('#FF0000') // Green color for success
        .setAuthor({ name: message.author.tag })
        .setFooter({ text: config.footertext });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000') // Red color for error
            .setDescription("An error occurred while deleting the role. Please try again.")
            .setFooter({ text: config.footertext })
        ]
      });
    }
  },
};
