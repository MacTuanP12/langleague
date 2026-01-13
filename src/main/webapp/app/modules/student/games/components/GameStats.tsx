import React from 'react';

interface GameStatsProps {
  gamesPlayed: number;
  totalScore: number;
  achievements: number;
}

/**
 * GameStats component - Displays user's game statistics
 */
export const GameStats: React.FC<GameStatsProps> = ({ gamesPlayed, totalScore, achievements }) => {
  return (
    <div className="stats-section">
      <div className="stat-card">
        <i className="bi bi-trophy" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{gamesPlayed}</h3>
          <p>Games Played</p>
        </div>
      </div>
      <div className="stat-card">
        <i className="bi bi-star-fill" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{totalScore}</h3>
          <p>Total Score</p>
        </div>
      </div>
      <div className="stat-card">
        <i className="bi bi-award" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{achievements}</h3>
          <p>Achievements</p>
        </div>
      </div>
    </div>
  );
};
