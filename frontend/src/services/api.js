import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  // GitHub endpoints
  async getCommits(username, year) {
    const params = year ? { year } : {};
    const response = await this.client.get(`/github/commits/${username}`, {
      params,
    });
    return response.data;
  }

  async getGitHubProfile(username) {
    const response = await this.client.get(`/github/profile/${username}`);
    return response.data;
  }

  async getGitHubStats(username) {
    const response = await this.client.get(`/github/stats/${username}`);
    return response.data;
  }

  // User endpoints
  async upsertUser(userData) {
    const response = await this.client.post("/users", userData);
    return response.data;
  }

  async getUser(username) {
    const response = await this.client.get(`/users/${username}`);
    return response.data;
  }

  // Game Endpoints
  async generateLevel(username, difficulty = "auto", year = null) {
    const response = await this.client.post("/game/generate", {
      username,
      difficulty,
      year,
    });
    return response.data;
  }

  async startGame(levelId, userId) {
    const response = await this.client.post("/game/start", {
      levelId,
      userId,
    });
    return response.data;
  }

  async submitScore(sessionId, score, duration, stats) {
    const response = await this.client.post("/game/submit-score", {
      sessionId,
      score,
      duration,
      stats,
    });
    return response.data;
  }
}

export default new ApiService();
