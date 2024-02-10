import { and, eq } from "drizzle-orm";
import { db } from "~db";
import { responses, type Response, type ResponseInsert } from "./schema/responses";

export async function getResponses({ userId }: Pick<Response, "userId">) {
  db.query.responses.findMany({
    where: eq(responses.userId, userId)
  })
}

export async function insertResponse(response: ResponseInsert) {
  return db.insert(responses).values(response)
}

export async function deleteResponse({ id, userId }: Pick<Response, "id" | "userId">) {
  return db.delete(responses).where(and(eq(responses.id, id), eq(responses.userId, userId)))
}