import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  userMention,
} from "discord.js";
import { createCommand } from "~/lib/createCommand";

const MUTE_VOTES_NEEDED = 2;
const MUTE_VOTE_TIME = 1 * 60 * 1000;

export const voteMuteCommand = createCommand({
  data: {
    name: "efyges",
    type: ApplicationCommandType.User,
  },
  execute: async (interaction: UserContextMenuCommandInteraction, data) => {
    if (!interaction.guild)
      return interaction.reply({ content: "Use in guild" });
    const interactionReply = await interaction.reply({
      content: `${userMention(interaction.targetUser.id)} efyges`,
      fetchReply: true,
    });
    await interactionReply.react("👋");
    const collector = interactionReply.createReactionCollector({
      filter: (reaction, user) => reaction.emoji.name === "👋",
      time: 120000,
    });
    collector.on("collect", async (reaction, user) => {
      if (reaction.users.cache.size >= MUTE_VOTES_NEEDED) {
        const member = await interaction.guild!.members.fetch(
          interaction.targetUser.id
        );
        try {
          await member.timeout(
            MUTE_VOTE_TIME,
            `ΚΕΠ DEMOCRACY by ${reaction.users.cache.reduce((acc, curr) => {
              return `${acc} ${curr.username} `;
            }, "")}`
          );
          await interactionReply.react("✅");
        } catch (err) {
          await interactionReply.react("💥");
        }
        collector.stop("Vote passed");
      }
    });
  },
});
