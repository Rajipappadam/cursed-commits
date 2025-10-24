import { Octokit } from '@octokit/rest';

class GitHubService {
  constructor(accessToken) {
    this.octokit = new Octokit({
      auth: accessToken
    });
  }

  // Get user's GitHub profile
  async getUserProfile(username) {
    try {
      const { data } = await this.octokit.users.getByUsername({ username });
      return {
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      throw error;
    }
  }

  // Get user's commit activity for a specific year
  async getCommitActivity(username, year = new Date().getFullYear()) {
    try {
      // GitHub's contribution calendar shows contributions for the past year
      // We'll fetch events and calculate commits
      const startDate = new Date(year, 0, 1); // Jan 1
      const endDate = new Date(year, 11, 31); // Dec 31
      
      // For a real implementation, we'd use GitHub GraphQL API
      // For now, we'll create a simplified version using REST API
      
      const repos = await this.getUserRepos(username);
      const commitsByDate = {};

      // Initialize all dates in the year with 0 commits
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        commitsByDate[dateStr] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fetch commits for each repo (limit to avoid rate limits)
      const repoLimit = Math.min(repos.length, 10); // Limit to 10 repos for demo
      
      for (let i = 0; i < repoLimit; i++) {
        const repo = repos[i];
        try {
          const commits = await this.octokit.repos.listCommits({
            owner: username,
            repo: repo.name,
            author: username,
            since: startDate.toISOString(),
            until: endDate.toISOString(),
            per_page: 100
          });

          commits.data.forEach(commit => {
            const date = commit.commit.author.date.split('T')[0];
            if (commitsByDate[date] !== undefined) {
              commitsByDate[date]++;
            }
          });
        } catch (error) {
          console.log(`Skipping repo ${repo.name}:`, error.message);
        }
      }

      return this.formatCommitData(commitsByDate, year);
    } catch (error) {
      console.error('Error fetching commit activity:', error);
      throw error;
    }
  }

  // Get user's repositories
  async getUserRepos(username) {
    try {
      const { data } = await this.octokit.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 100
      });
      return data;
    } catch (error) {
      console.error('Error fetching repos:', error);
      throw error;
    }
  }

  // Format commit data into weeks and days structure
  formatCommitData(commitsByDate, year) {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    
    // Find the first Sunday of the year (or use Jan 1)
    let currentDate = new Date(startDate);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0) {
      currentDate.setDate(currentDate.getDate() - dayOfWeek);
    }

    let totalCommits = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    // Build weeks structure
    while (currentDate.getFullYear() <= year) {
      const week = { startDate: currentDate.toISOString().split('T')[0], days: [] };

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const commits = commitsByDate[dateStr] || 0;
        
        week.days.push({
          date: dateStr,
          commits: commits,
          safe: commits > 0
        });

        totalCommits += commits;

        // Calculate streaks
        if (commits > 0) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);

      if (currentDate.getFullYear() > year) break;
    }

    return {
      year,
      totalCommits,
      currentStreak,
      longestStreak,
      weeks
    };
  }

  // Calculate statistics
  async getCommitStats(username) {
    try {
      const activity = await this.getCommitActivity(username);
      const avgPerDay = (activity.totalCommits / 365).toFixed(2);
      
      // Find most active day of week
      const dayCommits = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
      activity.weeks.forEach(week => {
        week.days.forEach((day, index) => {
          dayCommits[index] += day.commits;
        });
      });
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const maxDayIndex = dayCommits.indexOf(Math.max(...dayCommits));

      return {
        totalCommits: activity.totalCommits,
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        avgCommitsPerDay: parseFloat(avgPerDay),
        mostActiveDay: dayNames[maxDayIndex]
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      throw error;
    }
  }
}

export default GitHubService;