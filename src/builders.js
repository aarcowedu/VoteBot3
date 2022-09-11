const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js')
const menuBuilder = async (db, menuID) => {
  const menuEmbed = new EmbedBuilder()
    .setTitle('Vote Menu')
    .setDescription('No votes cast!')
  const rows = []

  if (menuID) {
    let description = ''
    const itemsWithVotes = db.prepare('SELECT itemID, name, COUNT(voteID) FROM items INNER JOIN votes USING(itemID) WHERE items.menuID = ? GROUP BY itemID ORDER BY COUNT(voteID) ASC').all(menuID)
    for (const item of itemsWithVotes) {
      description += `[${item['COUNT(voteID)']}] **${item.name}**\n`
      const votesOfItem = db.prepare('SELECT accountID FROM votes WHERE itemID = ?').all(item.itemID)
      for (const vote of votesOfItem) {
        description += `<@${vote.accountID}> `
      }
      description += '\n'
    }
    if (description) menuEmbed.setDescription(description)

    const itemList = []
    const items = db.prepare('SELECT itemID, name FROM items WHERE menuID = ? ORDER BY name ASC').all(menuID)
    for (const item of items) {
      itemList.push({
        label: item.name,
        value: item.itemID.toString()
      })
    }
    if (itemList.length !== 0) {
      rows.push(new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('vote')
            .setPlaceholder('Click here to vote!')
            .setMaxValues(itemList.length)
            .addOptions(itemList)
        ))
      rows.push(new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('delete')
            .setPlaceholder('Click here to delete items!')
            .setMaxValues(itemList.length)
            .addOptions(itemList)
        ))
    }
  }

  rows.push(new ActionRowBuilder()
    .addComponents([
      new ButtonBuilder()
        .setCustomId('add')
        .setLabel('Add')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    ])
  )

  return { embeds: [menuEmbed], components: rows, fetchReply: true }
}

module.exports = { menuBuilder }
