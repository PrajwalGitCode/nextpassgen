import VaultItem from "../models/VaultItem.js";

// CREATE
export const createVaultItem = async (req, res) => {
  try {
    const { title, username, password, url, notes } = req.body;

    if (!title || !password) {
      return res.status(400).json({ message: "Title and password are required" });
    }

    const item = await VaultItem.create({
      user: req.userId,
      title,
      username,
      password,
      url,
      notes,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Vault POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ ALL for logged-in user
export const getVaultItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ user: req.userId });
    res.json(items);
  } catch (err) {
    console.error("Vault GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateVaultItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await VaultItem.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Vault UPDATE error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteVaultItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await VaultItem.findOneAndDelete({ _id: id, user: req.userId });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Vault DELETE error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
