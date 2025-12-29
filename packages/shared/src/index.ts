export interface Task {
  id: string;
  title: string;
  note: string;
  tags: string[];
  color: string;
  q: "do" | "decide" | "delegate" | "delete" | null;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Link {
  id: string;
  url: string;
  title: string;
  favicon: string;
  createdAt: number;
}

export interface UserData {
  tasks: Task[];
  links: Link[];
  createdAt: number;
  updatedAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const COLORS = [
  "#ef4444",
  "#22c55e",
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#facc15",
  "#64748b",
  "#0f172a",
] as const;

export const COLOR_NAMES: Record<string, string> = {
  "#ef4444": "Red",
  "#22c55e": "Green",
  "#f97316": "Orange",
  "#3b82f6": "Blue",
  "#8b5cf6": "Purple",
  "#ec4899": "Pink",
  "#14b8a6": "Teal",
  "#facc15": "Yellow",
  "#64748b": "Gray",
  "#0f172a": "Dark",
};

export function createEmptyUserData(): UserData {
  const now = Date.now();
  return {
    tasks: [],
    links: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createTask(partial: Partial<Task> = {}): Task {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "",
    note: "",
    tags: [],
    color: COLORS[0],
    q: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

export function createLink(url: string, title: string, favicon: string): Link {
  return {
    id: crypto.randomUUID(),
    url,
    title,
    favicon,
    createdAt: Date.now(),
  };
}
