import { Client, Partials } from "discord.js";

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

bot.once("ready", (client) => {
	console.log("Bot is ready");
	console.log(
		`serving ${client.guilds.cache.map(v => v.name).join(', ')} guilds`,
	);
});



bot.login(Bun.env.BOT_TOKEN).then(() => console.log("Logged In"));
