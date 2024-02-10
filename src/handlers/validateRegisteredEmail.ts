import type { Message, TextChannel } from "discord.js";
import { discordIds } from "~/lib/discordIds";
import { studentEmailRegex } from "~/lib/utils";

export async function validateRegisteredEmail(message: Message) {
  if (!message.guild || message.guildId !== discordIds.kepGuildId) return
  if (message.channelId !== discordIds.channels.newMembers) return
  if (message.author.id !== discordIds.members.emailBot) return
  const email = message.content.split("→").at(-1)?.trim();
  if (!email) {
    const logs = (await message.guild.channels.fetch(discordIds.channels.logs)) as TextChannel;
    return logs.send(`Could not resolve email from message: ${message.url}`)
  };
  if (!studentEmailRegex.test(email)) {
    const adminRole = message.guild.roles.cache.get(discordIds.roles.admin)!;
    //TODO: replace with banning
    await message.reply(adminRole.toString())
  }
}