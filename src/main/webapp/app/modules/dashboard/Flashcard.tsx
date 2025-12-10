import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Row, Col, Statistic, message, Spin } from 'antd';
import { BookOutlined, FileTextOutlined, TrophyOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { 
  getVocabularyToReview, 
  getGrammarToReview, 
  getVocabularyStatistics, 
  getGrammarStatistics 
} from 'app/shared/services/flashcard.service';
import './flashcard.scss';

const FlashcardDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [vocabStats, setVocabStats] = useState(null);
  const [grammarStats, setGrammarStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [vocab, grammar] = await Promise.all([
        dispatch(getVocabularyStatistics()).unwrap(),
        dispatch(getGrammarStatistics()).unwrap(),
      ]);
      setVocabStats(vocab);
      setGrammarStats(grammar);
    } catch (error) {
      console.error('Error loading statistics:', error);
      message.error('Không thể tải thống kê flashcard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = async (type: 'vocabulary' | 'grammar') => {
    try {
      const action = type === 'vocabulary' ? getVocabularyToReview() : getGrammarToReview();
      const cards = await dispatch(action).unwrap();
      if (cards.length === 0) {
        message.info(`Bạn đã ôn tập hết tất cả ${type === 'vocabulary' ? 'từ vựng' : 'ngữ pháp'} cho hôm nay!`);
        return;
      }
      navigate('/flashcard/session', { state: { cards, type } });
    } catch (error) {
      message.error(`Không thể bắt đầu phiên ôn tập ${type === 'vocabulary' ? 'từ vựng' : 'ngữ pháp'}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
  }

  return (
    <div className="flashcard-container">
      <h1><BookOutlined /> Flashcard Dashboard</h1>
      
      <Row gutter={[16, 16]} className="statistics-section">
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Tổng từ vựng" value={vocabStats?.totalWords || 0} prefix={<BookOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Từ vựng đã thuộc" value={vocabStats?.memorizedWords || 0} prefix={<TrophyOutlined />} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Tổng ngữ pháp" value={grammarStats?.totalGrammars || 0} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Ngữ pháp đã thuộc" value={grammarStats?.memorizedGrammars || 0} prefix={<TrophyOutlined />} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="progress-section">
        <Col xs={24} md={12}>
          <Card title="Tiến trình từ vựng">
            <Progress percent={vocabStats?.totalWords ? Math.round((vocabStats.memorizedWords / vocabStats.totalWords) * 100) : 0} status="active" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tiến trình ngữ pháp">
            <Progress percent={grammarStats?.totalGrammars ? Math.round((grammarStats.memorizedGrammars / grammarStats.totalGrammars) * 100) : 0} status="active" />
          </Card>
        </Col>
      </Row>
      
      <Card className="review-starter-card">
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <h2>Bắt đầu phiên ôn tập của bạn</h2>
            <p>Chỉ tập trung vào những gì bạn cần học hôm nay.</p>
            <Statistic title="Thẻ cần ôn tập hôm nay" value={(vocabStats?.wordsToReview || 0) + (grammarStats?.grammarsToReview || 0)} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large">
              <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => handleStartReview('vocabulary')} disabled={(vocabStats?.wordsToReview || 0) === 0}>
                Ôn tập từ vựng ({vocabStats?.wordsToReview || 0})
              </Button>
              <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => handleStartReview('grammar')} disabled={(grammarStats?.grammarsToReview || 0) === 0}>
                Ôn tập ngữ pháp ({grammarStats?.grammarsToReview || 0})
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FlashcardDashboard;
