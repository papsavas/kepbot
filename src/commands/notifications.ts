import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction,
} from "discord.js";
import {
	deleteNotification,
	getAllNotifications,
	insertNotification,
} from "~/db/notifications";
import { createCommand } from "~/lib/createCommand";

const days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
] as const;

export const notificationsCommand = createCommand({
	data: {
		name: "notifications",
		description: "Sends notifications on the channel the command is ran",
		type: ApplicationCommandType.ChatInput,
		options: [
			{
				name: "create",
				description: "Create a new notification",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "title",
						description: "Notification title",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "message",
						description: "Notification message",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "day",
						description: "Day to trigger notification",
						type: ApplicationCommandOptionType.Integer,
						required: true,
						choices: days.map((d, i) => ({
							name: d,
							value: i + 1,
						})),
					},
					{
						name: "time",
						description: "Time of the day to trigger notification",
						type: ApplicationCommandOptionType.Integer,
						required: true,
						choices: Array.from({ length: 24 }).map((_, i) => ({
							name: `${i.toString().padStart(2, "0")}:00`,
							value: i,
						})),
					},
				],
			},
			{
				name: "delete",
				description: "Deletes a notification",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "id",
						description: "The id of the notification",
						type: ApplicationCommandOptionType.Integer,
						required: true,
					},
				],
			},
			{
				name: "list",
				description: "Lists all notifications",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	execute: async (interaction: ChatInputCommandInteraction, data) => {
		let replyText: string;

		const subcommand =
			interaction.options.getSubcommand() as (typeof data)["options"][number]["name"];
		switch (subcommand) {
			case "create": {
				// Gather data for notification
				const title = interaction.options.getString(
					data.options[0].options[0].name,
					true,
				);
				const content = interaction.options.getString(
					data.options[0].options[1].name,
					true,
				);
				const day = interaction.options.getInteger(
					data.options[0].options[2].name,
					true,
				);
				const time = interaction.options.getInteger(
					data.options[0].options[3].name,
					true,
				);

				// Create notification entry
				await insertNotification({
					channelId: interaction.channelId, // TODO
					timestamp: (day << 5) | (time & 0x1f),
					title,
					content,
				});

				replyText = "Notification created successfully!";
				break;
			}
			case "delete": {
				const id = interaction.options.getInteger(
					data.options[1].options[0].name,
					true,
				);
				const [{ affectedRows }, packets] = await deleteNotification({
					id,
				});

				replyText =
					affectedRows > 0
						? `Removed response with id: ${id} 🗑️`
						: `Response with id:${id} not found`;
				break;
			}
			case "list": {
				const notifications = await getAllNotifications();
				const files =
					notifications.length > 0
						? [
								{
									name: "notifications.json",
									attachment: Buffer.from(
										JSON.stringify(notifications, null, 2),
									),
								},
						  ]
						: undefined;

				return await interaction.reply({
					ephemeral: true,
					content: `Found ${notifications.length} notifications`,
					files,
				});
			}
			default:
				// No default behaviour
				replyText = "An Error Occured!";
				break;
		}

		// Send reply
		interaction.reply({
			ephemeral: true,
			content: replyText,
		});
	},
});
