const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function checkIn(location) {
  const response = await fetch(`${API_BASE_URL}/attendance/check-in`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ location }),
  });
  if (!response.ok) {
    throw new Error("Failed to check in");
  }
  return response.json();
}

async function checkOut(location) {
  const response = await fetch(`${API_BASE_URL}/attendance/check-out`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ location }),
  });
  if (!response.ok) {
    throw new Error("Failed to check out");
  }
  return response.json();
}

async function getAttendance(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/attendance${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch attendance records");
  }
  return response.json();
}

async function getTodayAttendance() {
  const response = await fetch(`${API_BASE_URL}/attendance/today`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch today's attendance");
  }
  const data = await response.json();
  return data;
}

async function updateAttendance(id, updateData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error("Failed to update attendance");
  }
  const data = await response.json();
  return data;
}

// Added startBreak API call
async function startBreak(type = 'personal') {
  const response = await fetch(`${API_BASE_URL}/attendance/break/start`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ type }),
  });
  if (!response.ok) {
    throw new Error("Failed to start break");
  }
  return response.json();
}

// Added endBreak API call
async function endBreak() {
  const response = await fetch(`${API_BASE_URL}/attendance/break/end`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to end break");
  }
  return response.json();
}

export {
  checkIn,
  checkOut,
  getAttendance,
  getTodayAttendance,
  updateAttendance,
  startBreak,
  endBreak,
};
