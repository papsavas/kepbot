import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  DiscordAPIError,
  Embed,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  RESTJSONErrorCodes,
  TimestampStyles,
  User,
  time,
  userMention,
} from "discord.js";
import { createCommand } from "~/lib/createCommand";

const MIN_VOTES_REQUIRED = 2;
const MUTE_VOTE_TIME = 30 * 60 * 1000;
const DISPOSE_TIME = 2 * 60 * 1000;
const efygesButtonId = "efyges-button";
const emeinesButtonId = "emeines-button";

export const voteMuteCommand = createCommand({
  data: {
    name: "efyges",
    type: ApplicationCommandType.Message,
  },
  execute: async (interaction: MessageContextMenuCommandInteraction, data) => {
    if (!interaction.guild)
      return interaction.reply({ content: "Use in guild" });
    const userId = interaction.targetMessage.author.id;
    const member = await interaction.guild.members.fetch(userId);

    if (member.communicationDisabledUntil !== null) {
      return interaction.reply({
        content: "Member is already muted",
        ephemeral: true,
      });
    }

    const efygesButton = new ButtonBuilder({
      customId: efygesButtonId,
      label: "efyges",
      style: ButtonStyle.Danger,
      emoji: "👋",
    });
    const emeinesButton = new ButtonBuilder({
      customId: emeinesButtonId,
      label: "emeines",
      style: ButtonStyle.Success,
      emoji: "😊",
    });
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      efygesButton,
      emeinesButton
    );

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      ButtonBuilder.from(efygesButton)
        .setDisabled(true)
        .setCustomId(`${efygesButtonId}-disabled`),
      ButtonBuilder.from(emeinesButton)
        .setDisabled(true)
        .setCustomId(`${emeinesButtonId}-disabled`)
    );

    const embed = new EmbedBuilder({
      author: {
        name: member.displayName,
        iconURL: member.user.displayAvatarURL(),
      },
      color: Colors.Yellow,
      title: interaction.targetMessage.content,
      fields: [
        {
          name: "Vote ends in",
          value: time(
            new Date(Date.now() + DISPOSE_TIME),
            TimestampStyles.RelativeTime
          ),
        },
      ],
    });

    const interactionReply = await interaction.reply({
      content: `${userMention(userId)} efyges ?`,
      fetchReply: true,
      components: [row],
      embeds: [embed],
    });

    const collector = interactionReply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (button, collected) => {
        const userId = button.user.id;
        return ![...collected.values()].some(({ user }) => user.id === userId);
      },
      time: DISPOSE_TIME,
      dispose: true,
    });

    collector.on("collect", async (i) => {
      i.reply({
        ephemeral: true,
        content: "Thanks for participating in ΚΕΠ DEMOCRACY",
      });
    });

    collector.on("ignore", (i) => {
      i.reply({
        ephemeral: true,
        content: "You have already voted",
      });
    });

    collector.on("end", async (collected, reason) => {
      const { efygesCount, emeinesCount } = collected.reduce(
        (acc, curr) => {
          if (curr.customId === efygesButtonId) acc.efygesCount++;
          else if (curr.customId === emeinesButtonId) acc.emeinesCount++;
          return acc;
        },
        { efygesCount: 0, emeinesCount: 0 }
      );

      const resultEmbed = EmbedBuilder.from(embed).addFields([
        { name: "Mute", value: `${efygesCount}`, inline: true },
        { name: "Stay", value: `${emeinesCount}`, inline: true },
      ]);

      if (collected.size < MIN_VOTES_REQUIRED)
        return void interaction.editReply({
          content: "Not enough votes",
          components: [],
          embeds: [resultEmbed],
        });

      if (efygesCount > emeinesCount) {
        try {
          await member.timeout(MUTE_VOTE_TIME, `ΚΕΠ DEMOCRACY`);
          await interaction.editReply({
            content: `${userMention(userId)} 👋 efyges`,
            components: [],
            embeds: [
              resultEmbed
                .setFooter({
                  text: `Ta leme se ${MUTE_VOTE_TIME / (60 * 1000)} lepta`,
                })
                .setColor(Colors.Red),
            ],
          });
        } catch (err) {
          if (
            (err as DiscordAPIError).code ===
            RESTJSONErrorCodes.MissingPermissions
          ) {
            await interaction.editReply({
              content: `Missing Permissions 💥`,
              components: [],
              embeds: [resultEmbed],
            });
          }
        }
      } else {
        await interaction.editReply({
          content: `${userMention(userId)} 😊 emeines`,
          components: [],
          embeds: [resultEmbed.setColor(Colors.Green)],
        });
      }
      interaction.followUp({
        content: `Results are in Folks. ${
          efygesCount + emeinesCount
        } votes 👀 🥁`,
      });
    });
  },
});
