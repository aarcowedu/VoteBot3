const { getMenuData } = require('../helpers')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!(interaction.isButton() && interaction.customId === 'list')) return
    try {
      const menuData = getMenuData(interaction.message.id, interaction.client.db)
      const items = interaction.client.db.prepare('SELECT name FROM items WHERE menuID = ?').all(menuData.menuID)
      const message = '**Current Menu Items**\n\n' + items.map((item) => item.name).join('\n')
      await interaction.reply({ content: message, ephemeral: true })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
