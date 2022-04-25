// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const ids = {
    messages: {
        notificationMaster: "968126385728155648",
    },
    roles: {
        notifTwitch: "968120426532335707",
    },
};

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

let guild = null; // Fetched after ready

// When the client is ready, run this code (only once)
client.once("ready", () => {
    guild = client.guilds.cache.get("933180897233100840");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (commandName === "bus") {
        await interaction.reply("B*tch, I'm a bus!");
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(
                "Something went wrong when fetching the message:",
                error
            );
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (reaction.message.id == ids.messages.notificationMaster) {
        switch (reaction._emoji.name) {
            case "twitch":
                const member = await guild.members.fetch(user.id);
                member.roles.add(ids.roles.notifTwitch);
                break;
        }
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(
                "Something went wrong when fetching the message:",
                error
            );
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (reaction.message.id == ids.messages.notificationMaster) {
        switch (reaction._emoji.name) {
            case "twitch":
                const member = await guild.members.fetch(user.id);
                member.roles.remove(ids.roles.notifTwitch);
                break;
        }
    }
});

// Login to Discord with your client's token
client.login(token);
