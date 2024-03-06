import { EmbedBuilder, TextChannel, type Client } from "discord.js";
import { getNotificationsFromTimestamp } from "~/db/notifications";
import type { Notification } from "~/db/schema/notifications";
import { discordIds } from "~/lib/discordIds";

export async function sendNotifications(bot: Client, timestamp: number) {
	const notifications = await getNotificationsFromTimestamp(timestamp);

	console.log("Sending Notifications...");

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
	const channel = await (
		await bot.guilds.fetch(discordIds.kepGuildId)
	).channels.fetch(notification.channelId);

	(channel as TextChannel).send({ embeds: [embed], content: "@everyone" });
}
