import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { AVAILABLE_GAMES, DifficultyFilter, GameCard } from './constants/game-hub.constants';
import { useGameFilters } from './hooks/useGameFilters';
import { GameCardComponent } from './components/GameCardComponent';
import { DifficultyFilterSection } from './components/DifficultyFilterSection';
import { DataSourceSelector } from './components/DataSourceSelector';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { VocabularyMatch } from './vocabulary-match';
import { WordScramble } from './word-scramble';
import { SpeedQuiz } from './speed-quiz';
import { BridgeGame } from './BridgeGameRunner';
import './game-hub.scss';

type ActiveGame = 'vocabulary-match' | 'word-scramble' | 'speed-quiz' | 'bridge-game' | null;

/**
 * GameHub Component - Engaging game selection interface with integrated mini-games
 *
 * Features:
 * - Vibrant game cards with gradient backgrounds
 * - Difficulty filtering
 * - Responsive grid layout
 * - 4 Active mini-games: Vocabulary Match, Word Scramble, Speed Quiz, Bridge Game
 * - Coming soon placeholders
 */
export const GameHub = () => {
  const [games, setGames] = useState(AVAILABLE_GAMES);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [pendingGame, setPendingGame] = useState<ActiveGame>(null);
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false);
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const unitId = useMemo(() => (searchParams.get('unitId') ? parseInt(searchParams.get('unitId'), 10) : undefined), [searchParams]);

  // Use custom hook for filtering with memoization
  const { filteredGames } = useGameFilters({ games, selectedDifficulty, searchQuery });

  const loadGames = useCallback(() => {
    setGames(AVAILABLE_GAMES);
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // If unitId is present in URL, we can skip the selector if user clicks a game
  // But for now, let's keep it simple. If unitId is there, we use it.
  useEffect(() => {
    if (unitId) {
      setSelectedUnitIds([unitId]);
    }
  }, [unitId]);

  const handleGameClick = useCallback(
    (game: GameCard) => {
      if (game.status === 'available') {
        const gameId = game.id as ActiveGame;

        // If we already have a unit selected (from URL), start immediately
        if (unitId) {
          setActiveGame(gameId);
          return;
        }

        // Otherwise, show the data source selector
        setPendingGame(gameId);
        setShowDataSourceSelector(true);
      }
    },
    [unitId],
  );

  const handleStartGame = useCallback(
    (unitIds: number[]) => {
      setSelectedUnitIds(unitIds);
      setActiveGame(pendingGame);
      setPendingGame(null);
    },
    [pendingGame],
  );

  const handleBackToMenu = useCallback(() => {
    setActiveGame(null);
    // If we came from a specific unit, maybe we want to go back to that unit?
    // For now, just stay in GameHub
  }, []);

  const handleDifficultyChange = useCallback((difficulty: DifficultyFilter) => {
    setSelectedDifficulty(difficulty);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/student/dashboard');
  }, [navigate]);

  // Render active game
  if (activeGame === 'vocabulary-match') {
    return <VocabularyMatch unitIds={selectedUnitIds} onBack={handleBackToMenu} />;
  }

  if (activeGame === 'word-scramble') {
    return <WordScramble unitIds={selectedUnitIds} onBack={handleBackToMenu} />;
  }

  if (activeGame === 'speed-quiz') {
    return <SpeedQuiz unitIds={selectedUnitIds} onBack={handleBackToMenu} />;
  }

  if (activeGame === 'bridge-game') {
    return <BridgeGame unitIds={selectedUnitIds} onBack={handleBackToMenu} />;
  }

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
        <LoadingSpinner message="langleague.student.games.loading" isI18nKey />
      </Container>
    );
  }

  return (
    <Container fluid className="student-page-container game-hub-container">
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

      {/* Difficulty Filter */}
      <DifficultyFilterSection
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={handleDifficultyChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

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

      <DataSourceSelector
        isOpen={showDataSourceSelector}
        toggle={() => setShowDataSourceSelector(!showDataSourceSelector)}
        onStartGame={handleStartGame}
      />
    </Container>
  );
};

export default GameHub;
