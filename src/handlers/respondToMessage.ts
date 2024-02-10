import type { Message } from "discord.js";
import { getResponsesFromMessage } from "~/db/responses";
import { discordIds } from "~/lib/discordIds";

export async function respondToMessage(message: Message) {
  const { content, guildId, author, channelId } = message
  if (guildId !== discordIds.kepGuildId) return
  if (author.bot) return
  if (channelId !== discordIds.channels.blabla && channelId !== discordIds.channels.skynet) return
  const savedResponses = await getResponsesFromMessage({ userId: author.id, targetId: author.id, trigger: content });
  if (savedResponses.length === 0) return
  const response = savedResponses[Math.floor(Math.random() * savedResponses.length)];
  await message.channel.send(response.text);
}