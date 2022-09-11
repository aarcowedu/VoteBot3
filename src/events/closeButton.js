const { menuBuilder } = require('../builders')
const { getMenuData } = require('../helpers')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!(interaction.isButton() && interaction.customId === 'close')) return
    try {
      const menuData = getMenuData(interaction.message.id, interaction.client.db)
      if (!interaction.member.roles.cache.has(menuData.roleID)) return await interaction.reply({ content: 'You do not have the role to administrate this vote menu!', ephemeral: true })
      const updatedMenu = await menuBuilder(interaction.client.db, menuData.menuID)
      updatedMenu.components = []
      await interaction.update(updatedMenu)
      const items = interaction.client.db.prepare('SELECT name FROM items WHERE menuID = ?').all(menuData.menuID)
      const message = '**Closed Menu Items**\n\n' + items.map((item) => item.name).join('\n')
      await interaction.followUp({ content: message })
      interaction.client.db.prepare('DELETE FROM menus WHERE menuID = ?').run(menuData.menuID)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
