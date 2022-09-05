const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')
const { adminMenuBuilder } = require('discord.js')
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Vote Menu Admin')
    .setType(ApplicationCommandType.Message),
  async execute (interaction) {
    const messageID = interaction.targetMessage.id
    await interaction.client.db.get('SELECT roleID FROM menus WHERE messageID = ?', [messageID], async (err, row) => {
      if (err) {
        throw err
      }
      if (!row) return await interaction.reply({ content: 'Not a known Vote Menu.', ephemeral: true })
      const roleID = row.roleID
      if (!interaction.member.roles.cache.has(roleID)) return await interaction.reply({ content: 'You do not have the role to administrate this vote menu!', ephemeral: true })
      await interaction.reply(adminMenuBuilder())
    })
  }
}
