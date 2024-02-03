import { ApplicationCommandType } from "discord.js";
import type { Command } from "../../types";
import { lockChannel } from "./lockChannel";

export const commands = [lockChannel]

export const { chatInputCommands, userCtxMenuCommands, messageCtxMenuCommands } = commands.reduce((acc, command: Command) => {
  switch (command.type) {
    case ApplicationCommandType.ChatInput: {
      acc.chatInputCommands.push(command)
      return acc;
    }

    case ApplicationCommandType.User: {
      acc.userCtxMenuCommands.push(command)
      return acc;
    }

    case ApplicationCommandType.Message: {
      acc.messageCtxMenuCommands.push(command)
      return acc;
    }

    default: return acc
  }

}, { chatInputCommands: [], messageCtxMenuCommands: [], userCtxMenuCommands: [] } as Record<"chatInputCommands" | "userCtxMenuCommands" | "messageCtxMenuCommands", Command[]>)

// export function createCommand<T extends Interaction>(props: {
//   name: string,
//   data: ApplicationCommandData,
//   execute: (interaction: T) => void
// }) {

// }