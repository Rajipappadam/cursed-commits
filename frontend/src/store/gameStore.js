import { create } from "zustand";

export const useGameStore = create((set) => ({
  levelData: null,
  sessionId: null,
  score: 0,
  gameState: "idle", // idle, playing, paused, gameover, won

  setLevelData: (data) => set({ levelData: data }),
  setSessionId: (id) => set({ sessionId: id }),
  setScore: (score) => set({ score }),
  setGameState: (state) => set({ gameState: state }),

  incrementScore: (points) => set((state) => ({ score: state.score + points })),

  resetGame: () =>
    set({
      levelData: null,
      sessionId: null,
      score: 0,
      gameState: "idle",
    }),
}));
