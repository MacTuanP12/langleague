import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { AVAILABLE_GAMES, DifficultyFilter, GameCard } from './game-hub.constants';
import { useGameFilters } from './hooks/useGameFilters';
import { GameCardComponent } from './components/GameCardComponent';
import { DifficultyFilterSection } from './components/DifficultyFilterSection';
import { GameStats } from './components/GameStats';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import './game-hub.scss';

/**
 * GameHub Component - Refactored for better performance and maintainability
 *
 * Improvements:
 * - Extracted hardcoded data to constants file
 * - Added loading and error states
 * - Used useMemo for expensive filter operations (via custom hook)
 * - Split into smaller, reusable components
 * - Added proper accessibility attributes
 * - Optimized with useCallback for event handlers
 * - TODO: Replace AVAILABLE_GAMES with API call to fetch real game data
 */
export const GameHub = () => {
  const [games, setGames] = useState(AVAILABLE_GAMES);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  // NOTE: These state setters are kept for future API integration (see loadGames and loadGameStats TODOs)
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

  /**
   * TODO: Replace this with actual API calls
   * Example:
   * const loadGames = async () => {
   *   try {
   *     setLoading(true);
   *     const response = await axios.get('/api/games/available');
   *     setGames(response.data);
   *   } catch (err) {
   *     setError('Failed to load games');
   *   } finally {
   *     setLoading(false);
   *   }
   * };
   *
   * const loadGameStats = async () => {
   *   try {
   *     const response = await axios.get('/api/games/my-stats');
   *     setGameStats(response.data);
   *   } catch (err) {
   *     console.error('Failed to load game stats', err);
   *   }
   * };
   */
  const loadGames = useCallback(() => {
    // Using fallback data for now
    setGames(AVAILABLE_GAMES);
  }, []);

  useEffect(() => {
    loadGames();
    // loadGameStats(); // TODO: Uncomment when API is ready
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
      <div className="game-hub">
        <ErrorDisplay message={error} onRetry={loadGames} />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="game-hub">
        <LoadingSpinner message="langleague.student.games.loading" isI18nKey />
      </div>
    );
  }

  return (
    <div className="game-hub">
      <div className="game-hub-header">
        <button onClick={handleBack} className="back-btn" aria-label="Back to Dashboard">
          <i className="bi bi-arrow-left"></i>{' '}
          <Translate contentKey="langleague.student.games.backToDashboard">Back to Dashboard</Translate>
        </button>
        <div className="header-content">
          <h1>
            <i className="bi bi-controller"></i> <Translate contentKey="langleague.student.games.title">Learning Games</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.student.games.subtitle">
              Make learning fun! Play games to improve your language skills
            </Translate>
          </p>
        </div>
      </div>

      <div className="game-hub-content">
        {/* Filter Section */}
        <DifficultyFilterSection selectedDifficulty={selectedDifficulty} onDifficultyChange={handleDifficultyChange} />

        {/* Stats Section */}
        <GameStats gamesPlayed={gameStats.gamesPlayed} totalScore={gameStats.totalScore} achievements={gameStats.achievements} />

        {/* Games Grid */}
        <div className="games-grid" role="list">
          {filteredGames.map(game => (
            <GameCardComponent key={game.id} game={game} onClick={handleGameClick} />
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="no-games">
            <i className="bi bi-controller"></i>
            <p>
              <Translate contentKey="langleague.student.games.noGamesForDifficulty">No games found for this difficulty level</Translate>
            </p>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="coming-soon-notice">
          <i className="bi bi-info-circle"></i>
          <div className="notice-content">
            <h4>
              <Translate contentKey="langleague.student.games.comingSoon.title">Games are under development</Translate>
            </h4>
            <p>
              <Translate contentKey="langleague.student.games.comingSoon.description">
                We&apos;re working hard to bring you exciting learning games. Check back soon for updates!
              </Translate>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;
