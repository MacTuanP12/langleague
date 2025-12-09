import * as React from 'react';
import { useState } from 'react';
import { Card, Row, Col, Typography, Progress, Tag, Space, Button, Input, Select } from 'antd';
import { BookOutlined, ClockCircleOutlined, CheckCircleOutlined, PlayCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface Lesson {
  id: number;
  title: string;
  titleKorean: string;
  chapter: number;
  duration: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  vocabularyCount: number;
  grammar: string[];
}

const BookLessons = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [filterChapter, setFilterChapter] = useState<number | 'all'>('all');

  const bookInfo = {
    title: 'Korean Language Course',
    titleKorean: '한국어 교과서',
    level: 'Beginner - Level 1',
    totalLessons: 20,
    completedLessons: 8,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
  };

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Hello! Nice to meet you',
      titleKorean: '안녕하세요! 만나서 반갑습니다',
      chapter: 1,
      duration: '45 mins',
      progress: 100,
      status: 'completed',
      vocabularyCount: 25,
      grammar: ['Greetings', 'Self-introduction'],
    },
    {
      id: 2,
      title: 'My Family',
      titleKorean: '저의 가족',
      chapter: 1,
      duration: '50 mins',
      progress: 100,
      status: 'completed',
      vocabularyCount: 30,
      grammar: ['Family terms', 'Possessive particles'],
    },
    {
      id: 3,
      title: 'Daily Routine',
      titleKorean: '일상 생활',
      chapter: 1,
      duration: '55 mins',
      progress: 60,
      status: 'in-progress',
      vocabularyCount: 35,
      grammar: ['Time expressions', 'Daily activities'],
    },
    {
      id: 4,
      title: 'At the Restaurant',
      titleKorean: '식당에서',
      chapter: 2,
      duration: '60 mins',
      progress: 0,
      status: 'locked',
      vocabularyCount: 40,
      grammar: ['Food vocabulary', 'Ordering expressions'],
    },
    {
      id: 5,
      title: 'Shopping',
      titleKorean: '쇼핑',
      chapter: 2,
      duration: '50 mins',
      progress: 0,
      status: 'locked',
      vocabularyCount: 38,
      grammar: ['Numbers', 'Price expressions'],
    },
    {
      id: 6,
      title: 'Hobbies and Interests',
      titleKorean: '취미와 관심사',
      chapter: 2,
      duration: '45 mins',
      progress: 0,
      status: 'locked',
      vocabularyCount: 32,
      grammar: ['Hobby vocabulary', 'Likes and dislikes'],
    },
  ];

  // derive chapters from lessons
  const chapters = React.useMemo(() => {
    const map = new Map<number, { id: number; name: string; lessons: number; completed: number; progress: number }>();
    lessons.forEach(l => {
      if (!map.has(l.chapter)) {
        map.set(l.chapter, { id: l.chapter, name: `Chapter ${l.chapter}`, lessons: 0, completed: 0, progress: 0 });
      }
      const entry = map.get(l.chapter);
      entry.lessons += 1;
      if (l.status === 'completed') entry.completed += 1;
      entry.progress += l.progress;
    });
    return Array.from(map.values()).map(c => ({ ...c, progress: Math.round(c.progress / c.lessons) }));
  }, [lessons]);

  const filteredChapters = chapters.filter(ch => {
    const matchesSearch = ch.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesChapter = filterChapter === 'all' || ch.id === filterChapter;
    return matchesSearch && matchesChapter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'in-progress':
        return '#1890ff';
      case 'locked':
        return '#d9d9d9';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'in-progress':
        return <PlayCircleOutlined />;
      case 'locked':
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div style={{ padding: '32px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Book Header */}
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
          <Row gutter={32} align="middle">
            <Col>
              <img
                src={bookInfo.image}
                alt={bookInfo.title}
                style={{
                  width: '160px',
                  height: '220px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Tag color="gold" style={{ marginBottom: '8px' }}>
                    {bookInfo.level}
                  </Tag>
                  <Title level={2} style={{ color: 'white', margin: 0 }}>
                    {bookInfo.title}
                  </Title>
                  <Title level={4} style={{ color: 'rgba(255,255,255,0.9)', margin: '4px 0 0', fontWeight: 400 }}>
                    {bookInfo.titleKorean}
                  </Title>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px' }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: 'white' }}>Overall Progress</Text>
                      <Text strong style={{ color: 'white' }}>
                        {bookInfo.completedLessons} / {bookInfo.totalLessons} Lessons
                      </Text>
                    </div>
                    <Progress
                      percent={(bookInfo.completedLessons / bookInfo.totalLessons) * 100}
                      strokeColor="#fff"
                      strokeLinecap="round"
                      showInfo={false}
                    />
                  </Space>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Filters */}
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
                placeholder="Search chapters..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Col>
            <Col>
              <Select size="large" value={filterChapter} onChange={setFilterChapter} style={{ width: 200 }}>
                <Select.Option value="all">All Chapters</Select.Option>
                <Select.Option value={1}>Chapter 1</Select.Option>
                <Select.Option value={2}>Chapter 2</Select.Option>
                <Select.Option value={3}>Chapter 3</Select.Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Chapters List */}
        <Row gutter={[24, 24]}>
          {filteredChapters.map(chapter => (
            <Col xs={24} md={12} lg={8} key={chapter.id}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Tag color="blue">{chapter.name}</Tag>

                  <div>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                      {chapter.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '15px', display: 'block', marginTop: '4px' }}>
                      {chapter.lessons} lessons • {chapter.completed} completed
                    </Text>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Progress
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {chapter.progress}%
                      </Text>
                    </div>
                    <Progress percent={chapter.progress} strokeColor="#667eea" showInfo={false} />
                  </div>

                  <Space split={<span style={{ color: '#d9d9d9' }}>•</span>}>
                    <Space size={4}>
                      <BookOutlined style={{ fontSize: '14px', color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {chapter.lessons} lessons
                      </Text>
                    </Space>
                  </Space>

                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate(`/dashboard/courses/chapter/${chapter.id}`)}
                    style={{ borderRadius: '8px', marginTop: '8px' }}
                  >
                    Continue
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BookLessons;
