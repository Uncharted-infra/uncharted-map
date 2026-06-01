import { createSchema } from "graphql-yoga";

import { inputHash } from "./cache/hash";
import { connectCacheIfNeeded } from "./cache/client";
import {
  inventorySearch,
  inventorySearchById,
  refreshInventorySearch,
} from "./jobs/run-search";
import { inventoryTypeDefs } from "./schema.graphql";
import type { CabinClass, InventoryKind, InventorySearchInput } from "./types";

export interface GraphQLContext {
  userId: string | null;
}

function mapInput(args: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string | null;
  adults: number;
  children?: number | null;
  cabin?: CabinClass | null;
}): InventorySearchInput {
  return {
    origin: args.origin,
    destination: args.destination,
    departDate: args.departDate,
    returnDate: args.returnDate ?? null,
    adults: args.adults,
    children: args.children ?? null,
    cabin: args.cabin ?? null,
  };
}

async function scheduleBackground(work: () => Promise<void>): Promise<void> {
  try {
    const { after } = await import("next/server");
    after(work);
  } catch {
    void work();
  }
}

export const inventorySchema = createSchema({
  typeDefs: inventoryTypeDefs,
  resolvers: {
    Query: {
      inventorySearch: async (
        _parent: unknown,
        args: { kind: InventoryKind; input: InventorySearchInput },
        ctx: GraphQLContext
      ) => {
        await connectCacheIfNeeded();
        const input = mapInput(args.input);
        const hash = inputHash(args.kind, input);
        const { response, enqueue } = await inventorySearch(args.kind, input, hash, {
          userId: ctx.userId,
        });

        if (response.status === "STARTED" || response.stale) {
          await scheduleBackground(enqueue);
        }

        if (response.cacheHit && response.status !== "STARTED") {
          return { ...response, status: "READY" as const };
        }

        return response;
      },
      inventorySearchById: async (
        _parent: unknown,
        args: { searchId: string }
      ) => {
        await connectCacheIfNeeded();
        return inventorySearchById(args.searchId);
      },
    },
    Mutation: {
      refreshInventorySearch: async (
        _parent: unknown,
        args: { searchId: string },
        ctx: GraphQLContext
      ) => {
        await connectCacheIfNeeded();
        const result = await refreshInventorySearch(args.searchId, { userId: ctx.userId });
        if (!result) return null;
        await scheduleBackground(result.enqueue);
        return result.response;
      },
    },
  },
});
