import GitHubService from '../services/github.service.js';

class GitHubController {
  // Get user's commits
  async getCommits(req, res) {
    try {
      const { username } = req.params;
      const { year } = req.query;
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
      }

      const githubService = new GitHubService(accessToken);
      const commitData = await githubService.getCommitActivity(
        username, 
        year ? parseInt(year) : undefined
      );

      res.json({
        success: true,
        data: commitData
      });
    } catch (error) {
      console.error('Error in getCommits:', error);
      res.status(500).json({ 
        error: 'Failed to fetch commits',
        message: error.message 
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const { username } = req.params;
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
      }

      const githubService = new GitHubService(accessToken);
      const profile = await githubService.getUserProfile(username);

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ 
        error: 'Failed to fetch profile',
        message: error.message 
      });
    }
  }

  // Get commit statistics
  async getStats(req, res) {
    try {
      const { username } = req.params;
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
      }

      const githubService = new GitHubService(accessToken);
      const stats = await githubService.getCommitStats(username);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stats',
        message: error.message 
      });
    }
  }
}

export default new GitHubController();