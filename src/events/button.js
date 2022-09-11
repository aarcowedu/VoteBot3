const { ActionRowBuilder } = require('@discordjs/builders')
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const { getMenuRole } = require('../helpers')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!interaction.isButton()) return
    try {
      if (interaction.customId === 'add') {
        console.log(interaction.message.id)
        const roleID = getMenuRole(interaction.message.id, interaction.client.db)
        if (!interaction.member.roles.cache.has(roleID)) return await interaction.reply({ content: 'You do not have the role to administrate this vote menu!', ephemeral: true })
        const modal = new ModalBuilder()
          .setCustomId(interaction.message.id)
          .setTitle('Add Items')
          .addComponents(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId('items')
                  .setLabel('Enter an item on each new line.')
                  .setStyle(TextInputStyle.Paragraph)
              )
          )
        await interaction.showModal(modal)
      }
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
