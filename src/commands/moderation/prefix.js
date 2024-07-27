const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'prefix',
    aliases: ['setprefix'],
    category: "moderation",
    premium: true,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send(
                'You must have `Administration` perms to change the prefix of this server.'
            );
        }
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`You didn't provide the new prefix.`)
                ]
            });
        }
        if (args[1]) {
            const embed = new EmbedBuilder()
                .setDescription('You cannot set a prefix with more than one argument.')
                .setColor('00e3ff');
            return message.channel.send({ embeds: [embed] });
        }
        if (args[0].length > 3) {
            const embed = new EmbedBuilder()
                .setDescription('The prefix cannot be more than 3 characters.')
                .setColor('00e3ff');
            return message.channel.send({ embeds: [embed] });
        }
        if (args[0] === '&') {
            if (client.db) {
                client.db.delete(`prefix_${message.guild.id}`);
                const embed = new EmbedBuilder()
                    .setDescription('Prefix has been reset.')
                    .setColor('00e3ff');
                return message.channel.send({ embeds: [embed] });
            } else {
                return message.channel.send('Database client is not initialized.');
            }
        }

        if (client.db) {
            await client.db.set(`prefix_${message.guild.id}`, args[0]);
            client.util.setPrefix(message, client);
            const embed = new EmbedBuilder()
                .setDescription(`New prefix for this server is ${args[0]}`)
                .setColor('00e3ff');
            await message.channel.send({ embeds: [embed] });
        } else {
            return message.channel.send('Database client is not initialized.');
        }
    }
};
