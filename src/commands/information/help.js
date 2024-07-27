const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { readdirSync } = require('fs');
const { prefix } = require('../../');
let color = '#FF0000'; // Your preferred red color

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Shows all available bot commands.',
  category: 'information',
  run: async (client, message, args) => {
    const emo = {
      games: '🎮',
      config: '⚙️',
      automod: '👍',
      giveaway: '🎉',
      information: '📻',
      moderation: '🔨',
      music: '🎵',
      musicfilter: '🎼',
      owner: '👑',
      leveling: '🎂',
      rr_roles: '🙌',
      ticket: '🎫',
      utility: '☄️',
      welcome_leave: '✨',
      rr_roles: '🎁',
      yt_poster: '📺',
    };

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('HELP MENU 🔰 Commands')
        .setImage("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
        .addFields(
          { name: 'Prefix Information', value: `Prefix: \`${prefix}\`\nYou can also mention ${client.user} to get prefix info.`, inline: false },
          { name: '• Developer', value: '```yml\nName: Ruchira [1245350752940200010]```' },
          { name: '• Important Links', value: `**[Invite Link](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](https://discord.gg/z6YadEkT) | [Youtube](https://youtube.com/@deepeagle?si=bFEQg0Evs32r8O7I)**` }
        )
        .setTimestamp();

      const data = client.categories.map((cat) => ({
        label: `${cat[0].toUpperCase() + cat.slice(1)}`,
        value: cat,
        emoji: emo[cat] || undefined, // Handle emojis properly
        description: `Click to See Commands of ${cat}`,
      }));

      console.log('Select Menu Options:', data); // Debug logging

      const menu = new SelectMenuBuilder()
        .setCustomId('help-menu')
        .setPlaceholder('Click to See My Category')
        .addOptions(data);

      const row = new ActionRowBuilder().addComponents(menu);

      const btn = new ButtonBuilder()
        .setCustomId('home')
        .setLabel('Home')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🏘️');

      const btn2 = new ButtonBuilder()
        .setLabel('website')
        .setStyle(ButtonStyle.Link)
        .setURL('https://youtube.com');

      const btn3 = new ButtonBuilder()
        .setLabel('Join Now')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/z6YadEkT');

      const btnRow = new ActionRowBuilder().addComponents(btn, btn2, btn3);

      const msg = await message.channel.send({ embeds: [embed], components: [row, btnRow] });

      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (interaction) => {
        if (interaction.isButton()) {
          if (interaction.customId === 'home') {
            await interaction.update({ embeds: [embed] });
          }
        } else if (interaction.isSelectMenu()) {
          const [directory] = interaction.values;

          const commands = client.commands.filter((cmd) => cmd.category === directory);
          const categoryEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`✅ All Commands of **${directory}** ✅`)
            .setDescription(
              `>>> ${commands.map((cmd) => `\`${cmd.name}\``).join(' ')}`
            )
            .setFooter({ text: 'Coded By Ruchira', iconURL: message.author.displayAvatarURL({ dynamic: true }) });

          await interaction.update({ embeds: [categoryEmbed] });
        }
      });
    } else {
      let cots = [];
      let catts = [];

      readdirSync('./commands/').forEach((dir) => {
        if (dir.toLowerCase() !== args[0].toLowerCase()) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return 'No command name.';

          let name = file.name.replace('.js', '');

          let des = client.commands.get(name).description;

          let obj = {
            cname: `\`${name}\``,
            des,
          };

          return obj;
        });

        let dota = new Object();

        cmds.map((co) => {
          dota = {
            name: `${cmds.length === 0 ? 'In progress.' : co.cname}`,
            value: co.des ? co.des : 'No Description',
            inline: true,
          };
          catts.push(dota);
        });

        cots.push(dir.toLowerCase());
      });

      const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

      if (cots.includes(args[0].toLowerCase())) {
        const combed = new EmbedBuilder()
          .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__`)
          .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
          .addFields(catts)
          .setColor(color)
          .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
          .setFooter({ text: 'Coded Ruchira' });

        return message.channel.send({ embeds: [combed] });
      }

      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor(color);
        return message.channel.send({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle('Command Details:')
        .addFields(
          { name: 'Command:', value: command.name ? `\`${command.name}\`` : 'No name for this command.' },
          { name: 'Aliases:', value: command.aliases ? `\`${command.aliases.join('` `')}\`` : 'No aliases for this command.' },
          { name: 'Usage:', value: command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\`` },
          { name: 'Command Description:', value: command.description ? command.description : 'No description for this command.' }
        )
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setColor(color);
      return message.channel.send({ embeds: [embed] });
    }
  },
};
