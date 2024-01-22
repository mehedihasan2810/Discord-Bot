const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    /**
     * Ephemeral Response
     * https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
     */
    await interaction.reply({ content: "Pong!", ephemeral: true });
  },
};
