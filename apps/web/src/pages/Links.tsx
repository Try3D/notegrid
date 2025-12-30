import { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import type { Link } from "@eisenhower/shared";

export default function Links() {
  const { links, addLink, deleteLink, reorderLinks, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggedLink, setDraggedLink] = useState<Link | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleAddLink = async () => {
    const url = urlInput.trim();
    if (!url) return;

    setSaving(true);

    try {
      let title = url;
      let favicon = "";

      try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
        title = urlObj.hostname;
      } catch {}

      addLink({ url, title, favicon });
      setUrlInput("");
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddLink();
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, link: Link) => {
    setDraggedLink(link);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", link.id);
    setTimeout(() => {
      (e.target as HTMLElement).classList.add("dragging");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("dragging");
    setDraggedLink(null);
    setDragOverId(null);
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragCounter.current++;
    if (draggedLink && draggedLink.id !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetLink: Link) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (!draggedLink || draggedLink.id === targetLink.id) {
      setDragOverId(null);
      return;
    }

    const draggedIndex = links.findIndex((l) => l.id === draggedLink.id);
    const targetIndex = links.findIndex((l) => l.id === targetLink.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDragOverId(null);
      return;
    }

    const newLinks = [...links];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    reorderLinks(newLinks.map((l) => l.id));
    setDragOverId(null);
  };

  const handleDropEnd = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (!draggedLink) {
      setDragOverId(null);
      return;
    }

    const draggedIndex = links.findIndex((l) => l.id === draggedLink.id);

    if (draggedIndex === -1 || draggedIndex === links.length - 1) {
      setDragOverId(null);
      return;
    }

    const newLinks = [...links];
    newLinks.splice(draggedIndex, 1);
    newLinks.push(draggedLink);

    reorderLinks(newLinks.map((l) => l.id));
    setDragOverId(null);
  };

  if (loading) {
    return (
      <>
        <header>
          <h1>Links</h1>
        </header>
        <div className="empty-state">Loading...</div>
      </>
    );
  }

  return (
    <>
      <header>
        <h1>Links</h1>
      </header>

      <div className="links-container">
        <div className="links-list">
          {links.length === 0 ? (
            <div className="empty-state">
              No links yet. Add one to get started!
            </div>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className={`link-item ${dragOverId === link.id ? "drag-over" : ""} ${draggedLink?.id === link.id ? "dragging" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, link)}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => handleDragEnter(e, link.id)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, link)}
              >
                <span className="drag-handle">⋮⋮</span>
                {link.favicon && (
                  <img src={link.favicon} alt="" className="link-favicon" />
                )}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-info"
                >
                  <span className="link-title">{link.title}</span>
                  <span className="link-url">{link.url}</span>
                </a>
                <div className="link-actions">
                  <button
                    className="delete-btn-small"
                    onClick={() => handleDelete(link.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          {/* Drop zone for end of list */}
          {links.length > 0 && (
            <div
              className={`link-drop-end ${dragOverId === "end" ? "drag-over" : ""}`}
              onDragEnter={(e) => handleDragEnter(e, "end")}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDropEnd}
            />
          )}
        </div>
        <button className="add-link-btn" onClick={() => setShowModal(true)}>
          + Add Link
        </button>
      </div>

      {/* Modal */}
      <div
        className={`modal ${showModal ? "open" : ""}`}
        onClick={() => setShowModal(false)}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add Link</h3>
            <button onClick={() => setShowModal(false)}>&#10005;</button>
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste URL here..."
            autoFocus
          />
          <div className="modal-footer">
            <button
              className="save-btn"
              onClick={handleAddLink}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
