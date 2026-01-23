import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Card, CardBody, Container, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useGameData } from './hooks/useGameData';
import { GameResultModal } from './game-result-modal';
import { LoadingSpinner } from 'app/shared/components';
import './vocabulary-match.scss';

interface MatchCard {
  id: string;
  content: string;
  type: 'word' | 'meaning';
  vocabularyId: number;
  matched: boolean;
}

interface VocabularyMatchProps {
  unitId?: number;
  unitIds?: number[];
  onBack: () => void;
}

// Limit pairs per round to prevent UI clutter
const MAX_PAIRS_PER_ROUND = 12;

export const VocabularyMatch: React.FC<VocabularyMatchProps> = ({ unitId, unitIds, onBack }) => {
  const idsToUse = useMemo(() => (unitIds && unitIds.length > 0 ? unitIds : unitId), [unitIds, unitId]);
  const { vocabularies, loading, error } = useGameData(idsToUse, !idsToUse);

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [shakingCard, setShakingCard] = useState<string | null>(null);
  const [currentRoundVocabs, setCurrentRoundVocabs] = useState<number>(0);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const initializeGame = useCallback(() => {
    if (vocabularies.length === 0) return;

    // 1. Shuffle the full pool of vocabularies
    const shuffledPool = [...vocabularies].sort(() => Math.random() - 0.5);

    // 2. Slice to get a manageable subset for this round
    const selectedVocabs = shuffledPool.slice(0, MAX_PAIRS_PER_ROUND);
    setCurrentRoundVocabs(selectedVocabs.length);

    const gameCards: MatchCard[] = [];

    // 3. Create cards only for the selected subset
    selectedVocabs.forEach(vocab => {
      gameCards.push({
        id: `word-${vocab.id}`,
        content: vocab.word,
        type: 'word',
        vocabularyId: vocab.id,
        matched: false,
      });
      gameCards.push({
        id: `meaning-${vocab.id}`,
        content: vocab.meaning,
        type: 'meaning',
        vocabularyId: vocab.id,
        matched: false,
      });
    });

    // 4. Shuffle the cards on the board
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs(0);
    setAttempts(0);
    setShowResult(false);
    setGameStartTime(Date.now());
  }, [vocabularies]);

  useEffect(() => {
    if (vocabularies.length > 0) {
      initializeGame();
    }
  }, [vocabularies, initializeGame]);

  const handleCardClick = useCallback(
    (card: MatchCard) => {
      if (card.matched || selectedCards.find(c => c.id === card.id)) {
        return;
      }

      const newSelected = [...selectedCards, card];
      setSelectedCards(newSelected);

      if (newSelected.length === 2) {
        setAttempts(prev => prev + 1);
        const [first, second] = newSelected;

        if (first.vocabularyId === second.vocabularyId && first.type !== second.type) {
          setTimeout(() => {
            if (isMountedRef.current) {
              setCards(prevCards => prevCards.map(c => (c.vocabularyId === first.vocabularyId ? { ...c, matched: true } : c)));
              setMatchedPairs(prev => prev + 1);
              setSelectedCards([]);
            }
          }, 500);
        } else {
          setShakingCard(first.id);
          setTimeout(() => {
            if (isMountedRef.current) setShakingCard(second.id);
          }, 100);

          setTimeout(() => {
            if (isMountedRef.current) {
              setSelectedCards([]);
              setShakingCard(null);
            }
          }, 1000);
        }
      }
    },
    [selectedCards],
  );

  // Check for win condition
  useEffect(() => {
    if (currentRoundVocabs > 0 && matchedPairs === currentRoundVocabs) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [matchedPairs, currentRoundVocabs]);

  const getCardClass = useCallback(
    (card: MatchCard) => {
      const classes = ['match-card'];
      if (card.matched) classes.push('matched');
      else if (selectedCards.find(c => c.id === card.id)) classes.push('selected');
      if (shakingCard === card.id) classes.push('shake');
      classes.push(card.type === 'word' ? 'word-card' : 'meaning-card');
      return classes.join(' ');
    },
    [selectedCards, shakingCard],
  );

  const handleRetry = useCallback(() => {
    setShowResult(false);
    initializeGame(); // This will pick a NEW random set of words
  }, [initializeGame]);

  const handleExit = useCallback(() => {
    onBack();
  }, [onBack]);

  const getTimeTaken = useCallback(() => {
    return Math.floor((Date.now() - gameStartTime) / 1000);
  }, [gameStartTime]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <LoadingSpinner message="langleague.student.games.loading" isI18nKey />
      </Container>
    );
  }

  if (error && vocabularies.length === 0) {
    return (
      <Container className="py-5">
        <Alert color="danger">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          {error}
        </Alert>
        <Button color="secondary" onClick={onBack}>
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="vocabulary-match-game">
      <div className="game-header mb-4">
        <Button color="link" onClick={onBack} className="back-button">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
        <h2 className="text-center mb-2">
          🎯 <Translate contentKey="langleague.student.games.vocabularyMatch.title">Vocabulary Match</Translate>
        </h2>
        <p className="text-center text-muted">
          <Translate contentKey="langleague.student.games.vocabularyMatch.instructions">
            Click on a word and then click on its matching meaning
          </Translate>
        </p>
      </div>

      <Row className="game-stats mb-4">
        <Col xs="4" className="text-center">
          <div className="stat-card">
            <div className="stat-value">
              {matchedPairs} / {currentRoundVocabs}
            </div>
            <div className="stat-label">
              <Translate contentKey="langleague.student.games.vocabularyMatch.matched">Matched</Translate>
            </div>
          </div>
        </Col>
        <Col xs="4" className="text-center">
          <div className="stat-card">
            <div className="stat-value">{vocabularies.length}</div>
            <div className="stat-label">
              <Translate contentKey="langleague.student.games.vocabularyMatch.total">Pool Size</Translate>
            </div>
          </div>
        </Col>
        <Col xs="4" className="text-center">
          <div className="stat-card">
            <div className="stat-value">{attempts}</div>
            <div className="stat-label">
              <Translate contentKey="langleague.student.games.vocabularyMatch.attempts">Attempts</Translate>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="cards-grid">
        {cards.map(card => (
          <Col key={card.id} xs="6" sm="4" md="3" lg="2" className="mb-3">
            <Card className={getCardClass(card)} onClick={() => handleCardClick(card)}>
              <CardBody className="text-center">
                <div className="card-content">{card.content}</div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <GameResultModal
        isOpen={showResult}
        score={matchedPairs}
        total={currentRoundVocabs}
        timeTaken={getTimeTaken()}
        onRetry={handleRetry}
        onExit={handleExit}
      />
    </Container>
  );
};

export default VocabularyMatch;
