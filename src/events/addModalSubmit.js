const { getMenuData } = require('../helpers')
const { menuBuilder } = require('../builders')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!(interaction.isModalSubmit())) return
    try {
      const items = interaction.fields.getTextInputValue('items')
      if (!items) return await interaction.reply('No items were added!')
      const menuData = getMenuData(interaction.message.id, interaction.client.db)
      const itemsList = items.split('\n').filter(element => {
        return element !== ''
      })
      const placeholders = itemsList.map((item) => `('${item}', ${menuData.menuID})`).join(',')
      const stmtString = 'INSERT INTO items(name, menuID) VALUES ' + placeholders
      interaction.client.db.prepare(stmtString).run()
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
