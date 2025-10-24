import GameService from '../services/game.service.js';
import GitHubService from '../services/github.service.js';

class GameController {
  // Generate game level from commits
  async generateLevel(req, res) {
    try {
      const { username, difficulty = 'auto', year } = req.body;
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
      }

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      // Fetch commit data
      const githubService = new GitHubService(accessToken);
      const commitData = await githubService.getCommitActivity(
        username,
        year ? parseInt(year) : undefined
      );

      // Generate game level
      const levelData = GameService.generateLevel(commitData, difficulty);

      res.json({
        success: true,
        data: levelData
      });
    } catch (error) {
      console.error('Error in generateLevel:', error);
      res.status(500).json({
        error: 'Failed to generate level',
        message: error.message
      });
    }
  }

  // Start a new game session
  async startGame(req, res) {
    try {
      const { levelId, userId } = req.body;

      if (!levelId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      res.json({
        success: true,
        data: {
          sessionId,
          levelId,
          startTime: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in startGame:', error);
      res.status(500).json({
        error: 'Failed to start game',
        message: error.message
      });
    }
  }

  // Submit game score
  async submitScore(req, res) {
    try {
      const { sessionId, score, duration, stats } = req.body;

      if (!sessionId || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // TODO: Save to database in future
      // For now, just return success

      res.json({
        success: true,
        data: {
          sessionId,
          score,
          duration,
          saved: true,
          rank: Math.floor(Math.random() * 100) + 1 // Placeholder
        }
      });
    } catch (error) {
      console.error('Error in submitScore:', error);
      res.status(500).json({
        error: 'Failed to submit score',
        message: error.message
      });
    }
  }
}

export default new GameController();