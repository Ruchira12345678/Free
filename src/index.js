require('dotenv').config()
const { DisTube } = require('distube');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const { GiveawaysManager } = require("discord-giveaways");


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates,GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, ] });

const prefix = ('!');


client.commands = new Collection();
client.categories = [];

// Function to load commands
const loadCommands = () => {
  const commandFolders = readdirSync(path.join(__dirname, 'commands'));

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));

    const category = folder;
    client.categories.push(category);

    for (const file of commandFiles) {
      const command = require(path.join(__dirname, 'commands', folder, file));
      client.commands.set(command.name, command);
    }
  }
};

// Call the function to load commands
loadCommands();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    command.run(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});



// Initialize giveaways manager
client.giveawaysManager = new GiveawaysManager(client, {
  updateCountdownEvery: 3000,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉",
  },
});

// Set up giveaway events after initializing giveaways manager
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Event for when a user reacts to a giveaway
  client.giveawaysManager.on(
    "giveawayReactionAdded",
    async (giveaway, reactor, messageReaction) => {
      if (reactor.user.bot) return;
      try {
        if (giveaway.extraData && giveaway.extraData.server) {
          await client.guilds.cache
            .get(giveaway.extraData.server)
            .members.fetch(reactor.id);
        }
        await reactor.send(
          new EmbedBuilder()
            .setTimestamp()
            .setTitle("Entry Approved! | You have a chance to win!!")
            .setDescription(
              `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been approved!`
            )
            .setFooter({ text: "Coded by Ruchira" })
        );
      } catch (error) {
        console.error("Error processing giveaway reaction:", error);
        const guildx = client.guilds.cache.get(giveaway.extraData.server);
        messageReaction.users.remove(reactor.user);
        await reactor.send(
          new EmbedBuilder()
            .setTimestamp()
            .setTitle(":x: Entry Denied | Database Entry Not Found & Returned!")
            .setDescription(
              `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been denied as you did not join **${guildx.name}**`
            )
            .setFooter({ text: "Coded By Ruchira" })
        );
      }
    }
  );

  // Event for when a user reacts to an ended giveaway
  client.giveawaysManager.on(
    "endedGiveawayReactionAdded",
    (giveaway, member, reaction) => {
      reaction.users.remove(member.user);
      member.send(
        "❗ Aw snap! Looks like that giveaway has already ended!"
      ).catch(console.error);
    }
  );

  // Event for when a giveaway ends
  client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    winners.forEach(async (member) => {
      try {
        await member.send(
          new EmbedBuilder()
            .setTitle("🎁 Let's Go!")
            .setDescription(
              `Hello ${member.user},\nYou won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**!\nCongratulations on winning **${giveaway.prize}**! Direct message the host to claim your prize!`
            )
            .setTimestamp()
            .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL() })
        );
      } catch (error) {
        console.error(`Could not send DM to ${member.user.tag}:`, error);
      }
    });
  });

  // Event for when winners are rerolled
  client.giveawaysManager.on("giveawayRerolled", (giveaway, winners) => {
    winners.forEach(async (member) => {
      try {
        await member.send(
          new EmbedBuilder()
            .setTitle("🎁 New Winner Announced!")
            .setDescription(
              `Hello ${member.user},\nThe host rerolled the giveaway, and you won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**!\nCongratulations on winning **${giveaway.prize}**! Direct message the host to claim your prize!`
            )
            .setTimestamp()
            .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL() })
        );
      } catch (error) {
        console.error(`Could not send DM to ${member.user.tag}:`, error);
      }
    });
  });

  // Event for when a user removes a reaction from a giveaway
  client.giveawaysManager.on(
    "giveawayReactionRemoved",
    (giveaway, member, reaction) => {
      member.send(
        "❓ Hold up! Did you just remove your reaction from a giveaway?"
      ).catch(console.error);
    }
  );
});



client.login("MTI1ODA4NjY1MTY0NTkxOTMyNA.GJUrAA.Lio_KyCXkJteXJcZpeWA3dRIIqK7GGctDThlmA");
