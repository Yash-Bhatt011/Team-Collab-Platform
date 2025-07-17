const BASE_URL = "http://localhost:5000/api/attendance";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function checkIn(location) {
  const response = await fetch(`${BASE_URL}/check-in`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ location }),
  });
  if (!response.ok) {
    throw new Error("Failed to check in");
  }
  const data = await response.json();
  return data;
}

async function checkOut(location) {
  const response = await fetch(`${BASE_URL}/check-out`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ location }),
  });
  if (!response.ok) {
    throw new Error("Failed to check out");
  }
  const data = await response.json();
  return data;
}

async function getAttendance(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/?${query}`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch attendance records");
  }
  const data = await response.json();
  return data;
}

async function getTodayAttendance() {
  const response = await fetch(`${BASE_URL}/today`, {
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
  const response = await fetch(`${BASE_URL}/${id}`, {
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
  const response = await fetch(`${BASE_URL}/break/start`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ type }),
  });
  if (!response.ok) {
    throw new Error("Failed to start break");
  }
  const data = await response.json();
  return data;
}

// Added endBreak API call
async function endBreak() {
  const response = await fetch(`${BASE_URL}/break/end`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to end break");
  }
  const data = await response.json();
  return data;
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
