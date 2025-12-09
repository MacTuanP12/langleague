import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Tabs, Row, Col, Statistic, Space, Tag, message, Empty, Spin } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  SyncOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BulkVocabularyAdd from './BulkVocabularyAdd';
import {
  UserVocabularyDTO,
  UserGrammarDTO,
  VocabularyStatistics,
  GrammarStatistics,
  getMyVocabulary,
  getVocabularyToReview,
  getVocabularyStatistics,
  reviewVocabulary,
  unsaveVocabulary,
  getMyGrammar,
  getGrammarToReview,
  getGrammarStatistics,
  reviewGrammar,
  unsaveGrammar,
} from 'app/shared/services/flashcard.service';
import './flashcard.scss';
import { useAppDispatch } from 'app/config/store';

const Flashcard: React.FC = () => {
  const { t } = useTranslation(['flashcards', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar'>('vocabulary');
  const [vocabularyCards, setVocabularyCards] = useState<UserVocabularyDTO[]>([]);
  const [grammarCards, setGrammarCards] = useState<UserGrammarDTO[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabStatistics, setVocabStatistics] = useState<VocabularyStatistics | null>(null);
  const [grammarStatistics, setGrammarStatistics] = useState<GrammarStatistics | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bulkAddVisible, setBulkAddVisible] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [reviewMode]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadVocabularyCards(), loadGrammarCards(), loadStatistics()]);
    } catch (error) {
      console.error('Error loading flashcard data:', error);
      // Individual functions already handle their own errors
    } finally {
      setLoading(false);
    }
  };

  // Load vocabulary flashcards
  const loadVocabularyCards = async () => {
    try {
      const action = reviewMode ? getVocabularyToReview() : getMyVocabulary();
      const cards = await dispatch(action).unwrap();
      console.log('📚 Loaded vocabulary cards:', cards);
      if (cards.length > 0) {
        console.log('📊 First card:', cards[0]);
      }
      setVocabularyCards(cards);
      if (activeTab === 'vocabulary') {
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('❌ Error loading vocabulary:', error);
      message.error(t('common.error') || 'Không thể tải từ vựng');
    }
  };

  // Load grammar flashcards
  const loadGrammarCards = async () => {
    try {
      const action = reviewMode ? getGrammarToReview() : getMyGrammar();
      const cards = await dispatch(action).unwrap();
      console.log('📚 Loaded grammar cards:', cards);
      if (cards.length > 0) {
        console.log('📊 First card:', cards[0]);
      }
      setGrammarCards(cards);
      if (activeTab === 'grammar') {
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('❌ Error loading grammar cards:', error);
      message.error(t('common.error') || 'Không thể tải ngữ pháp');
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const [vocabStats, grammarStats] = await Promise.all([
        dispatch(getVocabularyStatistics()).unwrap(),
        dispatch(getGrammarStatistics()).unwrap(),
      ]);
      setVocabStatistics(vocabStats);
      setGrammarStatistics(grammarStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      message.error(t('common.error') || 'Không thể tải thống kê');
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    const cards = activeTab === 'vocabulary' ? vocabularyCards : grammarCards;
    setCurrentIndex((currentIndex + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    const cards = activeTab === 'vocabulary' ? vocabularyCards : grammarCards;
    setCurrentIndex((currentIndex - 1 + cards.length) % cards.length);
  };

  const handleVocabularyReview = async (quality: number) => {
    const currentCard = vocabularyCards[currentIndex];
    if (!currentCard) return;

    try {
      await dispatch(reviewVocabulary({ wordId: currentCard.word.id, quality })).unwrap();
      message.success('Đã ghi nhận kết quả ôn tập!');
      handleNext();
      await loadStatistics();
      if (reviewMode) {
        await loadVocabularyCards();
      }
    } catch (error) {
      console.error('Error updating vocabulary review:', error);
      message.error(t('common.error') || 'Không thể ghi nhận kết quả ôn tập');
    }
  };

  const handleGrammarReview = async (isMemorized: boolean) => {
    const currentCard = grammarCards[currentIndex];
    if (!currentCard) return;

    try {
      await dispatch(reviewGrammar({ grammarId: currentCard.grammar.id, isMemorized })).unwrap();
      message.success('Đã ghi nhận kết quả ôn tập!');
      handleNext();
      await loadStatistics();
      if (reviewMode) {
        await loadGrammarCards();
      }
    } catch (error) {
      console.error('Error updating grammar review:', error);
      message.error(t('common.error') || 'Không thể ghi nhận kết quả ôn tập');
    }
  };

  const handleRemove = async () => {
    const cards = activeTab === 'vocabulary' ? vocabularyCards : grammarCards;
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      if (activeTab === 'vocabulary') {
        await dispatch(unsaveVocabulary((currentCard as UserVocabularyDTO).word.id)).unwrap();
        message.success('Đã xóa từ vựng khỏi flashcard');
        await loadVocabularyCards();
      } else {
        await dispatch(unsaveGrammar((currentCard as UserGrammarDTO).grammar.id)).unwrap();
        message.success('Đã xóa ngữ pháp khỏi flashcard');
        await loadGrammarCards();
      }
      await loadStatistics();
    } catch (error) {
      console.error('Error removing card:', error);
      message.error('Không thể xóa thẻ');
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'vocabulary' | 'grammar');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCards = activeTab === 'vocabulary' ? vocabularyCards : grammarCards;
  const currentCard = currentCards[currentIndex];

  const renderVocabularyCard = (card: UserVocabularyDTO, flipped: boolean) => {
    console.log('🎴 Rendering vocabulary card:', { card, flipped, text: card.word.text, meaning: card.word.meaning });

    if (!flipped) {
      // Front side - Korean Word
      return (
        <div className="card-content">
          <h1 className="card-word">{card.word.text || '(No text)'}</h1>
          {card.word.pronunciation && <p className="card-pronunciation">[{card.word.pronunciation}]</p>}
          {card.word.partOfSpeech && (
            <Tag color="blue" style={{ marginTop: 8 }}>
              {card.word.partOfSpeech}
            </Tag>
          )}
          <Tag color={card.isMemorized ? 'success' : 'warning'} className="card-tag">
            {card.isMemorized ? 'Đã thuộc' : 'Đang học'}
          </Tag>
          {card.reviewCount !== undefined && <p className="card-meta">Số lần ôn tập: {card.reviewCount}</p>}
        </div>
      );
    } else {
      // Back side - Meaning and Examples
      return (
        <div className="card-content">
          <h2 className="card-meaning">{card.word.meaning || '(Chưa có nghĩa)'}</h2>
          {card.word.imageUrl && (
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <img src={card.word.imageUrl} alt={card.word.text} style={{ maxWidth: '300px', borderRadius: '8px' }} />
            </div>
          )}
          {card.word.wordExamples && card.word.wordExamples.length > 0 ? (
            <div className="card-examples">
              {card.word.wordExamples.map((example, idx) => (
                <div key={idx} className="example-item">
                  <p className="example-sentence">
                    <strong>Ví dụ:</strong> {example.exampleText}
                  </p>
                  <p className="example-translation">{example.translation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic', marginTop: '16px' }}>(Chưa có ví dụ)</p>
          )}
        </div>
      );
    }
  };

  const renderGrammarCard = (card: UserGrammarDTO, flipped: boolean) => {
    console.log('🎴 Rendering grammar card:', { card, flipped, description: card.grammar.description });

    if (!flipped) {
      // Front side - Grammar Title (Korean)
      return (
        <div className="card-content">
          <h1 className="card-word">{card.grammar.title}</h1>
          {card.grammar.level && (
            <Tag color="purple" style={{ marginTop: 8 }}>
              {card.grammar.level}
            </Tag>
          )}
          <Tag color={card.isMemorized ? 'success' : 'warning'} className="card-tag">
            {card.isMemorized ? 'Đã thuộc' : 'Đang học'}
          </Tag>
          {card.reviewCount !== undefined && <p className="card-meta">Số lần ôn tập: {card.reviewCount}</p>}
        </div>
      );
    } else {
      // Back side - Description (explanation + examples)
      return (
        <div className="card-content">
          <div className="grammar-section">
            <h3>Giải thích và ví dụ:</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', padding: '10px 0' }}>
              {card.grammar.description || '(Chưa có mô tả cho điểm ngữ pháp này)'}
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <h1>
        <BookOutlined /> {t('flashcard.title')}
      </h1>

      {/* Statistics Section */}
      <Row gutter={16} className="statistics-section">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title={t('flashcard.totalCards')} value={vocabStatistics?.totalWords || 0} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('flashcard.mastered')}
              value={vocabStatistics?.memorizedWords || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title={t('learning.grammar')} value={grammarStatistics?.totalGrammars || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('flashcard.review')}
              value={(vocabStatistics?.wordsToReview || 0) + (grammarStatistics?.grammarsToReview || 0)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Bars */}
      <Row gutter={16} className="progress-section">
        <Col xs={24} md={12}>
          <Card title="Vocabulary Progress">
            <Progress
              percent={
                vocabStatistics?.totalWords ? Math.round(((vocabStatistics?.memorizedWords || 0) / vocabStatistics.totalWords) * 100) : 0
              }
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Grammar Progress">
            <Progress
              percent={
                grammarStatistics?.totalGrammars
                  ? Math.round(((grammarStatistics?.memorizedGrammars || 0) / grammarStatistics.totalGrammars) * 100)
                  : 0
              }
              status="active"
            />
          </Card>
        </Col>
      </Row>

      {/* Mode Toggle */}
      <div className="mode-toggle" style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          type={reviewMode ? 'primary' : 'default'}
          size="large"
          onClick={() => setReviewMode(!reviewMode)}
          icon={<ClockCircleOutlined />}
        >
          {reviewMode ? 'Review Mode (Due Today)' : 'Study Mode (All Cards)'}
        </Button>
        <Button type="primary" size="large" onClick={() => setBulkAddVisible(true)} icon={<PlusOutlined />}>
          Add to Flashcard (Bulk)
        </Button>
      </div>

      {/* Flashcard Tabs */}
      <Card className="flashcard-card">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          items={[
            {
              key: 'vocabulary',
              label: (
                <span>
                  <BookOutlined />
                  Vocabulary ({vocabularyCards.length})
                </span>
              ),
            },
            {
              key: 'grammar',
              label: (
                <span>
                  <FileTextOutlined />
                  Grammar ({grammarCards.length})
                </span>
              ),
            },
          ]}
        />

        {currentCards.length > 0 ? (
          <div className="flashcard-wrapper">
            {/* Card Counter */}
            <div className="card-counter">
              Card {currentIndex + 1} / {currentCards.length}
            </div>

            {/* Flashcard */}
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  {activeTab === 'vocabulary'
                    ? renderVocabularyCard(currentCard as UserVocabularyDTO, false)
                    : renderGrammarCard(currentCard as UserGrammarDTO, false)}
                </div>
                <div className="flashcard-back">
                  {activeTab === 'vocabulary'
                    ? renderVocabularyCard(currentCard as UserVocabularyDTO, true)
                    : renderGrammarCard(currentCard as UserGrammarDTO, true)}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flashcard-controls">
              <Space size="large">
                <Button icon={<LeftOutlined />} onClick={handlePrevious} size="large">
                  Previous
                </Button>
                <Button icon={<SyncOutlined />} onClick={handleFlip} type="primary" size="large">
                  Flip Card
                </Button>
                <Button icon={<RightOutlined />} onClick={handleNext} size="large">
                  Next
                </Button>
              </Space>
            </div>

            {/* Review Controls (SRS) */}
            {reviewMode && isFlipped && (
              <div className="review-controls">
                <h3>How well did you know this?</h3>
                {activeTab === 'vocabulary' ? (
                  <Space size="middle" wrap>
                    <Button danger onClick={() => handleVocabularyReview(0)} size="large">
                      Again (0)
                    </Button>
                    <Button style={{ backgroundColor: '#ff7875' }} onClick={() => handleVocabularyReview(2)} size="large">
                      Hard (2)
                    </Button>
                    <Button type="primary" onClick={() => handleVocabularyReview(3)} size="large">
                      Good (3)
                    </Button>
                    <Button
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                      onClick={() => handleVocabularyReview(5)}
                      size="large"
                    >
                      Easy (5)
                    </Button>
                  </Space>
                ) : (
                  <Space size="middle">
                    <Button danger onClick={() => handleGrammarReview(false)} size="large">
                      Not Memorized
                    </Button>
                    <Button
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                      onClick={() => handleGrammarReview(true)}
                      size="large"
                    >
                      Memorized
                    </Button>
                  </Space>
                )}
              </div>
            )}

            {/* Additional Actions */}
            <div className="additional-actions">
              <Button danger icon={<DeleteOutlined />} onClick={handleRemove}>
                Remove from Flashcards
              </Button>
            </div>
          </div>
        ) : (
          <Empty
            description={
              reviewMode
                ? 'No cards to review today! Great job!'
                : `No ${activeTab} cards available. Add some from your learning materials!`
            }
            style={{ padding: '60px 0' }}
          />
        )}
      </Card>

      {/* Bulk Add Vocabulary Modal */}
      <BulkVocabularyAdd
        visible={bulkAddVisible}
        onClose={() => setBulkAddVisible(false)}
        onSuccess={() => {
          loadAllData();
          message.success('Đã thêm từ vựng thành công!');
        }}
      />
    </div>
  );
};

export default Flashcard;
