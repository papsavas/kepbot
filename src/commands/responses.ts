import { ApplicationCommandOptionType, ApplicationCommandType, type ChatInputCommandInteraction } from "discord.js";
import { insertResponse } from "~/db/responses";
import { createCommand } from "~/lib/createCommand";


export const responsesCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  data: {
    name: "responses",
    description: "Manages responses of the bot",
    type: ApplicationCommandType.ChatInput,
    options: [{
      name: "add",
      description: "Adds a response",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "response",
        description: "Response text",
        type: ApplicationCommandOptionType.String,
        min_length: 1,
        required: true
      }
      ]
    }, {
      name: "remove",
      description: "Removes a response",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "id",
        description: "Id of the response to remove",
        type: ApplicationCommandOptionType.String,
        min_length: 1,
        required: true,
      }
      ]
    },
    {
      name: "list",
      description: "Lists all responses",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "clear",
      description: "Clears all responses",
      type: ApplicationCommandOptionType.Subcommand
    }
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction, data) => {
    const subcommand = interaction.options.getSubcommand() as typeof data['options'][number]['name'];
    switch (subcommand) {
      case 'add': {
        const response = interaction.options.getString(data.options[0].options[0].name, true);
        const userId = interaction.user.id;
        const res = await insertResponse({ text: response, userId });
        await interaction.reply({
          ephemeral: true,
          content: `Response added${JSON.stringify(res)}`
        })
        break;
      }

      default: interaction.reply({ content: "Subcommand not implemented", ephemeral: true })
    }

  }
})