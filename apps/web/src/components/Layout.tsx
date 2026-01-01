import { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useSetAtom } from "jotai";
import { activePageAtom } from "../store";

export default function Layout() {
  const location = useLocation();
  const isKanban = location.pathname === "/kanban";
  const setActivePage = useSetAtom(activePageAtom);

  useEffect(() => {
    if (location.pathname === "/links") {
      setActivePage("links");
    } else {
      setActivePage("tasks");
    }
  }, [location.pathname, setActivePage]);

  return (
    <>
      <nav className="sidebar">
        <NavLink
          to="/"
          className={({ isActive }: { isActive: boolean }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
          title="Todos"
          end
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </NavLink>
        <NavLink
          to="/matrix"
          className={({ isActive }: { isActive: boolean }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
          title="Eisenhower Matrix"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </NavLink>
        <NavLink
          to="/kanban"
          className={({ isActive }: { isActive: boolean }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
          title="Kanban Board"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="5" height="18" rx="1" />
            <rect x="10" y="3" width="5" height="12" rx="1" />
            <rect x="17" y="3" width="5" height="15" rx="1" />
          </svg>
        </NavLink>
        <NavLink
          to="/links"
          className={({ isActive }: { isActive: boolean }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
          title="Links"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </NavLink>
        <div className="sidebar-spacer"></div>
        <NavLink
          to="/settings"
          className={({ isActive }: { isActive: boolean }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
          title="Settings"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </NavLink>
      </nav>

      <main className={`main-content${isKanban ? " kanban-page" : ""}`}>
        <Outlet />
      </main>
    </>
  );
}
