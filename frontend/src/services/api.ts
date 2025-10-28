const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Entry {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  posterUrl?: string;
  createdAt: string;
  userId: number;
}

export interface CreateEntryData {
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  posterUrl?: string;
}

export interface EntriesResponse {
  entries: Entry[];
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  hasMore: boolean;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Auth methods
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) throw new Error('Failed to register');
    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  }

  // Entry methods with pagination
  async getEntries(page: number = 1, limit: number = 12, search: string = ''): Promise<EntriesResponse> {
    const url = new URL(`${API_BASE_URL}/entries`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch entries');
    return response.json();
  }

  async createEntry(entryData: CreateEntryData): Promise<Entry> {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(entryData),
    });
    if (!response.ok) throw new Error('Failed to create entry');
    return response.json();
  }

  async updateEntry(id: number, entryData: CreateEntryData): Promise<Entry> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(entryData),
    });
    if (!response.ok) throw new Error('Failed to update entry');
    return response.json();
  }
  async getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: this.getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  const data = await response.json();
  return data.user; // Assuming your backend returns { user: User }
}

  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete entry');
  }
}

export const apiService = new ApiService();