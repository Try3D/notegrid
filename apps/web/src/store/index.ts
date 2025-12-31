import { atom } from "jotai";
import type { Task, Link, UserData } from "@eisenhower/shared";
import { API_URL } from "../config";

const CACHE_KEY = "eisenhower_data";

// Base atoms
export const uuidAtom = atom<string | null>(localStorage.getItem("uuid"));
export const loadingAtom = atom(true);
export const userDataAtom = atom<UserData | null>(null);

// Derived atoms
export const tasksAtom = atom((get) => get(userDataAtom)?.tasks ?? []);
export const linksAtom = atom((get) => get(userDataAtom)?.links ?? []);

// Auth actions
export const setUuidAtom = atom(null, (_get, set, uuid: string | null) => {
  if (uuid) {
    localStorage.setItem("uuid", uuid);
  } else {
    localStorage.removeItem("uuid");
    localStorage.removeItem(CACHE_KEY);
  }
  set(uuidAtom, uuid);
});

// Data sync
let syncTimeout: number | null = null;

const saveToAPI = async (uuid: string, data: UserData) => {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = window.setTimeout(async () => {
    try {
      await fetch(`${API_URL}/api/data`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${uuid}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }, 300);
};

const saveData = (uuid: string | null, data: UserData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  if (uuid) saveToAPI(uuid, data);
};

// Fetch data action
export const fetchDataAtom = atom(null, async (get, set) => {
  const uuid = get(uuidAtom);
  if (!uuid) {
    set(userDataAtom, null);
    set(loadingAtom, false);
    return;
  }

  // Load from cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      set(userDataAtom, JSON.parse(cached));
    } catch {}
  }

  try {
    const response = await fetch(`${API_URL}/api/data`, {
      headers: {
        Authorization: `Bearer ${uuid}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });
    const result = await response.json();

    if (result.success && result.data) {
      set(userDataAtom, result.data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
    } else {
      const emptyData = createEmptyData();
      set(userDataAtom, emptyData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(emptyData));
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    if (!cached) {
      set(userDataAtom, createEmptyData());
    }
  } finally {
    set(loadingAtom, false);
  }
});

function createEmptyData(): UserData {
  const now = Date.now();
  return { tasks: [], links: [], createdAt: now, updatedAt: now };
}

// Task actions
export const addTaskAtom = atom(null, (get, set, partial: Partial<Task>) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return null;

  const now = Date.now();
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: "",
    note: "",
    tags: [],
    color: "#ef4444",
    q: null,
    kanban: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };

  const newData = {
    ...data,
    tasks: [...data.tasks, newTask],
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
  return newTask;
});

export const updateTaskAtom = atom(null, (get, set, id: string, updates: Partial<Task>) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return;

  const now = Date.now();
  const newData = {
    ...data,
    tasks: data.tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: now } : t
    ),
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
});

export const deleteTaskAtom = atom(null, (get, set, id: string) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return;

  const now = Date.now();
  const newData = {
    ...data,
    tasks: data.tasks.filter((t) => t.id !== id),
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
});

export const moveTaskAtom = atom(
  null,
  (get, set, taskId: string, updates: Partial<Task>, newIndex: number, groupKey: keyof Task, groupValue: string | null) => {
    const uuid = get(uuidAtom);
    const data = get(userDataAtom);
    if (!data) return;

    const taskToMove = data.tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    const now = Date.now();
    const updatedTask = { ...taskToMove, ...updates, updatedAt: now };

    // Get tasks in target group (excluding moved task)
    const targetGroupTasks = data.tasks.filter((t) => {
      if (t.id === taskId) return false;
      return groupValue === null ? !t[groupKey] : t[groupKey] === groupValue;
    });

    // Get tasks not in target group (excluding moved task)
    const otherTasks = data.tasks.filter((t) => {
      if (t.id === taskId) return false;
      return groupValue === null ? !!t[groupKey] : t[groupKey] !== groupValue;
    });

    // Insert at correct position
    const clampedIndex = Math.max(0, Math.min(newIndex, targetGroupTasks.length));
    targetGroupTasks.splice(clampedIndex, 0, updatedTask);

    const newData = {
      ...data,
      tasks: [...otherTasks, ...targetGroupTasks],
      updatedAt: now,
    };
    set(userDataAtom, newData);
    saveData(uuid, newData);
  }
);

// Link actions
export const addLinkAtom = atom(null, (get, set, link: Omit<Link, "id" | "createdAt">) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return;

  const now = Date.now();
  const newLink: Link = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: now,
  };

  const newData = {
    ...data,
    links: [...data.links, newLink],
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
});

export const deleteLinkAtom = atom(null, (get, set, id: string) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return;

  const now = Date.now();
  const newData = {
    ...data,
    links: data.links.filter((l) => l.id !== id),
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
});

export const reorderLinksAtom = atom(null, (get, set, linkIds: string[]) => {
  const uuid = get(uuidAtom);
  const data = get(userDataAtom);
  if (!data) return;

  const linkMap = new Map(data.links.map((l) => [l.id, l]));
  const reorderedLinks = linkIds
    .map((id) => linkMap.get(id))
    .filter((l): l is Link => l !== undefined);
  const remainingLinks = data.links.filter((l) => !linkIds.includes(l.id));

  const now = Date.now();
  const newData = {
    ...data,
    links: [...reorderedLinks, ...remainingLinks],
    updatedAt: now,
  };
  set(userDataAtom, newData);
  saveData(uuid, newData);
});

// Logout action
export const logoutAtom = atom(null, (_get, set) => {
  localStorage.removeItem("uuid");
  localStorage.removeItem(CACHE_KEY);
  set(uuidAtom, null);
  set(userDataAtom, null);
});

// Delete account action
export const deleteAccountAtom = atom(null, async (get, set) => {
  const uuid = get(uuidAtom);
  if (!uuid) return;

  try {
    await fetch(`${API_URL}/api/data`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${uuid}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tasks: [], links: [], deleted: true }),
    });
  } catch (error) {
    console.error("Failed to delete account:", error);
  }

  set(logoutAtom);
});

// Import data action
export const importDataAtom = atom(
  null,
  (get, set, jsonString: string): { success: boolean; error?: string; tasksImported?: number; linksImported?: number } => {
    const uuid = get(uuidAtom);
    const data = get(userDataAtom);
    if (!data) return { success: false, error: "No data context" };

    try {
      const imported = JSON.parse(jsonString);

      if (!imported || typeof imported !== "object") {
        return { success: false, error: "Invalid JSON format" };
      }

      const tasks: Task[] = Array.isArray(imported.tasks)
        ? imported.tasks.filter(
            (t: unknown) =>
              t && typeof t === "object" && "id" in t && "title" in t
          )
        : [];

      const links: Link[] = Array.isArray(imported.links)
        ? imported.links.filter(
            (l: unknown) =>
              l && typeof l === "object" && "id" in l && "url" in l
          )
        : [];

      const now = Date.now();
      const newData: UserData = {
        tasks,
        links,
        createdAt: data.createdAt,
        updatedAt: now,
      };

      set(userDataAtom, newData);
      saveData(uuid, newData);

      return {
        success: true,
        tasksImported: tasks.length,
        linksImported: links.length,
      };
    } catch {
      return { success: false, error: "Failed to parse JSON" };
    }
  }
);

// UUID generation utility
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

// UUID validation utility
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Polling for data sync
const POLL_INTERVAL = 60000; // 60 seconds
let pollInterval: number | null = null;

const fetchLatestData = async (uuid: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`${API_URL}/api/data`, {
      headers: {
        Authorization: `Bearer ${uuid}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.error("Failed to fetch latest data:", error);
  }
  return null;
};

export const startPollingAtom = atom(null, (get, set) => {
  const uuid = get(uuidAtom);
  if (!uuid) return;

  // Stop any existing polling
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }

  // Function to check and update data
  const checkForUpdates = async () => {
    const currentData = get(userDataAtom);
    const latestData = await fetchLatestData(uuid);
    
    if (latestData && currentData) {
      // Only update if remote data is newer
      if (latestData.updatedAt > currentData.updatedAt) {
        set(userDataAtom, latestData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(latestData));
      }
    } else if (latestData && !currentData) {
      set(userDataAtom, latestData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(latestData));
    }
  };

  // Start polling every 60 seconds
  pollInterval = window.setInterval(checkForUpdates, POLL_INTERVAL);

  // Set up visibility change handler
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      // Fetch immediately when tab becomes visible
      checkForUpdates();
      // Restart polling
      if (!pollInterval) {
        pollInterval = window.setInterval(checkForUpdates, POLL_INTERVAL);
      }
    } else {
      // Stop polling when tab is hidden
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }
  };

  // Remove any existing listener and add new one
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Also fetch on window focus (covers more cases)
  const handleFocus = () => {
    checkForUpdates();
  };
  window.removeEventListener("focus", handleFocus);
  window.addEventListener("focus", handleFocus);
});

export const stopPollingAtom = atom(null, () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
});
