const { SlashCommandBuilder, SlashCommandRoleOption } = require('discord.js')
const { menuBuilder } = require('../builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('new')
    .setDescription('Creates a new menu!')
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName('adminrole')
        .setDescription('Declare the admin role for this menu!')
        .setRequired(true)
    ),
  async execute (interaction) {
    console.log('yeet')
    const message = await interaction.reply(await menuBuilder(interaction.client.db, undefined))
    interaction.client.db.prepare('INSERT INTO menus (messageID, channelID, guildID, roleID) VALUES (?, ?, ?, ?)').run(message.id, message.channelId, message.guildId, interaction.options.getRole('adminrole').id)
  }
}
