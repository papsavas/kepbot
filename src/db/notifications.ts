import { eq } from "drizzle-orm";
import {
	notifications,
	type Notification,
	type NotificationInsert,
} from "~/db/schema/notifications";
import { db } from "~db";

export async function getNotificationsFromTimestamp(
	timestamp: number,
): Promise<Array<Notification>> {
	return await db.query.notifications.findMany({
		where: eq(notifications.timestamp, timestamp),
	});
}

export async function insertNotification(notification: NotificationInsert) {
	return db.insert(notifications).values(notification);
}

export async function deleteNotification({ id }: Pick<Notification, "id">) {
	return db.delete(notifications).where(eq(notifications.id, id));
}
