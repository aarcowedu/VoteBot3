const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js')
const menuBuilder = async (database, menuID) => {
  const menuEmbed = new EmbedBuilder()
    .setTitle('Vote menu!')
    .setDescription('New menu!')
  const rows = []

  if (menuID) {
    let description = ''
    await database.each('SELECT itemID, name, COUNT(voteID) FROM items INNER JOIN votes USING(itemID) WHERE menuID = ? GROUP BY itemID ORDER BY COUNT(voteID) ASC', [menuID], async (err, result) => {
      if (err) throw err
      description += `[${result['COUNT(voteID)']}] ${result.name}\n`
      await database.each('SELECT accountID FROM votes WHERE itemID = ?', [result.itemID], (err, subResult) => {
        if (err) throw err
        description += `<@${subResult.accountID}> `
      })
      description += '\n'
    })
    if (description) menuEmbed.setDescription(description)

    const itemList = []
    await database.each('SELECT itemID, name FROM items WHERE menuID = ? ORDER BY name ASC', [menuID], (err, result) => {
      if (err) throw err
      itemList.push({
        label: result.name,
        value: result.itemID
      })
    })
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

const adminMenuBuilder = () => {
  const rows = []
  rows.push(new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('addbutton')
        .setLabel('Add')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('closebutton')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    )
  )
  rows.push(new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
        .setCustomId('delete')
        .setPlaceholder('Delete dropdown')
        .setMaxValues(2)
        .addOptions(
          [{
            label: 'test1',
            description: 'this is a description',
            value: 'optiona'
          },
          {
            label: 'test2',
            description: 'this is also a description',
            value: 'optionb'
          }]
        )
    )
  )
  return { content: 'test', ephemeral: true, components: rows }
}

module.exports = { menuBuilder, adminMenuBuilder }
