const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'membercount',
  aliases: ['memberinfo'],
  description: 'Use this command to get the guild\'s member information.',
  usage: 'membercount',
  category: 'information',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @param {Function} funcs
   */
  run: async (client, message, args, funcs) => {
    try {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Server Member Info')
        .setDescription(`Total Members: ${message.guild.memberCount}`);

      await message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error('Error sending member count embed:', e);
      await message.channel.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
  },
};
