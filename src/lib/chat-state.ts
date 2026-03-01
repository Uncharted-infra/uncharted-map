const CHAT_STATE_KEY = "uncharted_map_chat_state";

export type ChatMode = "explore" | "plan" | "book";

export interface ChatState {
  country: string | null;
  mode: ChatMode;
}

const DEFAULT_STATE: ChatState = {
  country: null,
  mode: "explore",
};

export function getChatState(): ChatState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(CHAT_STATE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ChatState>;
    return {
      country: typeof parsed.country === "string" ? parsed.country : null,
      mode:
        parsed.mode === "explore" || parsed.mode === "plan" || parsed.mode === "book"
          ? parsed.mode
          : "explore",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function setChatState(country: string | null, mode: ChatMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CHAT_STATE_KEY,
      JSON.stringify({ country, mode })
    );
  } catch {
    // Ignore storage errors (quota, private mode, etc.)
  }
}
