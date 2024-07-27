const { Client, Message, EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
require('moment-duration-format'); // Ensure you require the plugin for duration formatting
const os = require('os');
const cpuStat = require('cpu-stat');
const { version } = require('discord.js'); // Import discord.js version
const config = require('../../../src/lib/config/config.json');

module.exports = {
  name: 'botinfo',
  aliases: ['info'],
  description: 'Sends detailed info about the client',
  usage: 'botinfo',
  category: 'information',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    cpuStat.usagePercent((e, percent) => {
      if (e) {
        return console.error(e.stack);
      }

      // Format the duration
      const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
      
      // Count connected voice channels
      let connectedChannelsAmount = 0;
      client.guilds.cache.forEach(guild => {
        const me = guild.members.me; // Correctly access the member object
        if (me && me.voice.channel) connectedChannelsAmount += 1;
      });

      // Create an embed with bot info
      const botinfo = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle("__**Stats:**__")
        .setColor("Red") // You can use a hex color code like '#FF0000' if 'Red' does not work
        .addFields(
          { name: "⏳ Memory Usage", value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, inline: true },
          { name: "⌚️ Uptime", value: `\`${duration}\``, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
          { name: "📁 Users", value: `\`${client.users.cache.size}\``, inline: true },
          { name: "📁 Servers", value: `\`${client.guilds.cache.size}\``, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
          { name: "📁 Voice Channels", value: `\`${client.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size}\``, inline: true },
          { name: "📁 Connected Channels", value: `\`${connectedChannelsAmount}\``, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
          { name: "👾 Discord.js", value: `\`v${version}\``, inline: true },
          { name: "🤖 Node", value: `\`${process.version}\``, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
          { name: "🤖 CPU", value: `\`\`\`md\n${os.cpus().map(i => i.model)[0]}\`\`\``, inline: true },
          { name: "🤖 CPU usage", value: `\`${percent.toFixed(2)}%\``, inline: true },
          { name: "🤖 Arch", value: `\`${os.arch()}\``, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
          { name: "💻 Platform", value: `\`\`${os.platform()}\`\``, inline: true },
          { name: "API Latency", value: `\`${client.ws.ping}ms\``, inline: true }
        )
        .setFooter({ text: "Coded by: Ruchira" });

      message.channel.send({ embeds: [botinfo] });
    });
  }
};
