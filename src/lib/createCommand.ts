import type { ApplicationCommandData, CommandInteraction } from "discord.js";

export type BotCommand<TInteraction extends CommandInteraction = CommandInteraction, TData extends ApplicationCommandData = ApplicationCommandData> = {
  data: TData,
  execute: (interaction: TInteraction, data: TData) => Promise<unknown>
}

export function createCommand<const TInteraction extends CommandInteraction, const TData extends ApplicationCommandData,>(command: BotCommand<TInteraction, TData>) {
  return command
}