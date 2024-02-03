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

bot.on("interactionCreate", async (interaction) => {
	try {
		if (interaction.isChatInputCommand()) {
			return void chatInputCommands.find(c => c.data.name === interaction.commandName)?.execute(interaction).catch(console.error);
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