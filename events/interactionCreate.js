const { Events, Collection } = require("discord.js");

// const wait = (ms) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// };

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    /**
     * Edit Reply
     * https://discordjs.guide/slash-commands/response-methods.html#editing-responses
     */
    // if (interaction.commandName === "ping") {
    //   await interaction.reply("Pong!");
    //   await wait(2_000);
    //   await interaction.editReply("Pong again!");
    //   return;
    // }

    /**
     * Deferred Response
     * https://discordjs.guide/slash-commands/response-methods.html#deferred-responses
     */
    // if (interaction.commandName === "ping") {
    //   await interaction.deferReply({ ephemeral: true });
    //   await wait(4_000);
    //   await interaction.editReply("Pong!");
    //   return;
    // }

    /**
     * Follow-ups
     * https://discordjs.guide/slash-commands/response-methods.html#follow-ups
     */
    // if (interaction.commandName === "ping") {
    //   await interaction.reply("Pong!");
    //   await interaction.followUp("Pong again!");
    //   return;
    // }

    /**
     * Fetching and deleting responses
     * https://discordjs.guide/slash-commands/response-methods.html#fetching-and-deleting-responses
     */
    // if (interaction.commandName === "ping") {
    //   await interaction.reply("Pong!");
    //   await interaction.deleteReply();
    //   return;
    // }
    // if (interaction.commandName === "ping") {
    //   await interaction.reply('Pong!');
    //   const message = await interaction.fetchReply();
    //   console.log(message);
    //   return;
    // }

    /**
     * Localized responses
     * https://discordjs.guide/slash-commands/response-methods.html#fetching-and-deleting-responses
     */
    // const locales = {
    //   pl: 'Witaj Świecie!',
    //   de: 'Hallo Welt!',
    // };
    // interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        console.log(expirationTime);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
