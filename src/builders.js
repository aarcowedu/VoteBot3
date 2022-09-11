const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js')
const menuBuilder = async (db, menuID) => {
  const menuEmbed = new EmbedBuilder()
    .setTitle('Vote menu!')
    .setDescription('New menu!')
  const rows = []

  if (menuID) {
    let description = ''
    const itemsWithVotes = db.prepare('SELECT itemID, name, COUNT(voteID) FROM items INNER JOIN votes USING(itemID) WHERE menuID = ? GROUP BY itemID ORDER BY COUNT(voteID) ASC').all(menuID)
    for (const item of itemsWithVotes) {
      description += `[${item['COUNT(voteID)']}] ${item.name}\n`
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
        value: item.itemID
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
        .setLabel('Add Item')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('Close Menu!')
        .setStyle(ButtonStyle.Danger)
    ])
  )

  return { embeds: [menuEmbed], components: rows, fetchReply: true }
}

// const adminMenuBuilder = () => {
//   const rows = []
//   rows.push(new ActionRowBuilder()
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId('addbutton')
//         .setLabel('Add')
//         .setStyle(ButtonStyle.Primary),
//       new ButtonBuilder()
//         .setCustomId('closebutton')
//         .setLabel('Close')
//         .setStyle(ButtonStyle.Danger)
//     )
//   )
//   rows.push(new ActionRowBuilder()
//     .addComponents(
//       new SelectMenuBuilder()
//         .setCustomId('delete')
//         .setPlaceholder('Delete dropdown')
//         .setMaxValues(2)
//         .addOptions(
//           [{
//             label: 'test1',
//             description: 'this is a description',
//             value: 'optiona'
//           },
//           {
//             label: 'test2',
//             description: 'this is also a description',
//             value: 'optionb'
//           }]
//         )
//     )
//   )
//   return { content: 'test', ephemeral: true, components: rows }
// }

module.exports = { menuBuilder }
