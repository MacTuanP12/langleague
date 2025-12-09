import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Input, Select, Tabs, List, Avatar, Spin } from 'antd';
import { SoundOutlined, StarOutlined, StarFilled, SearchOutlined, BookOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { getWordsByChapter } from '../../shared/services/word.service';
import { IWord } from '../../shared/model/models';

const { Title, Text } = Typography;

interface Vocabulary {
  id?: number;
  text: string;
  meaning?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  imageUrl?: string;
  chapterId?: number;
  orderIndex?: number;
  korean?: string;
  romanization?: string;
  english?: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
  isFavorite?: boolean;
  image?: string;
}

const VocabularyList = () => {
  const dispatch = useAppDispatch();
  const { chapterId } = useParams<{ chapterId: string }>();
  const [loading, setLoading] = useState(true);
  const [vocabularyData, setVocabularyData] = useState<Vocabulary[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const lessonInfo = { title: 'Vocabulary List', subtitle: '' };

  useEffect(() => {
    fetchVocabulary();
  }, [chapterId]);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      let wordsData: IWord[] = [];

      if (chapterId) {
        wordsData = await dispatch(getWordsByChapter(Number(chapterId))).unwrap();
      }

      // Map backend data to frontend format
      const mappedData: Vocabulary[] = wordsData.map((word: IWord) => ({
        id: word.id || 0,
        text: word.text || '',
        meaning: word.meaning || '',
        pronunciation: word.pronunciation || '',
        partOfSpeech: word.partOfSpeech || 'Noun',
        imageUrl: word.imageUrl,
        chapterId: word.chapterId,
        orderIndex: word.orderIndex,
        korean: word.text || '',
        romanization: word.pronunciation || '',
        english: word.meaning || '',
        example: '',
        exampleTranslation: '',
        category: word.partOfSpeech || 'General',
        isFavorite: false,
        image: word.imageUrl,
      }));

      setVocabularyData(mappedData);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      // Fallback to hardcoded data
      setVocabularyData([
        {
          id: 1,
          korean: '안녕하세요',
          romanization: 'annyeonghaseyo',
          english: 'Hello (formal)',
          partOfSpeech: 'Greeting',
          example: '안녕하세요, 저는 민수입니다.',
          exampleTranslation: 'Hello, I am Minsu.',
          category: 'Greetings',
          isFavorite: true,
          image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=100',
          text: '안녕하세요',
          meaning: 'Hello (formal)',
          pronunciation: 'annyeonghaseyo',
        },
        {
          id: 2,
          korean: '감사합니다',
          romanization: 'gamsahamnida',
          english: 'Thank you (formal)',
          partOfSpeech: 'Expression',
          example: '도와주셔서 감사합니다.',
          exampleTranslation: 'Thank you for helping me.',
          category: 'Greetings',
          isFavorite: false,
          image: 'https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=100',
          text: '감사합니다',
          meaning: 'Thank you (formal)',
          pronunciation: 'gamsahamnida',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const playAudio = (korean: string) => {
    console.log('Playing audio for:', korean);
  };

  const filteredVocabulary = vocabularyData.filter(vocab => {
    const matchesSearch =
      vocab.korean?.includes(searchText) ||
      vocab.romanization?.toLowerCase().includes(searchText.toLowerCase()) ||
      vocab.english?.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = filterCategory === 'all' || vocab.category === filterCategory;
    const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && favorites.includes(vocab.id));

    return matchesSearch && matchesCategory && matchesTab;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '32px',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space direction="vertical" size={8}>
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                {lessonInfo.title}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>{lessonInfo.subtitle || 'Korean Vocabulary'}</Text>
            </Space>
          </Col>
          <Col>
            <Space size="large">
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {vocabularyData.length}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>Total Words</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {favorites.length}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>Favorites</Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              size="large"
              placeholder="Search by Korean, Romanization, or English..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col>
            <Select size="large" value={filterCategory} onChange={setFilterCategory} style={{ width: 200 }}>
              <Select.Option value="all">All Categories</Select.Option>
              <Select.Option value="Greetings">Greetings</Select.Option>
              <Select.Option value="Family">Family</Select.Option>
              <Select.Option value="Places">Places</Select.Option>
              <Select.Option value="Food">Food</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card
        style={{
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large" style={{ padding: '0 24px' }}>
          <Tabs.TabPane
            tab={
              <Space>
                <BookOutlined />
                All Words ({vocabularyData.length})
              </Space>
            }
            key="all"
          >
            <VocabularyGrid
              vocabulary={filteredVocabulary}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onPlayAudio={playAudio}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Space>
                <StarFilled />
                Favorites ({favorites.length})
              </Space>
            }
            key="favorites"
          >
            <VocabularyGrid
              vocabulary={filteredVocabulary}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onPlayAudio={playAudio}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

const VocabularyGrid = ({
  vocabulary,
  favorites,
  onToggleFavorite,
  onPlayAudio,
}: {
  vocabulary: Vocabulary[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onPlayAudio: (korean: string | undefined) => void;
}) => {
  return (
    <List
      grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
      dataSource={vocabulary}
      style={{ padding: '24px' }}
      renderItem={item => (
        <List.Item>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              height: '100%',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Row gutter={16} align="top">
              {item.image && (
                <Col>
                  <Avatar src={item.image} size={80} shape="square" style={{ borderRadius: '8px' }} />
                </Col>
              )}

              <Col flex="auto">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Space align="center">
                        <Title level={3} style={{ margin: 0, fontSize: '28px', color: '#667eea' }}>
                          {item.korean}
                        </Title>
                        <Button
                          type="text"
                          icon={<SoundOutlined />}
                          onClick={() => onPlayAudio(item.korean)}
                          style={{ color: '#667eea' }}
                        />
                      </Space>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: '4px' }}>
                        {item.romanization}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      icon={favorites.includes(item.id) ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined />}
                      onClick={() => onToggleFavorite(item.id)}
                      size="large"
                    />
                  </div>

                  <div>
                    <Text strong style={{ fontSize: '16px', display: 'block' }}>
                      {item.english}
                    </Text>
                    <Tag color="blue" style={{ marginTop: '8px' }}>
                      {item.partOfSpeech}
                    </Tag>
                    <Tag>{item.category}</Tag>
                  </div>

                  <div
                    style={{
                      background: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #667eea',
                    }}
                  >
                    <Text style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>{item.example}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {item.exampleTranslation}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default VocabularyList;
