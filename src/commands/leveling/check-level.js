const { Client, Message, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Schema = require('../../lib/utils/models/level');


module.exports = {
  name: 'check-level-channel',
  description: 'Check the level-up channel configured for the server',
  usage: '',
  aliases: ['clevel'],
  category: 'leveling',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply("You don't have enough permission to execute this command!");
    }

    try {
      const data = await Schema.findOne({ Guild: message.guild.id }).exec();

      if (!data) {
        return message.channel.send('This guild has no data stored!');
      }

      const channel = client.channels.cache.get(data.Channel);

      if (!channel) {
        return message.channel.send('The level-up channel could not be found.');
      }

      const checklevel = new EmbedBuilder()
        .setColor('#FF0000') // Red color
        .setTitle('Level-Up Channel')
        .setDescription(`Level-Up Channel: ${channel}`)
        .setThumbnail(
          'https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600'
        )
        .setFooter({ text: 'Coded By Ruchira' });

      return message.channel.send({ embeds: [checklevel] });
    } catch (error) {
      console.error('Error fetching level channel:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000') // Red color
        .setDescription('An error occurred while fetching the level-up channel.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
