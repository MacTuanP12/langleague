import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './game-hub.scss';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: 'available' | 'coming-soon' | 'locked';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

const AVAILABLE_GAMES: GameCard[] = [
  {
    id: 'vocabulary-match',
    title: 'Vocabulary Match',
    description: 'Match words with their meanings in this fast-paced memory game',
    icon: '🎯',
    color: '#4A90E2',
    status: 'coming-soon',
    difficulty: 'easy',
    estimatedTime: '5-10 min',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form the correct vocabulary words',
    icon: '🔤',
    color: '#F5A623',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
  },
  {
    id: 'grammar-quest',
    title: 'Grammar Quest',
    description: 'Adventure through grammar challenges and unlock achievements',
    icon: '⚔️',
    color: '#7ED321',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '15-20 min',
  },
  {
    id: 'listening-challenge',
    title: 'Listening Challenge',
    description: 'Listen and identify the correct words in various contexts',
    icon: '🎧',
    color: '#BD10E0',
    status: 'coming-soon',
    difficulty: 'hard',
    estimatedTime: '10-15 min',
  },
  {
    id: 'speed-quiz',
    title: 'Speed Quiz',
    description: 'Answer as many questions as possible in limited time',
    icon: '⚡',
    color: '#FF6B6B',
    status: 'coming-soon',
    difficulty: 'hard',
    estimatedTime: '5 min',
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Build correct sentences from scrambled words and phrases',
    icon: '🏗️',
    color: '#50E3C2',
    status: 'coming-soon',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
  },
];

export const GameHub = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const navigate = useNavigate();

  const filteredGames =
    selectedDifficulty === 'all' ? AVAILABLE_GAMES : AVAILABLE_GAMES.filter(game => game.difficulty === selectedDifficulty);

  const handleGameClick = (game: GameCard) => {
    if (game.status === 'available') {
      navigate(`/student/games/${game.id}`);
    }
  };

  return (
    <div className="game-hub">
      <div className="game-hub-header">
        <button onClick={() => navigate('/student/dashboard')} className="back-btn">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <div className="header-content">
          <h1>
            <i className="bi bi-controller"></i> Learning Games
          </h1>
          <p>Make learning fun! Play games to improve your language skills</p>
        </div>
      </div>

      <div className="game-hub-content">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-label">
            <i className="bi bi-funnel"></i> Filter by difficulty:
          </div>
          <div className="difficulty-filters">
            <button className={`filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}`} onClick={() => setSelectedDifficulty('all')}>
              All Games
            </button>
            <button
              className={`filter-btn easy ${selectedDifficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('easy')}
            >
              <i className="bi bi-star"></i> Easy
            </button>
            <button
              className={`filter-btn medium ${selectedDifficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('medium')}
            >
              <i className="bi bi-star-fill"></i> Medium
            </button>
            <button
              className={`filter-btn hard ${selectedDifficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('hard')}
            >
              <i className="bi bi-fire"></i> Hard
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <i className="bi bi-trophy"></i>
            <div className="stat-content">
              <h3>0</h3>
              <p>Games Played</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="bi bi-star-fill"></i>
            <div className="stat-content">
              <h3>0</h3>
              <p>Total Score</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="bi bi-award"></i>
            <div className="stat-content">
              <h3>0</h3>
              <p>Achievements</p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-grid">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className={`game-card ${game.status}`}
              style={{ borderTopColor: game.color }}
              onClick={() => handleGameClick(game)}
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
                    <i className="bi bi-speedometer2"></i> {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </span>
                  <span className="time-badge">
                    <i className="bi bi-clock"></i> {game.estimatedTime}
                  </span>
                </div>

                <button className={`play-btn ${game.status !== 'available' ? 'disabled' : ''}`} disabled={game.status !== 'available'}>
                  {game.status === 'available' ? (
                    <>
                      <i className="bi bi-play-fill"></i> Play Now
                    </>
                  ) : (
                    <>
                      <i className="bi bi-hourglass-split"></i> Coming Soon
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="no-games">
            <i className="bi bi-controller"></i>
            <p>No games found for this difficulty level</p>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="coming-soon-notice">
          <i className="bi bi-info-circle"></i>
          <div className="notice-content">
            <h4>Games are under development</h4>
            <p>We&apos;re working hard to bring you exciting learning games. Check back soon for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;
