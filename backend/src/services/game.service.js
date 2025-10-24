class GameService {
  // Generate game level from commit data
  generateLevel(commitData, difficulty = 'auto') {
    const { weeks, totalCommits } = commitData;

    // Calculate difficulty if auto
    if (difficulty === 'auto') {
      difficulty = this.calculateDifficulty(totalCommits);
    }

    // Flatten weeks into grid
    const grid = this.createGrid(weeks);

    // Place monsters
    const monsters = this.placeMonsters(grid, difficulty);

    // Place power-ups
    const powerUps = this.placePowerUps(grid, difficulty);

    // Calculate metadata
    const metadata = this.calculateMetadata(grid, monsters, powerUps, difficulty);

    return {
      levelId: this.generateLevelId(),
      difficulty,
      grid,
      monsters,
      powerUps,
      metadata
    };
  }

  // Calculate difficulty based on commit count
  calculateDifficulty(totalCommits) {
    if (totalCommits < 100) return 'easy';
    if (totalCommits < 500) return 'medium';
    return 'hard';
  }

  // Create grid from weeks data
  createGrid(weeks) {
    const cells = [];
    let cellIndex = 0;

    weeks.forEach((week, weekIdx) => {
      week.days.forEach((day, dayIdx) => {
        cells.push({
          id: `cell-${cellIndex}`,
          x: weekIdx,
          y: dayIdx,
          date: day.date,
          commits: day.commits,
          safe: day.safe,
          type: this.determineCellType(day.commits)
        });
        cellIndex++;
      });
    });

    return {
      width: weeks.length,
      height: 7, // Days in a week
      cells
    };
  }

  // Determine cell type based on commits
  determineCellType(commits) {
    if (commits === 0) return 'danger';
    if (commits < 3) return 'safe';
    if (commits < 6) return 'safe-medium';
    if (commits < 10) return 'safe-high';
    return 'safe-epic'; // 10+ commits = potential boss or powerup
  }

  // Place monsters on dangerous cells
  placeMonsters(grid, difficulty) {
    const monsters = [];
    const dangerCells = grid.cells.filter(cell => cell.type === 'danger');

    // Monster density based on difficulty
    const densityMap = {
      easy: 0.3,    // 30% of danger cells
      medium: 0.5,  // 50% of danger cells
      hard: 0.7     // 70% of danger cells
    };

    const density = densityMap[difficulty] || 0.5;
    const monsterCount = Math.floor(dangerCells.length * density);

    // Shuffle danger cells
    const shuffled = this.shuffleArray([...dangerCells]);

    for (let i = 0; i < monsterCount; i++) {
      const cell = shuffled[i];
      const monsterType = this.selectMonsterType(difficulty, i);

      monsters.push({
        id: `monster-${i}`,
        type: monsterType,
        x: cell.x,
        y: cell.y,
        cellId: cell.id,
        ...this.getMonsterStats(monsterType)
      });
    }

    return monsters;
  }

  // Select monster type based on difficulty and position
  selectMonsterType(difficulty, index) {
    const types = {
      easy: ['basic', 'basic', 'basic', 'fast'],
      medium: ['basic', 'basic', 'fast', 'tank'],
      hard: ['basic', 'fast', 'tank', 'boss']
    };

    const typeList = types[difficulty] || types.medium;
    
    // Every 20th monster could be a boss in hard mode
    if (difficulty === 'hard' && index % 20 === 19) {
      return 'boss';
    }

    return typeList[Math.floor(Math.random() * typeList.length)];
  }

  // Get monster statistics
  getMonsterStats(type) {
    const stats = {
      basic: {
        health: 50,
        damage: 10,
        speed: 1,
        points: 50
      },
      fast: {
        health: 30,
        damage: 15,
        speed: 2,
        points: 75
      },
      tank: {
        health: 100,
        damage: 20,
        speed: 0.5,
        points: 150
      },
      boss: {
        health: 200,
        damage: 30,
        speed: 1.5,
        points: 500
      }
    };

    return stats[type] || stats.basic;
  }

  // Place power-ups on high-commit cells
  placePowerUps(grid, difficulty) {
    const powerUps = [];
    const epicCells = grid.cells.filter(cell => cell.type === 'safe-epic');
    const highCells = grid.cells.filter(cell => cell.type === 'safe-high');

    // Power-up density
    const powerUpCells = [...epicCells, ...highCells.slice(0, Math.floor(highCells.length * 0.3))];
    const shuffled = this.shuffleArray(powerUpCells);

    // Place power-ups (limit based on difficulty)
    const maxPowerUps = {
      easy: 15,
      medium: 10,
      hard: 7
    };

    const count = Math.min(shuffled.length, maxPowerUps[difficulty] || 10);

    for (let i = 0; i < count; i++) {
      const cell = shuffled[i];
      const powerUpType = this.selectPowerUpType();

      powerUps.push({
        id: `powerup-${i}`,
        type: powerUpType,
        x: cell.x,
        y: cell.y,
        cellId: cell.id,
        ...this.getPowerUpStats(powerUpType)
      });
    }

    return powerUps;
  }

  // Select power-up type
  selectPowerUpType() {
    const types = ['shield', 'speed', 'health', 'attack'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // Get power-up statistics
  getPowerUpStats(type) {
    const stats = {
      shield: {
        duration: 5000, // 5 seconds
        effect: 'invincibility',
        points: 25
      },
      speed: {
        duration: 7000, // 7 seconds
        effect: 'speed_boost',
        multiplier: 2,
        points: 25
      },
      health: {
        amount: 1, // Restore 1 health
        effect: 'heal',
        points: 20
      },
      attack: {
        duration: 10000, // 10 seconds
        effect: 'damage_boost',
        multiplier: 2,
        points: 30
      }
    };

    return stats[type] || stats.health;
  }

  // Calculate level metadata
  calculateMetadata(grid, monsters, powerUps, difficulty) {
    const safeCells = grid.cells.filter(c => c.safe).length;
    const dangerCells = grid.cells.filter(c => !c.safe).length;
    const totalCells = grid.cells.length;

    return {
      totalCells,
      safeCells,
      dangerCells,
      safePercentage: ((safeCells / totalCells) * 100).toFixed(1),
      monsterCount: monsters.length,
      powerUpCount: powerUps.length,
      estimatedDuration: this.estimateDuration(grid, difficulty),
      difficultyScore: this.calculateDifficultyScore(
        dangerCells,
        monsters.length,
        powerUps.length
      )
    };
  }

  // Estimate game duration in seconds
  estimateDuration(grid, difficulty) {
    const baseTime = {
      easy: 120,   // 2 minutes
      medium: 180, // 3 minutes
      hard: 240    // 4 minutes
    };

    return baseTime[difficulty] || 180;
  }

  // Calculate difficulty score (0-10)
  calculateDifficultyScore(dangerCells, monsterCount, powerUpCount) {
    const dangerScore = (dangerCells / 365) * 5; // Max 5 points
    const monsterScore = (monsterCount / 100) * 3; // Max 3 points
    const powerUpPenalty = (powerUpCount / 20) * 2; // Max -2 points

    return Math.max(0, Math.min(10, dangerScore + monsterScore - powerUpPenalty)).toFixed(1);
  }

  // Generate unique level ID
  generateLevelId() {
    return `level-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Shuffle array helper
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Save game session to database
  async saveGameSession(userId, levelData, finalScore, stats) {
    // This will be implemented when we connect to the database
    return {
      sessionId: this.generateLevelId(),
      userId,
      levelId: levelData.levelId,
      score: finalScore,
      stats
    };
  }
}

export default new GameService();