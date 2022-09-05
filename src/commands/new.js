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
    const message = await interaction.reply(await menuBuilder(interaction.client.db, undefined))
    await interaction.client.db.serialize(() => {
      interaction.client.db.run('INSERT INTO menus (messageID, channelID, guildID, roleID) VALUES (?, ?, ?, ?)', [message.id, message.channelId, message.guildId, interaction.options.getRole('adminrole').id])
    })
  }
}
