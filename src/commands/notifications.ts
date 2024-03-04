import { ApplicationCommandType } from "discord.js";
import { createCommand } from "~/lib/createCommand";

export const notificationsCommand = createCommand({
  data: {
    name: "notifications",
    description: "Sends notifications once, or weekly",
    type: ApplicationCommandType.ChatInput,
    options: [],
  },
  execute: async (interaction, data) => {
    interaction.reply({
      ephemeral: true,
      content: "Test"
    })
  },
})