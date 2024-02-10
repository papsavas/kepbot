import type { Message } from "discord.js";
import { getResponsesFromMention, getResponsesFromMessage } from "~/db/responses";
import { discordIds } from "~/lib/discordIds";

export async function respondToMessage(message: Message) {
  const { content, guildId, author, channelId } = message
  if (guildId !== discordIds.kepGuildId) return
  if (author.bot) return
  if (channelId !== discordIds.channels.blabla && channelId !== discordIds.channels.skynet) return
  const savedResponses =
    message.mentions.has(Bun.env.CLIENT_ID as string) ? await getResponsesFromMention({ targetId: author.id }) :
      await getResponsesFromMessage({ targetId: author.id, trigger: content });
  if (savedResponses.length === 0) return
  const response = savedResponses[Math.floor(Math.random() * savedResponses.length)];
  await message.channel.send(response.text);
}