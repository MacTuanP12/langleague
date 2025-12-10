import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Empty, Spin, Result } from 'antd';
import { LeftOutlined, RightOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { UserVocabularyDTO, UserGrammarDTO, reviewVocabulary, reviewGrammar } from 'app/shared/services/flashcard.service';
import './flashcard.scss';

const FlashcardSession: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { cards: initialCards, type } = location.state as { cards: (UserVocabularyDTO | UserGrammarDTO)[]; type: 'vocabulary' | 'grammar' };

  const [cards, setCards] = useState<(UserVocabularyDTO | UserGrammarDTO)[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  useEffect(() => {
    if (!initialCards || initialCards.length === 0) {
      setIsSessionFinished(true);
    }
  }, [initialCards]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const processReview = (isCorrect: boolean) => {
    if (isCorrect) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    const remainingCards = cards.filter((_, index) => index !== currentIndex);
    setCards(remainingCards);

    if (remainingCards.length === 0) {
      setIsSessionFinished(true);
    } else {
      // Move to the next card, ensuring index is valid
      setCurrentIndex(prevIndex => (prevIndex >= remainingCards.length ? remainingCards.length - 1 : prevIndex));
      setIsFlipped(false);
    }
  };

  const handleVocabularyReview = async (quality: number) => {
    const currentCard = cards[currentIndex] as UserVocabularyDTO;
    if (!currentCard) return;

    try {
      await dispatch(reviewVocabulary({ wordId: currentCard.word.id, quality })).unwrap();
      message.success(`Đã ghi nhận: ${quality >= 3 ? 'Đúng' : 'Sai'}`);
      processReview(quality >= 3);
    } catch (error) {
      console.error('Error updating vocabulary review:', error);
      message.error('Không thể ghi nhận kết quả ôn tập');
    }
  };

  const handleGrammarReview = async (isMemorized: boolean) => {
    const currentCard = cards[currentIndex] as UserGrammarDTO;
    if (!currentCard) return;

    try {
      await dispatch(reviewGrammar({ grammarId: currentCard.grammar.id, isMemorized })).unwrap();
      message.success(`Đã ghi nhận: ${isMemorized ? 'Đúng' : 'Sai'}`);
      processReview(isMemorized);
    } catch (error) {
      console.error('Error updating grammar review:', error);
      message.error('Không thể ghi nhận kết quả ôn tập');
    }
  };

  const renderCardContent = (card: UserVocabularyDTO | UserGrammarDTO, flipped: boolean) => {
    const isVocab = type === 'vocabulary';
    const item = isVocab ? (card as UserVocabularyDTO).word : (card as UserGrammarDTO).grammar;

    return (
      <div className="card-content">
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h1 className="card-word">{isVocab ? item.text : item.title}</h1>
            </div>
            <div className="flashcard-back">
              <h2 className="card-meaning">{isVocab ? item.meaning : item.description}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSessionFinished) {
    return (
      <Result
        icon={<CheckCircleOutlined />}
        status="success"
        title="Phiên ôn tập hoàn tất!"
        subTitle={`Bạn đã ôn tập ${initialCards.length} thẻ. Đúng: ${sessionStats.correct}, Sai: ${sessionStats.incorrect}.`}
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/flashcard')}>
            Quay về Dashboard
          </Button>,
          <Button key="buy" onClick={() => window.location.reload()}>
            Ôn tập lại
          </Button>,
        ]}
      />
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Empty description="Không có thẻ nào để ôn tập." />
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flashcard-session-container">
      <Card className="flashcard-card flashcard-interactive-card">
        <div className="card-counter">
          Thẻ {currentIndex + 1} / {cards.length}
        </div>
        {renderCardContent(currentCard, isFlipped)}
        <div className="flashcard-controls">
          <Space size="large">
            <Button icon={<LeftOutlined />} onClick={handlePrevious} size="large" disabled={currentIndex === 0}>
              Trước
            </Button>
            <Button icon={<SyncOutlined />} onClick={handleFlip} type="primary" size="large">
              Lật thẻ
            </Button>
            <Button icon={<RightOutlined />} onClick={handleNext} size="large" disabled={currentIndex === cards.length - 1}>
              Sau
            </Button>
          </Space>
        </div>
        {isFlipped && (
          <div className="review-controls">
            <h3>Bạn đã nhớ thẻ này chưa?</h3>
            {type === 'vocabulary' ? (
              <Space size="middle" wrap>
                <Button danger onClick={() => handleVocabularyReview(0)} size="large">
                  Chưa nhớ
                </Button>
                <Button type="primary" onClick={() => handleVocabularyReview(3)} size="large">
                  Đã nhớ
                </Button>
              </Space>
            ) : (
              <Space size="middle">
                <Button danger onClick={() => handleGrammarReview(false)} size="large">
                  Chưa nhớ
                </Button>
                <Button type="primary" onClick={() => handleGrammarReview(true)} size="large">
                  Đã nhớ
                </Button>
              </Space>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FlashcardSession;
