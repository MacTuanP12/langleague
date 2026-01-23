import React, { memo } from 'react';
import { translate } from 'react-jhipster';
import { GameCard as IGameCard } from '../constants/game-hub.constants';
import { Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import SafeIcon from 'app/shared/components/SafeIcon';

interface GameCardProps {
  game: IGameCard;
  onClick: (game: IGameCard) => void;
}

/**
 * Helper function to detect if a string is an emoji or special character
 * rather than a FontAwesome icon name
 */
const isEmoji = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;

  // Check if string contains emoji characters (Unicode ranges for common emojis)
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

  // Also check if it's a multi-character string (emojis are often multi-byte)
  // or contains non-ASCII characters that aren't typical FontAwesome icon names
  // eslint-disable-next-line no-control-regex
  return emojiRegex.test(str) || (str.length <= 3 && /[^\x00-\x7F]/.test(str));
};

/**
 * GameCard component - Extracted from GameHub for better modularity
 * Handles both emoji and FontAwesome icons safely
 * Memoized to prevent unnecessary re-renders
 */
export const GameCardComponent: React.FC<GameCardProps> = memo(({ game, onClick }) => {
  const getDifficultyLabel = () => {
    return game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
  };

  /**
   * Render the game icon - handles both emoji and FontAwesome icons
   */
  const renderGameIcon = () => {
    if (!game.icon) {
      return <span className="text-muted">❓</span>;
    }

    // If it's an emoji, render as plain text
    if (isEmoji(game.icon)) {
      return (
        <span className="game-icon-emoji" style={{ fontSize: '3rem' }}>
          {game.icon}
        </span>
      );
    }

    // Otherwise, treat as FontAwesome icon
    return <SafeIcon icon={game.icon as IconProp} size="3x" />;
  };

  return (
    <Card
      className={`game-card h-100 ${game.status !== 'available' ? 'disabled' : ''}`}
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
      <div className="card-img-top" style={{ backgroundColor: game.color }}>
        {renderGameIcon()}
      </div>
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CardTitle tag="h5" className="mb-0">
            {translate(game.titleKey, game.title)}
          </CardTitle>
          {game.status === 'available' ? (
            <Badge color="success" pill>
              {translate('langleague.student.games.active')}
            </Badge>
          ) : (
            <Badge color="secondary" pill>
              {translate('langleague.student.games.comingSoon')}
            </Badge>
          )}
        </div>
        <CardText className="text-muted flex-grow-1">{translate(game.descriptionKey, game.description)}</CardText>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Badge color="info" className="me-2">
            {getDifficultyLabel()}
          </Badge>
          <small className="text-muted">
            <SafeIcon icon={'clock' as IconProp} className="me-1" />
            {translate(game.estimatedTimeKey, game.estimatedTime)}
          </small>
        </div>
      </CardBody>
    </Card>
  );
});

GameCardComponent.displayName = 'GameCardComponent';
