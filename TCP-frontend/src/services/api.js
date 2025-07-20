const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async login(credentials) {
    const response = await fetch(`