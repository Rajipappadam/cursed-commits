import { supabase } from '../config/supabase.config.js';

class UserService {
  // Create or update user in database
  async upsertUser(githubData) {
    try {
      const userData = {
        github_id: githubData.id,
        username: githubData.login,
        avatar_url: githubData.avatar_url
      };

      const { data, error } = await supabase
        .from('users')
        .upsert(userData, { 
          onConflict: 'github_id',
          returning: 'representation'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  // Get user by GitHub ID
  async getUserByGithubId(githubId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('github_id', githubId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Get user by username
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  // Update user stats
  async updateUserStats(userId, stats) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          total_games: stats.totalGames,
          highest_score: stats.highestScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
}

export default new UserService();