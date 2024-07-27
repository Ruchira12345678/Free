const { Client, Message, EmbedBuilder, PermissionsBitField } = require("discord.js");
let ownerid = "1245350752940200010";
let ownerid2 = "1245350752940200010";

module.exports = {
  name: "serverlist",
  aliases: ["srlist"],
  description: "Show the server list which the client joined...",
  category: "owner",
  usage: "",
  accessibleby: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== ownerid && message.author.id !== ownerid2) {
      return;
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.channel.send("I don't have the Administrator permission.")
        .then(msg => {
          setTimeout(() => msg.delete(), 5000);
        });
    }

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description =
      `Total Servers - ${client.guilds.cache.size}\n\n` +
      client.guilds.cache
        .sort((a, b) => b.memberCount - a.memberCount)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
        .slice(0, 10)
        .join("\n");

    let embed = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor("#FF0000")
      .setFooter({ text: client.user.username })
      .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
      .setDescription(description);

    let msg = await message.channel.send({ embeds: [embed] });

    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");

    let collector = msg.createReactionCollector(
      (reaction, user) => user.id === message.author.id
    );

    collector.on("collect", async (reaction, user) => {
      if (reaction.emoji.name === "⬅") {
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        if (i0 < 0) return msg.delete();

        description =
          `Total Servers - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
            .slice(i0, i1)
            .join("\n");

        embed
          .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
          .setDescription(description);

        msg.edit({ embeds: [embed] });
      }

      if (reaction.emoji.name === "➡") {
        i0 = i0 + 10;
        i1 = i1 + 10;
        page = page + 1;

        if (i1 > client.guilds.cache.size + 10) return msg.delete();

        description =
          `Total Servers - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
            .slice(i0, i1)
            .join("\n");

        embed
          .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
          .setDescription(description);

        msg.edit({ embeds: [embed] });
      }

      if (reaction.emoji.name === "❌") {
        return msg.delete();
      }

      await reaction.users.remove(message.author.id);
    });
  },
};
