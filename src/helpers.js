
const getMenuRole = async (messageID, database) => {
  let ret
  await database.serialize(async () => {
    await database.get('SELECT roleID FROM menus WHERE messageID = ?', [messageID], async (err, result) => {
      if (err) throw err
      console.log('yeet')
      ret = result.roleID
      console.log(ret)
    })
  })
  console.log('beet')
  console.log(ret)
  return ret
}

module.exports = { getMenuRole }
