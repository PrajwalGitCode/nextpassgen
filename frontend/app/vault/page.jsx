"use client";

import { useEffect, useState } from "react";
import {
  getVaultItems,
  updateVaultItem,
  deleteVaultItem,
} from "@/lib/api";
import { decryptData, encryptData } from "@/lib/crypto";

export default function Vault() {
  const [vaultItems, setVaultItems] = useState([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showPasswordIds, setShowPasswordIds] = useState([]); // track which passwords are visible
  const [editForm, setEditForm] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  const fetchVault = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const items = await getVaultItems();
      const decrypted = await Promise.all(
        items.map(async (item) => ({
          ...item,
          password: await decryptData("user-master-key", item.password),
        }))
      );
      setVaultItems(decrypted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteVaultItem(id);
      setVaultItems(vaultItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url || "",
      notes: item.notes || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    try {
      const encryptedPassword = await encryptData(
        "user-master-key",
        editForm.password
      );
      await updateVaultItem(editingItem, {
        ...editForm,
        password: encryptedPassword,
      });
      setEditingItem(null);
      fetchVault();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePassword = (id) => {
    setShowPasswordIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredItems = vaultItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Vault</h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-3 mb-6 rounded-lg border border-gray-700 bg-[#131417] focus:outline-none"
      />

      <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-[#131417] border border-[#00ffc6]/20 rounded-xl p-5 shadow hover:shadow-lg transition"
          >
            {editingItem === item._id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full mb-2 p-2 rounded bg-[#0f1013] border border-gray-700"
                  placeholder="Title"
                />
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="w-full mb-2 p-2 rounded bg-[#0f1013] border border-gray-700"
                  placeholder="Username / Email"
                />
                <div className="relative">
                  <input
                    type={showPasswordIds.includes(item._id) ? "text" : "password"}
                    name="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 rounded bg-[#0f1013] border border-gray-700"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword(item._id)}
                    className="absolute right-2 top-2 text-sm text-gray-400 hover:text-[#00ffc6]"
                  >
                    {showPasswordIds.includes(item._id) ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type="text"
                  name="url"
                  value={editForm.url}
                  onChange={handleEditChange}
                  className="w-full mb-2 p-2 rounded bg-[#0f1013] border border-gray-700"
                  placeholder="URL"
                />
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  className="w-full mb-3 p-2 rounded bg-[#0f1013] border border-gray-700"
                  placeholder="Notes"
                  rows={3}
                />

                <div className="flex gap-2">
                  <button
                    onClick={submitEdit}
                    className="flex-1 bg-[#00ffc6] text-black py-2 rounded hover:opacity-90 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:opacity-90 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p>
                  <span className="font-semibold">Username:</span> {item.username || "-"}
                </p>
                <p>
                  <span className="font-semibold">Password:</span>{" "}
                  <span className="font-mono text-[#00ffc6]">
                    {showPasswordIds.includes(item._id)
                      ? item.password
                      : "••••••••"}
                  </span>
                  <button
                    onClick={() => togglePassword(item._id)}
                    className="ml-2 text-xs text-gray-400 hover:text-[#00ffc6]"
                  >
                    {showPasswordIds.includes(item._id) ? "Hide" : "Show"}
                  </button>
                </p>
                {item.url && (
                  <p>
                    <span className="font-semibold">URL:</span> {item.url}
                  </p>
                )}
                {item.notes && (
                  <p>
                    <span className="font-semibold">Notes:</span> {item.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(item.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleCopy(item._id, item.password)}
                    className="flex-1 px-2 py-1 text-xs rounded border border-[#00ffc6]/30 hover:bg-[#00ffc6]/10"
                  >
                    {copiedId === item._id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 px-2 py-1 text-xs rounded border border-blue-500/30 hover:bg-blue-500/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 px-2 py-1 text-xs rounded border border-red-500/30 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
