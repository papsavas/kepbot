import type { Message } from "discord.js";
import { getResponsesFromMention, getResponsesFromMessage } from "~/db/responses";
import { discordIds } from "~/lib/discordIds";

export async function respondToMessage(message: Message) {
  const { content, guildId, author, channelId } = message
  if (author.bot) return
  const { channels } = discordIds
  const { blabla, skynet, botCommands, } = channels
  if (!([blabla, skynet, botCommands] as string[]).includes(channelId)) return
  const savedResponses =
    message.mentions.has(Bun.env.CLIENT_ID as string) ? await getResponsesFromMention({ targetId: author.id }) :
      await getResponsesFromMessage({ targetId: author.id, trigger: content });
  if (savedResponses.length === 0) return
  const response = savedResponses[Math.floor(Math.random() * savedResponses.length)];
  await message.channel.send({ content: response.text, allowedMentions: { parse: [] } });
}