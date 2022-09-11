const { getMenuData } = require('../helpers')
const { menuBuilder } = require('../builders')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!(interaction.isSelectMenu() && interaction.customId === 'delete')) return
    try {
      const menuData = getMenuData(interaction.message.id, interaction.client.db)
      if (!interaction.member.roles.cache.has(menuData.roleID)) return await interaction.reply({ content: 'You do not have the role to administrate this vote menu!', ephemeral: true })
      const stmt = 'DELETE FROM items WHERE itemID IN (' + interaction.values.join(', ') + `) AND menuID = ${menuData.menuID}`
      interaction.client.db.prepare(stmt).run()
      await interaction.update(await menuBuilder(interaction.client.db, menuData.menuID))
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
