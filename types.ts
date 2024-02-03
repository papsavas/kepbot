import type { ApplicationCommandData, ApplicationCommandType } from "discord.js"

export type Command = {
  type: ApplicationCommandType,
  data: ApplicationCommandData,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  execute: (interaction: any) => Promise<unknown>
}