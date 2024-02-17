import { ActionRowBuilder, ApplicationCommandType, ChannelSelectMenuBuilder, ChannelType, ComponentType, DiscordAPIError, MessageContextMenuCommandInteraction, RESTJSONErrorCodes } from "discord.js";
import { sendWebhookMessage } from "~/handlers/sendWebhookMessage";
import { createCommand } from "~/lib/createCommand";

export const moveMessageCtxCommand = createCommand({
  data: {
    name: "move-message-ctx",
    type: ApplicationCommandType.Message,
    defaultMemberPermissions: ["ManageMessages", "ManageChannels"],
  },
  execute: async (interaction: MessageContextMenuCommandInteraction, data) => {
    if (!interaction.guild) return
    const message = interaction.targetMessage;
    const guildChannels = interaction.guild.channels;
    if (!guildChannels) return;
    const select = new ChannelSelectMenuBuilder({
      customId: 'move_msg_channel_select',
      channelTypes: [ChannelType.GuildText, ChannelType.PublicThread],
      placeholder: 'Select channel to send',
    });
    const res = await interaction.reply({
      ephemeral: true,
      components: [
        new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(select),
      ],
    });

    const collectedSelect = await res.awaitMessageComponent({
      componentType: ComponentType.ChannelSelect,
    });

    await collectedSelect.deferReply({ ephemeral: true });

    const targetChannelId = collectedSelect.values[0];

    try {
      const { sentMessage } = await sendWebhookMessage({
        channelManager: interaction.guild.channels,
        message,
        targetChannelId,
        user: interaction.user,
      })

      await collectedSelect.editReply({
        content: `Message moved to https://discord.com/channels/${interaction.guild.id}/${sentMessage.channel_id}/${sentMessage.id}`,
      });

    } catch (err) {
      if (
        // biome-ignore lint/suspicious/noDoubleEquals: idk it weird
        (err as DiscordAPIError).code == RESTJSONErrorCodes.MissingPermissions
      )
        await collectedSelect.editReply({
          content: 'I am missing permissions',
        });
    }
  }
})