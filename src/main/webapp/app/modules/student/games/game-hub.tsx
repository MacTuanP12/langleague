import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { AVAILABLE_GAMES, DifficultyFilter, GameCard } from './game-hub.constants';
import { useGameFilters } from './hooks/useGameFilters';
import { GameCardComponent } from './components/GameCardComponent';
import { DifficultyFilterSection } from './components/DifficultyFilterSection';
import { GameStats } from './components/GameStats';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import '../student.scss';

/**
 * GameHub Component - Engaging game selection interface
 *
 * Features:
 * - Vibrant game cards with gradient backgrounds
 * - Difficulty filtering
 * - Game statistics display
 * - Responsive grid layout
 */
export const GameHub = () => {
  const [games, setGames] = useState(AVAILABLE_GAMES);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    achievements: 0,
  });
  const navigate = useNavigate();

  // Use custom hook for filtering with memoization
  const { filteredGames } = useGameFilters({ games, selectedDifficulty });

  const loadGames = useCallback(() => {
    setGames(AVAILABLE_GAMES);
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleGameClick = useCallback(
    (game: GameCard) => {
      if (game.status === 'available') {
        navigate(`/student/games/${game.id}`);
      }
    },
    [navigate],
  );

  const handleDifficultyChange = useCallback((difficulty: DifficultyFilter) => {
    setSelectedDifficulty(difficulty);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/student/dashboard');
  }, [navigate]);

  // Error state
  if (error) {
    return (
      <Container fluid className="student-page-container">
        <ErrorDisplay message={error} onRetry={loadGames} />
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container fluid className="student-page-container">
        <LoadingSpinner message="Loading games..." />
      </Container>
    );
  }

  return (
    <Container fluid className="student-page-container">
      {/* Header */}
      <div className="student-header mb-4">
        <div className="header-content">
          <Button onClick={handleBack} color="link" className="p-0 mb-2">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.games.backToDashboard">Back to Dashboard</Translate>
          </Button>
          <h1>
            <FontAwesomeIcon icon="gamepad" className="me-3" />
            <Translate contentKey="langleague.student.games.title">Games Hub</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.student.games.subtitle">Practice and have fun with interactive games</Translate>
          </p>
        </div>
      </div>

      {/* Game Statistics */}
      <GameStats gamesPlayed={gameStats.gamesPlayed} totalScore={gameStats.totalScore} achievements={gameStats.achievements} />

      {/* Difficulty Filter */}
      <DifficultyFilterSection selectedDifficulty={selectedDifficulty} onDifficultyChange={handleDifficultyChange} />

      {/* Games Grid */}
      <Row className="mt-4">
        {filteredGames.length === 0 ? (
          <Col>
            <div className="empty-state-student">
              <div className="empty-icon">
                <FontAwesomeIcon icon="gamepad" />
              </div>
              <h3>
                <Translate contentKey="langleague.student.games.noGames">No games available</Translate>
              </h3>
              <p>
                <Translate contentKey="langleague.student.games.noGamesDescription">Try adjusting your difficulty filter</Translate>
              </p>
            </div>
          </Col>
        ) : (
          filteredGames.map(game => (
            <Col key={game.id} lg="4" md="6" className="mb-4">
              <GameCardComponent game={game} onClick={() => handleGameClick(game)} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default GameHub;
