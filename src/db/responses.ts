import { and, eq, isNull, like, or } from "drizzle-orm";
import type { NonNullableFields } from "~/types";
import { db } from "~db";
import { responses, type Response, type ResponseInsert } from "./schema/responses";

export async function getUserResponses({ userId }: Pick<Response, "userId">) {
  return db.query.responses.findMany({
    where: eq(responses.userId, userId)
  })
}

export async function getResponsesFromMessage({ targetId, trigger }: NonNullableFields<Pick<Response, "targetId" | "trigger">>) {
  return db.query.responses.findMany({
    where: and(
      or(
        isNull(responses.targetId),
        eq(responses.targetId, targetId)
      ),
      like(responses.trigger, trigger)
    )
  })
}

export async function getResponsesFromMention({ targetId }: NonNullableFields<Pick<Response, "targetId">>) {
  return db.query.responses.findMany({
    where:
      and(
        isNull(responses.trigger),
        or(
          isNull(responses.targetId),
          eq(responses.targetId, targetId)
        ),
      )
  })
}


export async function insertResponse(response: ResponseInsert) {
  return db.insert(responses).values(response)
}

export async function deleteResponse({ id, userId }: Pick<Response, "id" | "userId">) {
  return db.delete(responses).where(and(eq(responses.id, id), eq(responses.userId, userId)))
}