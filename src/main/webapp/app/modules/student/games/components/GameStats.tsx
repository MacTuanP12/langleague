import React, { memo } from 'react';
import { Translate } from 'react-jhipster';

interface GameStatsProps {
  gamesPlayed: number;
  totalScore: number;
  achievements: number;
}

/**
 * GameStats component - Displays user's game statistics
 * Memoized to prevent unnecessary re-renders
 */
export const GameStats: React.FC<GameStatsProps> = memo(({ gamesPlayed, totalScore, achievements }) => {
  return (
    <div className="stats-section">
      <div className="stat-card">
        <i className="bi bi-trophy" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{gamesPlayed}</h3>
          <p>
            <Translate contentKey="langleague.student.games.stats.played">Games Played</Translate>
          </p>
        </div>
      </div>
      <div className="stat-card">
        <i className="bi bi-star-fill" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{totalScore}</h3>
          <p>
            <Translate contentKey="langleague.student.games.stats.score">Total Score</Translate>
          </p>
        </div>
      </div>
      <div className="stat-card">
        <i className="bi bi-award" aria-hidden="true"></i>
        <div className="stat-content">
          <h3>{achievements}</h3>
          <p>
            <Translate contentKey="langleague.student.games.stats.achievements">Achievements</Translate>
          </p>
        </div>
      </div>
    </div>
  );
});

GameStats.displayName = 'GameStats';
