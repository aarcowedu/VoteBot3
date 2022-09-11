
const getMenuData = (messageID, db) => {
  const result = db.prepare('SELECT * FROM menus WHERE messageID = ?').get(messageID)
  if (!result) throw new Error('Menu no longer exists in database.')
  return result
}

module.exports = { getMenuData }
