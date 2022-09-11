
const getMenuData = (messageID, db) => {
  const result = db.prepare('SELECT * FROM menus WHERE messageID = ?').get(messageID)
  return result
}

module.exports = { getMenuData }
