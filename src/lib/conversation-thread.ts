export type ChatRole = "user" | "assistant";

export interface ChatTurn {
  id: string;
  role: ChatRole;
  content: string;
}

export interface PersistedConversation {
  v: 1;
  pinnedCountry: string | null;
  turns: ChatTurn[];
}

const STORAGE_KEY = "uncharted_map_thread_v1";

function newTurnId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function createTurn(role: ChatRole, content: string): ChatTurn {
  return {
    id: newTurnId(),
    role,
    content,
  };
}

export function emptyConversation(country?: string | null): PersistedConversation {
  return { v: 1, pinnedCountry: country ?? null, turns: [] };
}

export function loadConversation(): PersistedConversation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedConversation;
    const pc = parsed?.pinnedCountry;
    if (
      parsed?.v !== 1 ||
      !Array.isArray(parsed.turns) ||
      (pc !== null && typeof pc !== "string")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveConversation(conv: PersistedConversation): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conv));
  } catch {
    // quota / privacy mode — ignore
  }
}

export function clearConversation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
