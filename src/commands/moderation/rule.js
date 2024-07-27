const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const config = require("../../lib/config/config.json");

module.exports = {
  name: "set-rules",
  aliases: ["rules"],
  description: "Set rules for guild members",
  usage: "set-rules",
  category: "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const rules1 = new EmbedBuilder()
      .setTitle("General Rules")
      .setColor(0xFF0000) // Use hex color code for green
      .setThumbnail("https://media.discordapp.net/attachments/691896715661410365/808632776331886602/Black_and_Pink_Glitch_Gaming_Facebook_Cover_1.gif")
      .setDescription(
        `📜  1.1. Treat all members with respect.
        📜  1.2. Harassment, abuse, hate speech, or any kind of discriminatory speech will not be tolerated.
        📜  1.3. Do not intentionally offend any member in the Discord server.
        📜  1.4 Racial or offensive slurs will not be tolerated.
        📜  1.5. Tagging a member/staff member without reason will result in a warning.
        📜  1.6. Revealing private information about any individual is a zero tolerance rule.
        📜  1.7. Do not publicly accuse other users/players of misconduct.
        📜  1.8. No backseat modding.
        📜  1.9. No talking about topics related to religion or politics.
        📜  1.10. Words or small sentences in languages other than English are allowed only for teaching or clarification.
        📜  1.11. We welcome constructive criticism but have zero tolerance for aggressive or entitled demands.
        📜  1.12 Female members of the server are supposed to verify themselves through voice channels by female moderators as soon as possible upon joining the server. Impersonation using fake female accounts will result in a permanent server ban once proven.`
      );

    const rules2 = new EmbedBuilder()
      .setTitle("Chat Rules")
      .setColor(0xFF0000) // Use hex color code for green
      .setThumbnail("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
      .setDescription(
        `📜 2.1. Don’t spam (emoji, repeated messages, or spam for level increase).
        📜 2.2. If any staff member asks to change the topic of conversation, it must be changed if it gets too offensive to other members. Failure to comply may result in a kick/ban.
        📜 2.3. We highly request our old members to welcome new members and include them in conversations. Do not act creepy or rude towards new members.
        📜 2.4. Respect all staff and follow their instructions. Do not use abusive or odd names/profile pictures. Mods may change your name if found guilty.
        📜 2.5. Don’t expose anyone. Do not share any private information or pictures of anyone without permission.
        📜 2.6. Do not randomly tag staff if unnecessary.
        📜 2.7. If you are annoyed by someone, block the person and move on.
        📜 2.8. Have common sense to understand puns and sarcasm.
        📜 2.9. Do not misbehave with girls and respect every member in the server.
        📜 2.10. Excessive use of bad language will lead to a permanent ban or kick.`
      );

    const rules3 = new EmbedBuilder()
      .setTitle("Voice Rules")
      .setColor(0xFF0000) // Use hex color code for green
      .setThumbnail("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
      .setDescription(
        `📜 3.1. Posting content related to piracy, cheats, cracks, exploits, or any copyright-breaching materials is forbidden.
        📜 3.2. Any malicious activity towards the server or any member is forbidden.
        📜 3.3. This server follows all Discord Guidelines and Terms of Service. Please read and follow them.
        📜 3.4. Threats such as DDoS, DoX, or generalized threats are strictly prohibited and will result in an immediate removal/ban from the community.
        📜 3.5. Any attempts to “rape” other community members are strictly prohibited and will result in an immediate removal/ban from the server.
        📜 3.6. Intentional toxic behavior is not allowed.
        📜 3.7. Do not argue with any mod/staff. Their decision is final.
        📜 3.8. Do not use voice changers in voice channels; this will lead to a permanent ban from the server.
        📜 3.9. Do not blow air into the mic or you will be banned from voice channels.`
      );

    const follow = new EmbedBuilder()
      .setColor(0xFF0000) // Use hex color code for green
      .setTitle("Read All Rules Carefully")
      .setDescription(
        `Read the above rules carefully and follow them.\n
        Note: The rules may be updated as needed in the future.`
      )
      .setImage("https://media.discordapp.net/attachments/1258085096460783628/1266270853654515742/giphy.gif?ex=66a48a21&is=66a338a1&hm=42b3f062a5c5129d0aa916f13da3fa5dd74b54d1f72c20a1a61c333f98a9ecfa&=&width=600&height=600")
      .setFooter({ text: "Thanks For using Red Dragon bor created by Ruchira" });

    try {
      await message.channel.send({ embeds: [rules1] });
      await message.channel.send({ embeds: [rules2] });
      await message.channel.send({ embeds: [rules3] });
      const followMessage = await message.channel.send({ embeds: [follow] });
      await followMessage.react("✅");
      await message.channel.send("@everyone");
    } catch (error) {
      console.error("Error sending rule messages:", error);
      await message.channel.send("An error occurred while setting the rules. Please try again later.");
    }
  },
};
