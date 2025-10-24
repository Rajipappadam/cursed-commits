import UserService from '../services/user.service.js';

class UserController {
  // Create or update user
  async upsertUser(req, res) {
    try {
      const { id, login, avatar_url } = req.body;

      if (!id || !login) {
        return res.status(400).json({ error: 'Missing required fields: id, login' });
      }

      const user = await UserService.upsertUser({
        id,
        login,
        avatar_url
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in upsertUser:', error);
      res.status(500).json({ 
        error: 'Failed to save user',
        message: error.message 
      });
    }
  }

  // Get user by username
  async getUser(req, res) {
    try {
      const { username } = req.params;
      const user = await UserService.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getUser:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user',
        message: error.message 
      });
    }
  }
}

export default new UserController();