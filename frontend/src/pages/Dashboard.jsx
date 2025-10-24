import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import { supabase } from "../lib/supabase";
import UserProfile from "../components/auth/UserProfile";
import LevelPreview from "../components/game/levelPreview";
import apiService from "../services/api";

export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const { setLevelData } = useGameStore();
  const navigate = useNavigate();
  const [commitData, setCommitData] = useState(null);
  const [stats, setStats] = useState(null);
  const [levelData, setLocalLevelData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [generatingLevel, setGeneratingLevel] = useState(false);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState("auto");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchGitHubData();
    }
  }, [user]);

  const fetchGitHubData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      apiService.setAuthToken(session.provider_token);

      const username = user.user_metadata?.user_name;
      if (!username) throw new Error("No username found");

      await apiService.upsertUser({
        id: user.user_metadata?.provider_id,
        login: username,
        avatar_url: user.user_metadata?.avatar_url,
      });

      const [commitsResponse, statsResponse] = await Promise.all([
        apiService.getCommits(username),
        apiService.getGitHubStats(username),
      ]);

      setCommitData(commitsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Error fetching GitHub data:", err);
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGenerateLevel = async () => {
    try {
      setGeneratingLevel(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      apiService.setAuthToken(session.provider_token);

      const username = user.user_metadata?.user_name;
      const response = await apiService.generateLevel(username, difficulty);

      setLocalLevelData(response.data);
      setLevelData(response.data); // Store in game store

      // Scroll to preview
      setTimeout(() => {
        document.querySelector("#level-preview")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error("Error generating level:", err);
      setError(err.message);
    } finally {
      setGeneratingLevel(false);
    }
  };

  if (loading) {
    return <div className="loading-inline">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <UserProfile />

        <div className="dashboard-main-card">
          <h2 className="dashboard-title">
            Welcome, {user.user_metadata?.user_name}! 🎉
          </h2>

          {loadingData && (
            <div className="loading-data">Loading your GitHub data...</div>
          )}

          {error && <div className="error-message">Error: {error}</div>}

          {stats && (
            <div className="stats-grid">
              <StatCard
                icon="📊"
                label="Total Commits"
                value={stats.totalCommits}
              />
              <StatCard
                icon="🔥"
                label="Current Streak"
                value={`${stats.currentStreak} days`}
              />
              <StatCard
                icon="🏆"
                label="Longest Streak"
                value={`${stats.longestStreak} days`}
              />
              <StatCard
                icon="📈"
                label="Avg Per Day"
                value={stats.avgCommitsPerDay}
              />
              <StatCard
                icon="📅"
                label="Most Active"
                value={stats.mostActiveDay}
              />
            </div>
          )}

          {commitData && (
            <div className="commit-graph-section">
              <h3 className="commit-graph-title">
                Your Contribution Graph ({commitData.year})
              </h3>
              <CommitGraph weeks={commitData.weeks} />
            </div>
          )}

          {/* Game Generation Section */}
          {commitData && (
            <div className="game-generation-section">
              <h3 className="game-generation-title">
                🎮 Generate Your Game Level
              </h3>

              <div className="difficulty-selector">
                <label className="difficulty-label">Select Difficulty:</label>
                <div className="difficulty-buttons">
                  {["auto", "easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`difficulty-button ${
                        difficulty === diff ? "selected" : ""
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
                {difficulty === "auto" && (
                  <p className="difficulty-info">
                    Auto difficulty: Based on your commit count (
                    {commitData.totalCommits} commits ={" "}
                    {commitData.totalCommits < 100
                      ? "Easy"
                      : commitData.totalCommits < 500
                      ? "Medium"
                      : "Hard"}
                    )
                  </p>
                )}
              </div>
              <button
                onClick={handleGenerateLevel}
                disabled={generatingLevel}
                className="generate-button"
              >
                {generatingLevel
                  ? "🔄 Generating Level..."
                  : "🎮 Generate Game Level"}
              </button>
            </div>
          )}

          {/* Level Preview */}
          {levelData && (
            <div id="level-preview">
              <LevelPreview levelData={levelData} />

              <div className="level-actions">
                <button
                  onClick={() => alert("Game will start soon! 🎮")}
                  className="play-button"
                >
                  ▶️ Play Now!
                </button>
                <button
                  onClick={handleGenerateLevel}
                  className="regenerate-button"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

// Commit Graph Visualization
function CommitGraph({ weeks }) {
  if (!weeks || weeks.length === 0) return null;

  return (
    <div className="commit-graph-container">
      <div className="commit-graph">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="commit-week">
            {week.days.map((day, dayIdx) => {
              const intensity =
                day.commits === 0
                  ? 0
                  : day.commits < 3
                  ? 1
                  : day.commits < 6
                  ? 2
                  : day.commits < 10
                  ? 3
                  : 4;

              const colors = [
                "#ebedf0",
                "#9be9a8",
                "#40c463",
                "#30a14e",
                "#216e39",
              ];

              return (
                <div
                  key={dayIdx}
                  title={`${day.date}: ${day.commits} commits`}
                  className="commit-day"
                  style={{
                    backgroundColor: colors[intensity],
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="commit-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="legend-square"
            style={{
              backgroundColor: [
                "#ebedf0",
                "#9be9a8",
                "#40c463",
                "#30a14e",
                "#216e39",
              ][i],
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
