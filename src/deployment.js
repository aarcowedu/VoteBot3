const { config } = require('dotenv')
const { readdirSync } = require('node:fs')
const { Routes, REST } = require('discord.js')
const { join } = require('node:path')

config()

const commands = []
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter((file) => {
  return file.endsWith('.js')
})
for (const file of commandFiles) {
  const filePath = join(commandsPath, file)
  const command = require(filePath)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

rest
  .put(Routes.applicationCommands(process.env.CLIENTID), {
    body: commands
  })
  .then(() =>
    console.log('Successfully registered global application commands.')
  )
  .catch(console.error)
