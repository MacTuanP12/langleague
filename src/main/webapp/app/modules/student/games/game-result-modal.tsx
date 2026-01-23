import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Progress } from 'reactstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Translate } from 'react-jhipster';
import SafeIcon from 'app/shared/components/SafeIcon';
import './game-result-modal.scss';

interface GameResultModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  timeTaken?: number; // in seconds
  onRetry: () => void;
  onExit: () => void;
}

/**
 * Performance configuration type for type-safe icon handling
 */
interface PerformanceConfig {
  icon: IconProp;
  color: string;
  stars: number;
}

/**
 * Shared result modal for all games
 * Shows score, performance rating, and action buttons
 */
export const GameResultModal: React.FC<GameResultModalProps> = ({ isOpen, score, total, timeTaken, onRetry, onExit }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Determine performance level
  const getPerformanceLevel = (): 'excellent' | 'good' | 'fair' | 'needsImprovement' => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'fair';
    return 'needsImprovement';
  };

  const performanceLevel = getPerformanceLevel();

  /**
   * Get appropriate icon and color based on performance
   * Returns properly typed IconProp to prevent "Could not find icon Object" errors
   */
  const getPerformanceIcon = (): PerformanceConfig => {
    switch (performanceLevel) {
      case 'excellent':
        return { icon: 'trophy' as IconProp, color: '#FFD700', stars: 3 };
      case 'good':
        return { icon: 'star' as IconProp, color: '#4A90E2', stars: 2 };
      case 'fair':
        return { icon: 'thumbs-up' as IconProp, color: '#F5A623', stars: 1 };
      default:
        return { icon: 'redo' as IconProp, color: '#95a5a6', stars: 0 };
    }
  };

  const { icon, color, stars } = getPerformanceIcon();

  // Get progress bar color
  const getProgressColor = (): string => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'info';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Modal isOpen={isOpen} centered className="game-result-modal" backdrop="static">
      <ModalHeader className="border-0 pb-0">
        <div className="w-100 text-center">
          <div className="performance-icon mb-3" style={{ color }}>
            <SafeIcon icon={icon} size="4x" />
          </div>
          <h3>
            <Translate contentKey={`langleague.student.games.result.${performanceLevel}.title`}>
              {performanceLevel === 'excellent' && 'Excellent!'}
              {performanceLevel === 'good' && 'Great Job!'}
              {performanceLevel === 'fair' && 'Good Effort!'}
              {performanceLevel === 'needsImprovement' && 'Try Again!'}
            </Translate>
          </h3>
        </div>
      </ModalHeader>

      <ModalBody className="text-center">
        {/* Stars display */}
        {stars > 0 && (
          <div className="stars-display mb-3">
            {[...Array(3)].map((_, index) => (
              <SafeIcon key={index} icon={'star' as IconProp} className={index < stars ? 'star-filled' : 'star-empty'} size="2x" />
            ))}
          </div>
        )}

        {/* Score display */}
        <div className="score-display mb-3">
          <h1 className="display-4 mb-0">
            {score} / {total}
          </h1>
          <p className="text-muted">
            <Translate contentKey="langleague.student.games.result.correctAnswers">Correct Answers</Translate>
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <Progress value={percentage} color={getProgressColor()} className="mb-2" style={{ height: '20px' }}>
            <span className="fw-bold">{percentage}%</span>
          </Progress>
        </div>

        {/* Time taken (if provided) */}
        {timeTaken !== undefined && (
          <div className="time-display mb-3">
            <SafeIcon icon={'clock' as IconProp} className="me-2" />
            <span>
              <Translate contentKey="langleague.student.games.result.timeTaken">Time taken</Translate>:{' '}
              <strong>{formatTime(timeTaken)}</strong>
            </span>
          </div>
        )}

        {/* Motivational message */}
        <p className="text-muted mt-3">
          <Translate contentKey={`langleague.student.games.result.${performanceLevel}.message`}>
            {performanceLevel === 'excellent' && 'Outstanding performance! You have mastered this content!'}
            {performanceLevel === 'good' && 'Well done! Keep up the good work!'}
            {performanceLevel === 'fair' && 'Not bad! A bit more practice and you will do great!'}
            {performanceLevel === 'needsImprovement' && 'Do not give up! Practice makes perfect!'}
          </Translate>
        </p>
      </ModalBody>

      <ModalFooter className="border-0 justify-content-center">
        <Button color="secondary" onClick={onExit} outline>
          <SafeIcon icon={'arrow-left' as IconProp} className="me-2" />
          <Translate contentKey="langleague.student.games.result.backToMenu">Back to Menu</Translate>
        </Button>
        <Button color="primary" onClick={onRetry}>
          <SafeIcon icon={'redo' as IconProp} className="me-2" />
          <Translate contentKey="langleague.student.games.result.playAgain">Play Again</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GameResultModal;
