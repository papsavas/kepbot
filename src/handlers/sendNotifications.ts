import { EmbedBuilder, TextChannel, type Client } from "discord.js";
import { getNotificationsFromTimestamp } from "~/db/notifications";
import type { Notification } from "~/db/schema/notifications";
import { discordIds } from "~/lib/discordIds";

export async function sendNotifications(bot: Client, timestamp: number) {
	const notifications = await getNotificationsFromTimestamp(timestamp);

	// Send the notifications to the channels
	await Promise.allSettled(
		notifications.map((n) => generateAndSendEmbed(bot, n)),
	);
}

async function generateAndSendEmbed(bot: Client, notification: Notification) {
	// Create embed
	const embed = new EmbedBuilder();
	embed.setTitle(notification.title);
	embed.setDescription(notification.content);
	embed.setTimestamp(Date.now());

	// Send embed to channel and tag @everyone
	const channel = bot.guilds.cache
		.get(discordIds.kepGuildId)
		?.channels.cache.get(notification.channelId);

	(channel as TextChannel).send({ embeds: [embed], content: "@everyone" });
}
