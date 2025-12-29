import { useState } from "react";
import { useData } from "../context/DataContext";

export default function Links() {
  const { links, addLink, deleteLink, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);

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
              <div key={link.id} className="link-item">
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
