import { createYoga } from "graphql-yoga";

import { inventorySchema } from "@/server/inventory/schema";
import { createClient } from "@/lib/supabase/server";

const yoga = createYoga({
  schema: inventorySchema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async () => {
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      userId = null;
    }
    return { userId };
  },
});

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
