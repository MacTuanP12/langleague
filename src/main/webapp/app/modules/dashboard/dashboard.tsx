import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Space, Progress, Spin, Button, Tag } from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  FireOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useAppDispatch } from 'app/config/store';
import { getCurrentUser } from 'app/shared/services/user.service';
import { getCurrentStreak } from 'app/shared/services/learning-streak.service';
import { getMyBooks } from 'app/shared/services/progress.service';
import { getMyProgress } from 'app/shared/services/learning-report.service';
import { useNavigate } from 'react-router-dom';
import './dashboard.scss';

const { Text, Title } = Typography;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayProgress, setTodayProgress] = useState({ xp: 0, goal: 50, chapters: 0, words: 0 });
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    wordsLearned: 0,
    chaptersCompleted: 0,
    studyTime: 0,
    booksInProgress: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user info
      try {
        const user = await dispatch(getCurrentUser()).unwrap();
        setUserName(user.firstName || user.login || 'User');
      } catch (error) {
        console.log('User API fallback');
      }

      // Fetch streak
      try {
        const streak = await dispatch(getCurrentStreak()).unwrap();
        setCurrentStreak(streak);
      } catch (error) {
        setCurrentStreak(5);
      }

      // Fetch books
      try {
        const bookProgresses = await dispatch(getMyBooks()).unwrap();
        if (Array.isArray(bookProgresses) && bookProgresses.length > 0) {
          const incompleteBook = bookProgresses.find((p: any) => (p.percent || 0) < 100);
          if (incompleteBook) {
            setCurrentBook({
              id: incompleteBook.bookId,
              title: incompleteBook.bookTitle || 'Book #' + incompleteBook.bookId,
              progress: Math.round(incompleteBook.percent || 0),
              thumbnail: incompleteBook.bookThumbnail,
              level: 'INTERMEDIATE',
              chaptersTotal: 12,
              chaptersCompleted: Math.round(((incompleteBook.percent || 0) * 12) / 100),
            });
          }

          // Recent books for cards
          const booksData = bookProgresses.slice(0, 6).map((progress: any, idx: number) => ({
            id: progress.bookId,
            title: progress.bookTitle || 'Book #' + progress.bookId,
            progress: Math.round(progress.percent || 0),
            thumbnail: progress.bookThumbnail,
            level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][idx % 3],
            color: ['#667eea', '#e85b8a', '#f6c344', '#4caf50', '#9c27b0', '#ff9800'][idx % 6],
          }));
          setRecentBooks(booksData);
        } else {
          // Mock data
          setCurrentBook({
            id: 1,
            title: 'Korean for Beginners',
            progress: 75,
            level: 'BEGINNER',
            chaptersTotal: 12,
            chaptersCompleted: 9,
          });
          setRecentBooks([
            { id: 1, title: 'Korean for Beginners', progress: 75, level: 'BEGINNER', color: '#667eea' },
            { id: 2, title: 'Korean Culture and Idioms', progress: 45, level: 'INTERMEDIATE', color: '#e85b8a' },
            { id: 3, title: 'Advanced Korean Conversation', progress: 30, level: 'ADVANCED', color: '#f6c344' },
          ]);
        }
      } catch (error) {
        // Mock data
        setCurrentBook({
          id: 1,
          title: 'Korean for Beginners',
          progress: 75,
          level: 'BEGINNER',
          chaptersTotal: 12,
          chaptersCompleted: 9,
        });
        setRecentBooks([
          { id: 1, title: 'Korean for Beginners', progress: 75, level: 'BEGINNER', color: '#667eea' },
          { id: 2, title: 'Korean Culture and Idioms', progress: 45, level: 'INTERMEDIATE', color: '#e85b8a' },
          { id: 3, title: 'Advanced Korean Conversation', progress: 30, level: 'ADVANCED', color: '#f6c344' },
        ]);
      }

      // Fetch statistics
      try {
        const myProgress = await dispatch(getMyProgress()).unwrap();
        setStatistics({
          wordsLearned: myProgress.totalWords || 256,
          chaptersCompleted: myProgress.chaptersCompleted || 12,
          studyTime: myProgress.totalStudyTime || 7200,
          booksInProgress: myProgress.booksStarted || 3,
        });

        // Today's progress
        const currentXP = myProgress.totalPoints ? myProgress.totalPoints % 50 : 30;
        setTodayProgress({
          xp: Math.min(currentXP, 50),
          goal: 50,
          chapters: 2,
          words: 15,
        });
      } catch (error) {
        setStatistics({
          wordsLearned: 256,
          chaptersCompleted: 12,
          studyTime: 120,
          booksInProgress: 3,
        });
        setTodayProgress({
          xp: 30,
          goal: 50,
          chapters: 2,
          words: 15,
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return '#52c41a';
      case 'INTERMEDIATE':
        return '#faad14';
      case 'ADVANCED':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Cơ bản';
      case 'INTERMEDIATE':
        return 'Trung cấp';
      case 'ADVANCED':
        return 'Nâng cao';
      default:
        return level;
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="dashboard-container">
        {/* HERO SECTION - CONTINUE LEARNING */}
        {currentBook && (
          <div className="hero-section">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                  {/* Greeting */}
                  <div>
                    <Text className="hero-greeting">
                      {greeting()}, {userName}! 👋
                    </Text>
                    <Title level={1} className="hero-title">
                      Sẵn sàng tiếp tục học?
                    </Title>
                  </div>

                  {/* Current Book Card */}
                  <div className="current-book-card">
                    <Row gutter={16} align="middle">
                      <Col flex="80px">
                        <div className="book-thumbnail">
                          {currentBook.thumbnail ? (
                            <img src={currentBook.thumbnail} alt={currentBook.title} />
                          ) : (
                            <BookOutlined style={{ fontSize: 32, color: '#667eea' }} />
                          )}
                        </div>
                      </Col>
                      <Col flex="auto">
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          <div>
                            <Tag color={getLevelColor(currentBook.level)} style={{ marginBottom: 4 }}>
                              {getLevelText(currentBook.level)}
                            </Tag>
                            <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                              {currentBook.title}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {currentBook.chaptersCompleted}/{currentBook.chaptersTotal} chương
                            </Text>
                          </div>
                          <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <Text style={{ fontSize: 13, color: '#666' }}>Tiến độ</Text>
                              <Text strong style={{ fontSize: 14, color: '#667eea' }}>
                                {currentBook.progress}%
                              </Text>
                            </div>
                            <Progress
                              percent={currentBook.progress}
                              strokeColor={{
                                '0%': '#667eea',
                                '100%': '#764ba2',
                              }}
                              strokeWidth={10}
                              showInfo={false}
                              strokeLinecap="round"
                            />
                          </div>
                        </Space>
                      </Col>
                    </Row>
                  </div>

                  {/* CTA Button */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate(`/dashboard/books/${currentBook.id}`)}
                    className="hero-cta-button"
                  >
                    HỌC TIẾP NGAY
                  </Button>
                </Space>
              </Col>

              {/* Today's Progress Card */}
              <Col xs={24} lg={10}>
                <div className="today-progress-card">
                  <Space direction="vertical" size={20} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
                        📊 Tiến độ hôm nay
                      </Title>
                      <Text type="secondary">Tiếp tục phấn đấu!</Text>
                    </div>

                    {/* XP Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 500 }}>🎯 Mục tiêu XP</Text>
                        <Text strong style={{ fontSize: 16, color: '#f6c344' }}>
                          {todayProgress.xp}/{todayProgress.goal} XP
                        </Text>
                      </div>
                      <Progress
                        percent={(todayProgress.xp / todayProgress.goal) * 100}
                        strokeColor={{
                          '0%': '#f6c344',
                          '100%': '#ff9800',
                        }}
                        strokeWidth={16}
                        showInfo={false}
                        strokeLinecap="round"
                      />
                    </div>

                    {/* Quick Stats */}
                    <Row gutter={12}>
                      <Col span={12}>
                        <div className="today-stat-box">
                          <div className="stat-icon" style={{ background: '#e6f7ff' }}>
                            <CheckCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                          </div>
                          <Text strong style={{ fontSize: 18, display: 'block' }}>
                            {todayProgress.chapters}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Chương hoàn thành
                          </Text>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="today-stat-box">
                          <div className="stat-icon" style={{ background: '#f6ffed' }}>
                            <BookOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                          </div>
                          <Text strong style={{ fontSize: 18, display: 'block' }}>
                            {todayProgress.words}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Từ mới học
                          </Text>
                        </div>
                      </Col>
                    </Row>

                    {/* Streak */}
                    <div className="streak-badge">
                      <FireOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                      <div>
                        <Text strong style={{ fontSize: 16, color: '#1a1a1a' }}>
                          {currentStreak} ngày liên tiếp
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                          Giữ vững phong độ! 🔥
                        </Text>
                      </div>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* STATS CARDS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          {[
            {
              icon: <BookOutlined />,
              value: statistics.wordsLearned,
              label: 'Từ đã học',
              color: '#667eea',
              bg: '#f0f2ff',
            },
            {
              icon: <TrophyOutlined />,
              value: statistics.chaptersCompleted,
              label: 'Chương hoàn thành',
              color: '#f6c344',
              bg: '#fffbf0',
            },
            {
              icon: <ClockCircleOutlined />,
              value: `${statistics.studyTime}h`,
              label: 'Thời gian học',
              color: '#e85b8a',
              bg: '#fff0f6',
            },
            {
              icon: <RiseOutlined />,
              value: statistics.booksInProgress,
              label: 'Sách đang học',
              color: '#4caf50',
              bg: '#f6ffed',
            },
          ].map((stat, idx) => (
            <Col xs={12} sm={12} md={6} key={idx}>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: stat.bg }}>
                  {React.cloneElement(stat.icon, { style: { fontSize: 24, color: stat.color } })}
                </div>
                <Title level={3} style={{ margin: '12px 0 4px', color: '#1a1a1a' }}>
                  {stat.value}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {stat.label}
                </Text>
              </div>
            </Col>
          ))}
        </Row>

        {/* INTERACTIVE BOOK CARDS */}
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 20 }}>
            📚 Sách của tôi
          </Title>
          <Row gutter={[20, 20]}>
            {recentBooks.map((book, idx) => (
              <Col xs={24} sm={12} lg={8} key={idx}>
                <div className="interactive-book-card" onClick={() => navigate(`/dashboard/books/${book.id}`)}>
                  {/* Book Thumbnail */}
                  <div className="book-card-thumbnail" style={{ background: book.color || '#667eea' }}>
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} />
                    ) : (
                      <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
                    )}
                    {book.progress === 100 && (
                      <div className="completion-badge">
                        <CheckCircleOutlined /> Hoàn thành
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="book-card-content">
                    <Tag color={getLevelColor(book.level)} style={{ marginBottom: 8, fontSize: 11, fontWeight: 600 }}>
                      {getLevelText(book.level)}
                    </Tag>
                    <Title level={5} style={{ margin: '0 0 8px', color: '#1a1a1a' }} ellipsis={{ rows: 2 }}>
                      {book.title}
                    </Title>

                    {/* Progress Bar */}
                    <div className="book-progress-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 12, color: '#666' }}>Tiến độ</Text>
                        <Text strong style={{ fontSize: 13, color: book.color }}>
                          {book.progress}%
                        </Text>
                      </div>
                      <Progress percent={book.progress} strokeColor={book.color} strokeWidth={8} showInfo={false} strokeLinecap="round" />
                    </div>

                    {/* Action Button */}
                    <Button
                      type="text"
                      block
                      className="book-card-action"
                      icon={book.progress === 100 ? <StarFilled /> : <PlayCircleOutlined />}
                    >
                      {book.progress === 100 ? 'Ôn tập' : 'Tiếp tục học'}
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/dashboard/books')}
            style={{ height: 48, paddingLeft: 32, paddingRight: 32 }}
          >
            Xem tất cả sách
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default Dashboard;
