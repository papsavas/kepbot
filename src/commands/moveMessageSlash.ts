import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, TextChannel, bold } from "discord.js";
import { sendWebhookMessage } from "~/handlers/sendWebhookMessage";
import { createCommand } from "~/lib/createCommand";

export const moveMessageSlashCommand = createCommand({
  data: {
    name: "move-message-slash",
    description: "Moves a message to another channel",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageMessages", "ManageChannels"],
    options: [
      {
        name: "message-url",
        description: "Message URL to move",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "channel-id",
        description: "Channel URL to move the message to",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction, data) => {
    const messageUrl = interaction.options.getString(data.options[0].name, true);
    const targetChannelId = interaction.options.getString(data.options[1].name, true);
    const [guildId, channelId, messageId] = messageUrl.split('/').slice(-3)
    try {
      const messageChannel = (await interaction.guild!.channels.fetch(channelId)) as TextChannel;
      const message = await messageChannel.messages.fetch(messageId);

      const sentMsg = await sendWebhookMessage({
        channelManager: interaction.guild!.channels,
        message,
        targetChannelId,
        user: interaction.user,
      })
      await interaction.reply({
        ephemeral: true,
        content: `Message moved to https://discord.com/channels/${interaction.guild!.id}/${sentMsg.channel_id}/${sentMsg.id}`
      })
    }
    catch (err) {
      console.error(err)
      console.log({ guildId, channelId, messageId })
      await interaction.reply({
        ephemeral: true,
        content: `Something went wrong. Ensure you've provided the correct message ${bold('URL')} and channel ${bold('Id')}`
      })
    }
  }
})