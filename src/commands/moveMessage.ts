import { ActionRowBuilder, ApplicationCommandType, ChannelSelectMenuBuilder, ChannelType, ComponentType, DiscordAPIError, MessageContextMenuCommandInteraction, RESTJSONErrorCodes, TextChannel, WebhookClient, italic } from "discord.js";
import { createCommand } from "~/lib/createCommand";

export const moveMessageCommand = createCommand({
  data: {
    name: "move-message",
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
      channelTypes: [ChannelType.GuildText],
      placeholder: 'Select a channel',
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
    const targetChannel = interaction.guild.channels.cache.get(
      targetChannelId
    ) as TextChannel;
    const webhook = await targetChannel.createWebhook({
      name: `move-message-${message.author.tag}-${message.id}`,
      reason: `Move Message for ${message.author.tag}`,
      avatar: message.author.avatarURL() ?? message.author.displayAvatarURL(),
    });

    const webhookClient = new WebhookClient({ url: webhook.url });

    try {
      // const avatarURL = message.author.avatarURL({ forceStatic: true, extension: "webp" }) ?? undefined;
      // console.log({ avatarURL })
      const sentMsg = await webhookClient.send({
        username: message.author.username,
        content: `${italic(message.url)}${message.content ? `\n${message.content}` : ""}`,
        embeds: message.embeds,
        components: message.components,
        files: message.attachments
          .map((a) =>
            a.url
          ),
      });

      await collectedSelect.editReply({
        content: `Message moved to https://discord.com/channels/${interaction.guild.id}/${sentMsg.channel_id}/${sentMsg.id}`,
      });

      await webhook.delete();
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