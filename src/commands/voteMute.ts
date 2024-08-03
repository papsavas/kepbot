import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  userMention,
} from "discord.js";
import { createCommand } from "~/lib/createCommand";

const MUTE_VOTES_NEEDED = 7;
const MUTE_VOTE_TIME = 60 * 60 * 1000;

export const voteMuteCommand = createCommand({
  data: {
    name: "efyges",
    type: ApplicationCommandType.User,
  },
  execute: async (interaction: UserContextMenuCommandInteraction, data) => {
    if (!interaction.guild)
      return interaction.reply({ content: "Use in guild" });
    const baseContent = `${userMention(interaction.targetUser.id)} efyges`;
    const interactionReply = await interaction.reply({
      content: baseContent,
      fetchReply: true,
    });
    await interactionReply.react("👋");
    const collector = interactionReply.createReactionCollector({
      filter: (reaction, user) => reaction.emoji.name === "👋",
      time: 120000,
    });
    collector.on("collect", async (reaction, user) => {
      const remainingVotes = MUTE_VOTES_NEEDED - reaction.users.cache.size;
      if (remainingVotes > 0)
        interaction.editReply({
          content: `${baseContent} (needs ${remainingVotes} votes)`,
        });
      if (remainingVotes <= 0) {
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
          await interaction.editReply({
            content: baseContent,
          });
          await interactionReply.react("✅");
        } catch (err) {
          await interactionReply.react("💥");
        }
        collector.stop("Vote passed");
      }
    });
  },
});
