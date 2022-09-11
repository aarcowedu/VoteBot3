const { getMenuData } = require('../helpers')
const { menuBuilder } = require('../builders')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!(interaction.isSelectMenu() && interaction.customId === 'vote')) return
    try {
      const menuData = getMenuData(interaction.message.id, interaction.client.db)
      interaction.client.db.prepare('DELETE FROM votes WHERE accountID = ? AND menuID = ?').run(interaction.member.id, menuData.menuID)
      const stmt = 'INSERT INTO votes (accountID, menuID, itemID) VALUES ' + interaction.values.map((submittedItemID) => `('${interaction.member.id}', ${menuData.menuID}, ${submittedItemID})`).join(', ')
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
