"use client";

import { useState } from "react";
import { savePassword } from "@/lib/api";
import { encryptData } from "@/lib/crypto";

export default function LandingPage() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlike, setExcludeLookAlike] = useState(true);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate password
  const generatePassword = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (excludeLookAlike) chars = chars.replace(/[O0l1I]/g, "");

    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setCopied(false);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Encrypt + Save
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");

      if (!title || !password) return alert("Title and password are required!");

      const encryptedPassword = await encryptData("user-master-key", password);

      const res = await savePassword({
        title,
        username,
        url,
        notes,
        password: encryptedPassword,
      });

      alert(res.message || "Password encrypted and saved!");
      setTitle("");
      setUsername("");
      setUrl("");
      setNotes("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Error saving to vault: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center px-4 text-gray-200">
      <div className="w-full max-w-lg bg-[#131417] border border-[#00ffc6]/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(0,255,198,0.05)]">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] bg-clip-text text-transparent">
          Password Generator
        </h1>

        {/* Title */}
        <input
          type="text"
          placeholder="Title (e.g. Gmail, Github...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-[#0c0c0e] border border-[#00ffc6]/20 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00b3ff]/50"
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-[#0c0c0e] border border-[#00ffc6]/20 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00b3ff]/50"
        />

        {/* URL */}
        <input
          type="text"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-[#0c0c0e] border border-[#00ffc6]/20 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00b3ff]/50"
        />

        {/* Notes */}
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-[#0c0c0e] border border-[#00ffc6]/20 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00b3ff]/50"
        />

        {/* Password length + options */}
        <div className="mb-3">
          <label className="block text-sm text-gray-400">
            Password Length: <span className="text-[#00ffc6]">{length}</span>
          </label>
          <input
            type="range"
            min="6"
            max="50"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[#00ffc6]"
          />
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            {[
              ["Uppercase", includeUppercase, setIncludeUppercase],
              ["Lowercase", includeLowercase, setIncludeLowercase],
              ["Numbers", includeNumbers, setIncludeNumbers],
              ["Symbols", includeSymbols, setIncludeSymbols],
              ["No Look-Alikes", excludeLookAlike, setExcludeLookAlike],
            ].map(([label, value, setter]) => (
              <label
                key={label}
                className="flex items-center gap-2 border border-[#1a1b1f] bg-[#0f1013] rounded-lg px-3 py-2 hover:border-[#00b3ff]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setter(!value)}
                  className="accent-[#00ffc6]"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={generatePassword}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] text-black hover:opacity-90 transition"
          >
            Generate Password
          </button>

          {password && (
            <div className="bg-[#0c0c0e] border border-[#00ffc6]/20 p-3 rounded-lg flex justify-between items-center mt-2">
              <span className="font-mono text-[#00ffc6] truncate">{password}</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs rounded border border-[#00ffc6]/30 hover:bg-[#00ffc6]/10"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs rounded border border-[#00b3ff]/30 hover:bg-[#00b3ff]/10"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
