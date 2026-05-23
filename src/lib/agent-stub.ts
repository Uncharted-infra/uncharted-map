import type { ChatMode } from "@/components/map/chat-input";

/**
 * Deterministic canned replies until a real agent + tools lands.
 * Keep copy aligned with Explore → Plan → Book phases.
 */

function capitalizeMode(mode: ChatMode): string {
  return mode.slice(0, 1).toUpperCase() + mode.slice(1);
}

/** First assistant reply after country is locked */
export function getIntroAssistantReply(mode: ChatMode, country: string): string {
  const m = capitalizeMode(mode);
  return (
    `You're focused on **${country}**. In **${m}** I'll stay in that lane — no unrelated detours.\n\n` +
    (mode === "explore"
      ? `- **Explore**: narrow destinations, timing, vibes, constraints, tradeoffs.\n` +
        `- When you're happy with direction, switch to **Plan** for pacing and logistics.\n` +
        `- **Book** is for hotel / flight-shaped decisions when you're almost ready.\n\n` +
        `What constraints matter most (dates, pace, weather, budgets, companions)?`
      : mode === "plan"
        ? `- **Plan**: I'll sketch itineraries, pacing, hubs, transit patterns, realistic day blocks.\n` +
          `- You can tweak until it feels doable, then flip to **Book** for specifics.\n\n` +
          `Share fixed dates if you have them, or a rough window and rhythm (fast vs chill).`
        : `- **Book**: outline what you want booked first (hotel base, outbound flight shape, trains).\n` +
          `- I’ll frame options — real inventory comes when we plug in reservations.\n\n` +
          `What nights are fixed, what's flexible?`)
  );
}

function looksLikeFarewell(text: string): boolean {
  return /\b(thanks|thank you|bye|that's all)\b/i.test(text);
}

function looksLikeBookIntent(text: string): boolean {
  return /\b(book|hotel|flight|stay|reserve|booking)\b/i.test(text);
}

function looksLikePlanIntent(text: string): boolean {
  return /\b(day|itinerary|schedule|route|timing|daily|pacing)\b/i.test(text);
}

/** Subsequent assistant replies in the stub thread */
export function getStubAssistantReply(mode: ChatMode, country: string | null, userMessage: string): string {
  const focus = country ? `Keeping **${country}** front and center.` : "Pick a country on the globe to lock geography.";
  const trimmed = userMessage.trim();

  if (!country) {
    return `${focus}\n\nType a country name and click **Select**, or rotate the globe and click land you care about — then we can meaningfully Explore / Plan / Book.`;
  }

  if (looksLikeFarewell(trimmed)) {
    return `Anytime — when you're back, we'll pick up **${country}** in **${capitalizeMode(mode)}**. Tap a suggestion or describe the next tweak.`;
  }

  const suggest =
    mode === "explore"
      ? "**Try**: “Best two-week loop for scenic trains + daylight” or “Family-friendly pacing in autumn.”"
      : mode === "plan"
        ? "**Try**: “4 nights base + side trips?” or “Arrive Thu morning, leave Tue night — build days.”"
        : "**Try**: “Need refundable hotel nights” or “Prefer nonstop outbound; return flexible.”";

  let tone = "";

  if (mode === "explore") {
    if (looksLikeBookIntent(trimmed))
      tone =
        "**Book** is doable — let's lock geography and pacing first so we're not redoing bookings.\n\n" +
        "Say your fixed dates/window + party size, then switch to **Book**.";
    else if (looksLikePlanIntent(trimmed))
      tone =
        "Sounds planning-shaped — flip to **Plan** when you want day-level structure. Here in **Explore** I'll keep comparing regions, seasons, and tradeoffs.";
    else
      tone =
        "**Explore** checklist: who's going, approximate window, max daily travel stamina, budgets (rough is fine).\n\n" +
        "Pick one knot to untangle — e.g. “north vs south,” “city vs countryside,” “fly-in hub.”";
  } else if (mode === "plan") {
    if (looksLikeBookIntent(trimmed))
      tone =
        "We'll wire lodging and transport once pacing is sane. Sketch any **must-see** anchors and nights per city.";
    else
      tone =
        "**Plan**: I'll prioritize realistic transfer days, sunrise/sunset windows, closure risk, fatigue.\n\n" +
        "Give me anchors (first/last nights, festivals, closures) plus “hard no” commute limits.";
  } else {
    tone =
      "**Book** (stub): I’ll summarize options-shaped language next — real fares and nightly rates plug in via tools later.\n\n" +
      "List priorities: refundable vs cheap, baggage, timezone pain, proximity vs comfort.";
  }

  return `${focus}\n\n${tone}\n\n${suggest}`;
}
