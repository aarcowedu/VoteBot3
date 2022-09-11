
const getMenuRole = async (messageID, db) => {
  const roleID = db.prepare('SELECT roleID FROM menus WHERE messageID = ?').get(messageID)
  return roleID.roleID
}

module.exports = { getMenuRole }
