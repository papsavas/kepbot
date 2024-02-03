import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, type ChatInputCommandInteraction, type PublicThreadChannel } from "discord.js";
import type { Command } from "../../types";

export const lockChannel = {
  type: ApplicationCommandType.ChatInput,
  data: {
    name: "lock-thread",
    description: "Locks a public thread",
    defaultMemberPermissions: ['ManageChannels'],
    type: ApplicationCommandType.ChatInput,
    options: [{
      name: "thread",
      description: "Thread to lock (accepts ids too)",
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channelTypes: [ChannelType.PublicThread],
    }, {
      name: "reason",
      description: "The reason for locking the thread",
      type: ApplicationCommandOptionType.String,
      required: false,
    }],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const channelOption = interaction.options.getChannel('channel');
    if (channelOption?.type !== ChannelType.PublicThread) {
      return await interaction.reply({
        ephemeral: true,
        content: "Channel must be a public thread"
      })
    }
    const reasonOption = interaction.options.getString('reason');
    const channel = channelOption as PublicThreadChannel;
    channel.setLocked(true, reasonOption ?? undefined)
    await interaction.guild?.channels.fetchActiveThreads()
    await interaction.reply({
      ephemeral: true,
      content: `Locked channel ${channelOption?.name}`
    })
  }
} as const satisfies Command

