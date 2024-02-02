import { Client, Partials } from "discord.js";

const bot = new Client({
  intents: ["Guilds", "MessageContent", "GuildWebhooks", "AutoModerationConfiguration", "GuildBans", "GuildMessageReactions", "GuildIntegrations",],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User]
})

bot.on("ready", (client,) => {
  console.log("Bot is ready")
  console.log(`Logged in as ${client.user?.tag}, serving ${client.guilds.cache.size} guilds`)

})


bot.login(Bun.env.BOT_TOKEN).then(() => console.log("Logged In"));
console.log("Bot is logged in")