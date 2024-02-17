import { ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient, type Guild, type GuildChannel, type Message, type TextChannel, type User } from "discord.js";

type Props = {
  targetChannelId: GuildChannel['id']
  channelManager: Guild['channels']
  message: Message;
  user: User
}

export async function sendWebhookMessage({ message, channelManager, targetChannelId, user }: Props) {
  const targetChannel = await channelManager.fetch(
    targetChannelId
  ) as TextChannel;
  const webhook = await targetChannel.createWebhook({
    name: `move-message-${message.author.tag}-${message.id}`,
    reason: `Move Message for ${message.author.tag}`,
    avatar: message.author.avatarURL() ?? message.author.displayAvatarURL(),
  });
  const webhookClient = new WebhookClient({ url: webhook.url });
  const sourceButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setURL(message.url)
    .setLabel('Original Message');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(sourceButton);
  const sentMsg = await webhookClient.send({
    username: `${message.author.username} (by ${user.username})`,
    content: message.content,
    embeds: message.embeds,
    components: [...message.components, row],
    files: message.attachments
      .map((a) =>
        a.url
      ),
  });

  await webhook.delete();
  return sentMsg
}