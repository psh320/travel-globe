import { describe, expect, it } from "vitest";

import { createTravelPost } from "@/lib/supabase/repositories/travel-posts";
import type { PersistedTravelPostRecord } from "@/lib/supabase/types";

describe("travel post repository", () => {
  it("persists city_name alongside the post payload", async () => {
    let insertedPayload: Record<string, unknown> | undefined;

    const post: PersistedTravelPostRecord = {
      id: "post-1",
      user_id: "user-1",
      visit_id: "visit-1",
      title: "Harbor evening",
      content: "A good night walk.",
      country_code: "HK",
      city_name: "Hong Kong",
      created_at: "2026-03-12T00:00:00.000Z",
      updated_at: "2026-03-12T00:00:00.000Z",
    };

    const supabase = {
      from(table: string) {
        expect(table).toBe("travel_posts");

        return {
          insert(payload: Record<string, unknown>) {
            insertedPayload = payload;

            return {
              select() {
                return {
                  single: async () => ({
                    data: post,
                    error: null,
                  }),
                };
              },
            };
          },
        };
      },
    } as never;

    const result = await createTravelPost(supabase, "user-1", {
      visit_id: "visit-1",
      title: "Harbor evening",
      content: "A good night walk.",
      country_code: "HK",
      city_name: "Hong Kong",
    });

    expect(insertedPayload).toMatchObject({
      user_id: "user-1",
      visit_id: "visit-1",
      city_name: "Hong Kong",
    });
    expect(result.cityName).toBe("Hong Kong");
    expect(result.countryCode).toBe("HK");
  });
});
