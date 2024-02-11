import { ApplicationCommandOptionType, ApplicationCommandType, Colors, inlineCode, userMention, type ChatInputCommandInteraction } from "discord.js";
import { deleteResponse, getUserResponses, insertResponse } from "~/db/responses";
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
        max_length: 2000,
        required: true
      },
      {
        name: "target",
        description: "Target user",
        type: ApplicationCommandOptionType.User,
      },
      {
        name: "trigger",
        description: "Trigger text",
        type: ApplicationCommandOptionType.String,
        min_length: 1,
        max_length: 2000,
      },
      ]
    }, {
      name: "remove",
      description: "Removes a response",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "id",
        description: "Id of the response to remove",
        type: ApplicationCommandOptionType.Integer,
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
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction, data) => {
    const subcommand = interaction.options.getSubcommand() as typeof data['options'][number]['name'];
    switch (subcommand) {
      case 'add': {
        const response = interaction.options.getString(data.options[0].options[0].name, true);
        const target = interaction.options.getUser(data.options[0].options[1].name, false);
        const trigger = interaction.options.getString(data.options[0].options[2].name, false);
        const userId = interaction.user.id;
        await insertResponse({ text: response, userId, targetId: target?.id, trigger });
        await interaction.reply({
          ephemeral: true,
          content: `Added response ${inlineCode(response)}${target ? ` for ${target.toString()}` : ''}${trigger ? ` with trigger ${inlineCode(trigger)}` : ''} ✅`
        })
        break;
      }

      case 'list': {
        const responses = await getUserResponses({ userId: interaction.user.id });
        const batchesOf20 = responses.reduce((acc, curr, i) => {
          const index = Math.floor(i / 20);
          if (!acc[index]) acc[index] = [];
          acc[index].push(curr);
          return acc;
        }, [] as typeof responses[])
        await interaction.reply({
          ephemeral: true,
          content: `Found ${responses.length} responses`,
          embeds: batchesOf20.map((batch, batchIndex) =>
          ({
            title: `Responses ${batchesOf20.length > 1 ? ` (${batchIndex + 1}/${batchesOf20.length})` : ''}`,
            description: "List of your responses",
            color: Colors.Orange,
            author: {
              name: interaction.user.username,
              icon_url: interaction.user.avatarURL() ?? undefined,
            },
            fields: batch.map(({ id, text, targetId, trigger }) => {
              const truncatedText = text.length > 800 ? `${text.slice(0, 800)}...` : text;
              return {
                name: `id: ${id}`,
                value: `${truncatedText}${targetId ? ` (target:${userMention(targetId)})` : ''}${trigger ? ` (trigger:${inlineCode(trigger)})` : ''}`
              }
            })
          })
          )
        })
        break;
      }

      case "remove": {
        const id = interaction.options.getInteger(data.options[1].options[0].name, true);
        const [{ affectedRows }, packets] = await deleteResponse({ id, userId: interaction.user.id });
        await interaction.reply({
          ephemeral: true,
          content: affectedRows > 0 ? `Removed response with id: ${id} 🗑️` : `Response with id:${id} not found`
        })
        break;
      }

      default: interaction.reply({ content: "Subcommand not implemented", ephemeral: true })
    }

  }
})