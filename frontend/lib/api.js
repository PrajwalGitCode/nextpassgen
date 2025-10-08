const API_URL = "http://localhost:5000/api"; // backend URL

// Signup
export async function signup(data) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Signup failed");
    }

    return res.json();
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
}

// Login
export async function login(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }

    const json = await res.json();
    // Save token client-side
    if (json.token) localStorage.setItem("token", json.token);
    return json;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

// =================== HELPERS ===================

// Get auth headers safely
const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =================== VAULT ===================

// GET all vault items
export async function getVaultItems() {
  try {
    const res = await fetch(`${API_URL}/vault`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch vault items");
    return res.json();
  } catch (err) {
    console.error("Get vault items error:", err);
    throw err;
  }
}

// CREATE new vault item
export async function savePassword(data) {
  try {
    const res = await fetch(`${API_URL}/vault`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to save password");
    }

    return res.json();
  } catch (err) {
    console.error("Save password error:", err);
    throw err;
  }
}

// UPDATE vault item
export async function updateVaultItem(id, data) {
  try {
    const res = await fetch(`${API_URL}/vault/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update vault item");
    }

    return res.json();
  } catch (err) {
    console.error("Update vault item error:", err);
    throw err;
  }
}

// DELETE vault item
export async function deleteVaultItem(id) {
  try {
    const res = await fetch(`${API_URL}/vault/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to delete vault item");
    }

    return res.json();
  } catch (err) {
    console.error("Delete vault item error:", err);
    throw err;
  }
}
