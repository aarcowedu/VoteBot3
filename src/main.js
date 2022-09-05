const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { config } = require('dotenv')
const { readdirSync } = require('node:fs')
const { join } = require('node:path')
const sqlite3 = require('sqlite3')
config()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.db = new sqlite3.Database('data.sqlite')
client.db.serialize(() => {
  client.db.run('CREATE TABLE IF NOT EXISTS menus (menuID INTEGER PRIMARY KEY, messageID TEXT NOT NULL, channelID TEXT NOT NULL, guildID TEXT NOT NULL, roleID TEXT NOT NULL)')
    .run('CREATE TABLE IF NOT EXISTS items (itemID INTEGER PRIMARY KEY, name TEXT NOT NULL, menuID INTEGER NOT NULL, FOREIGN KEY (menuID) REFERENCES menus (menuID) ON UPDATE CASCADE ON DELETE CASCADE)')
    .run('CREATE TABLE IF NOT EXISTS votes (voteID INTEGER PRIMARY KEY, accountID TEXT NOT NULL, menuID INTEGER NOT NULL, itemID INTEGER NOT NULL, FOREIGN KEY (menuID) REFERENCES menus (menuID) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (itemID) REFERENCES items (itemID) ON UPDATE CASCADE ON DELETE CASCADE)')
})
client.commands = new Collection()

const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter((file) => {
  return file.endsWith('.js')
})
for (const file of commandFiles) {
  const filePath = join(commandsPath, file)
  const command = require(filePath)
  client.commands.set(command.data.name, command)
}

const eventsPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

// Login to Discord with your client's token
client.login(process.env.TOKEN)
