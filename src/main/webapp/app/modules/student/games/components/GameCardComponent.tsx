import React from 'react';
import { GameCard as IGameCard } from '../game-hub.constants';

interface GameCardProps {
  game: IGameCard;
  onClick: (game: IGameCard) => void;
}

/**
 * GameCard component - Extracted from GameHub for better modularity
 */
export const GameCardComponent: React.FC<GameCardProps> = ({ game, onClick }) => {
  const getDifficultyLabel = () => {
    return game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
  };

  const getButtonContent = () => {
    if (game.status === 'available') {
      return (
        <>
          <i className="bi bi-play-fill"></i> Play Now
        </>
      );
    }
    return (
      <>
        <i className="bi bi-hourglass-split"></i> Coming Soon
      </>
    );
  };

  return (
    <div
      className={`game-card ${game.status}`}
      style={{ borderTopColor: game.color }}
      onClick={() => onClick(game)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(game);
        }
      }}
    >
      {game.status === 'coming-soon' && (
        <div className="coming-soon-badge">
          <i className="bi bi-clock"></i> Coming Soon
        </div>
      )}
      {game.status === 'locked' && (
        <div className="locked-badge">
          <i className="bi bi-lock"></i> Locked
        </div>
      )}

      <div className="game-icon" style={{ backgroundColor: game.color }}>
        {game.icon}
      </div>

      <div className="game-info">
        <h3>{game.title}</h3>
        <p>{game.description}</p>

        <div className="game-meta">
          <span className={`difficulty-badge ${game.difficulty}`}>
            <i className="bi bi-speedometer2"></i> {getDifficultyLabel()}
          </span>
          <span className="time-badge">
            <i className="bi bi-clock"></i> {game.estimatedTime}
          </span>
        </div>

        <button
          className={`play-btn ${game.status !== 'available' ? 'disabled' : ''}`}
          disabled={game.status !== 'available'}
          aria-label={`Play ${game.title}`}
        >
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
};


