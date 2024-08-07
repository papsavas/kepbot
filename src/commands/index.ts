import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import type { BotCommand } from "~/lib/createCommand";
import { moveMessageCtxCommand } from "./moveMessageCtx";
import { moveMessageSlashCommand } from "./moveMessageSlash";
import { responsesCommand } from "./responses";
import { voteMuteCommand } from "./voteMute";

export const commands = [
  responsesCommand,
  moveMessageCtxCommand,
  moveMessageSlashCommand,
  voteMuteCommand,
] as unknown as BotCommand[];

export const {
  chatInputCommands,
  userCtxMenuCommands,
  messageCtxMenuCommands,
} = commands.reduce(
  (acc, command) => {
    switch (command.data.type) {
      case ApplicationCommandType.ChatInput: {
        acc.chatInputCommands.push(
          command as BotCommand<ChatInputCommandInteraction>
        );
        return acc;
      }

      case ApplicationCommandType.User: {
        acc.userCtxMenuCommands.push(command);
        return acc;
      }

      case ApplicationCommandType.Message: {
        acc.messageCtxMenuCommands.push(command);
        return acc;
      }

      default:
        return acc;
    }
  },
  {
    chatInputCommands: [],
    messageCtxMenuCommands: [],
    userCtxMenuCommands: [],
  } as {
    chatInputCommands: BotCommand<ChatInputCommandInteraction>[];
    userCtxMenuCommands: BotCommand<UserContextMenuCommandInteraction>[];
    messageCtxMenuCommands: BotCommand<MessageContextMenuCommandInteraction>[];
  }
);
