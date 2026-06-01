import type {
  InventoryKind,
  InventorySearchInput,
  InventorySearchResponse,
} from "./types";

const INVENTORY_SEARCH = /* GraphQL */ `
  query InventorySearch($kind: InventoryKind!, $input: InventorySearchInput!) {
    inventorySearch(kind: $kind, input: $input) {
      searchId
      kind
      status
      cacheHit
      stale
      error {
        code
        message
      }
      meta {
        fetchedAt
        ttlSeconds
        providersAttempted
        providersSucceeded
      }
      flightOffers {
        id
        origin
        destination
        departAt
        arriveAt
        durationMinutes
        airline
        stops
        cabin
        price {
          amount
          currency
        }
        deepLink
        provider {
          name
          offerRef
        }
        expiresAt
      }
    }
  }
`;

const INVENTORY_SEARCH_BY_ID = /* GraphQL */ `
  query InventorySearchById($searchId: ID!) {
    inventorySearchById(searchId: $searchId) {
      searchId
      kind
      status
      cacheHit
      stale
      error {
        code
        message
      }
      meta {
        fetchedAt
        ttlSeconds
        providersAttempted
        providersSucceeded
      }
      flightOffers {
        id
        origin
        destination
        departAt
        arriveAt
        durationMinutes
        airline
        stops
        cabin
        price {
          amount
          currency
        }
        deepLink
        provider {
          name
          offerRef
        }
        expiresAt
      }
    }
  }
`;

async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }

  return json.data;
}

export async function inventorySearch(
  kind: InventoryKind,
  input: InventorySearchInput
): Promise<InventorySearchResponse> {
  const data = await graphqlRequest<{
    inventorySearch: InventorySearchResponse;
  }>(INVENTORY_SEARCH, { kind, input });
  return data.inventorySearch;
}

export async function inventorySearchById(
  searchId: string
): Promise<InventorySearchResponse | null> {
  const data = await graphqlRequest<{
    inventorySearchById: InventorySearchResponse | null;
  }>(INVENTORY_SEARCH_BY_ID, { searchId });
  return data.inventorySearchById;
}

export function isSearchPending(status: InventorySearchResponse["status"]): boolean {
  return status === "STARTED" || status === "PARTIAL";
}

export async function pollInventorySearch(
  searchId: string,
  options?: { intervalMs?: number; maxAttempts?: number }
): Promise<InventorySearchResponse | null> {
  const intervalMs = options?.intervalMs ?? 1500;
  const maxAttempts = options?.maxAttempts ?? 40;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await inventorySearchById(searchId);
    if (!result) return null;
    if (!isSearchPending(result.status)) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return inventorySearchById(searchId);
}
