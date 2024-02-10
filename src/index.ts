import { Client, Partials } from "discord.js";
import { chatInputCommands } from "./commands";

const bot = new Client({
	intents: [
		"Guilds",
		"MessageContent",
		"GuildWebhooks",
		"AutoModerationConfiguration",
		"GuildBans",
		"GuildMessageReactions",
		"GuildIntegrations",
		"GuildMessages"
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
	],
});

bot.once("ready", async (client) => {
	console.log("Bot is ready");
	console.log(
		`serving ${client.guilds.cache.map(v => v.name).join(', ')} guilds`,
	);
});

bot.on("messageCreate", async (message) => {
	try {
		validateRegisteredEmail(message);
		respondToMessage(message);
	} catch (error) {
		console.error(error);
	}
})

bot.on("interactionCreate", async (interaction) => {
	try {
		if (interaction.isChatInputCommand()) {
			const command = chatInputCommands.find(c => c.data.name === interaction.commandName);
			if (!command) return void interaction.reply({ content: "Command not found", ephemeral: true });
			return void command.execute(interaction, command.data);
		}

	} catch (error) {
		console.error(error);
	}

})
bot.login(Bun.env.BOT_TOKEN).then(() => console.log("Logged In"));

process.on('unhandledRejection', (reason, p) => {
	console.log(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (reason, p) => {
	console.log(`Unhandled Exception: ${reason}`);
});

import { Elysia } from 'elysia';
import { respondToMessage } from "./handlers/respondToMessage";
import { validateRegisteredEmail } from "./handlers/validateRegisteredEmail";

new Elysia()
	.get('/', () => 'Hello World')
	.get('/json', () => ({
		hello: 'world'
	}))
	.listen(3000)