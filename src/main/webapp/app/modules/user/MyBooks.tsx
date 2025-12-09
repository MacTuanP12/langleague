import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Tag, Progress, Empty, Spin, Modal, message, Select, Tabs, Statistic } from 'antd';
import {
  BookOutlined,
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getMyBooks,
  getFavoriteBooks,
  getBooksByStatus,
  getStatistics,
  removeBook,
  toggleFavorite,
  UserBookDTO,
  UserBookStatisticsDTO,
} from 'app/shared/services/user-book.service';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const MyBooks: React.FC = () => {
  const { t } = useTranslation(['user', 'common']);
  const navigate = useNavigate();
  const [books, setBooks] = useState<UserBookDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<UserBookStatisticsDTO | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadStatistics();
    loadBooks('all');
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const loadBooks = async (tab: string) => {
    try {
      setLoading(true);
      let response;

      switch (tab) {
        case 'all':
          response = await getMyBooks();
          break;
        case 'favorites':
          response = await getFavoriteBooks();
          break;
        case 'in-progress':
          response = await getBooksByStatus('IN_PROGRESS');
          break;
        case 'completed':
          response = await getBooksByStatus('COMPLETED');
          break;
        case 'not-started':
          response = await getBooksByStatus('NOT_STARTED');
          break;
        default:
          response = await getMyBooks();
      }

      setBooks(response.data);
    } catch (error) {
      console.error('Failed to load books:', error);
      message.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    loadBooks(key);
  };

  const handleRemoveBook = (bookId: number, bookTitle: string) => {
    Modal.confirm({
      title: 'Remove Book',
      content: `Are you sure you want to remove "${bookTitle}" from your library?`,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await removeBook(bookId);
          message.success('Book removed from library');
          loadBooks(activeTab);
          loadStatistics();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to remove book');
        }
      },
    });
  };

  const handleToggleFavorite = async (bookId: number) => {
    try {
      await toggleFavorite(bookId);
      loadBooks(activeTab);
      loadStatistics();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update favorite');
    }
  };

  const handleStartLearning = (bookId: number) => {
    // Navigate to book detail page in dashboard
    navigate(`/dashboard/books/${bookId}`);
  };

  const getLevelColor = (level?: string) => {
    const colors = {
      BEGINNER: 'green',
      INTERMEDIATE: 'orange',
      ADVANCED: 'red',
      EXPERT: 'purple',
    };
    return colors[level || 'BEGINNER'] || 'default';
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      NOT_STARTED: { color: 'default', icon: <ClockCircleOutlined />, text: 'Not Started' },
      IN_PROGRESS: { color: 'processing', icon: <PlayCircleOutlined />, text: 'In Progress' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
    };

    const config = statusConfig[status] || statusConfig.NOT_STARTED;

    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Statistics */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Total Books" value={statistics.totalBooks} prefix={<BookOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={statistics.booksInProgress}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed"
                value={statistics.booksCompleted}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Favorites" value={statistics.favoriteBooks} prefix={<HeartFilled />} valueStyle={{ color: '#eb2f96' }} />
            </Card>
          </Col>
        </Row>
      )}

      {/* Books List */}
      <Card
        title={
          <Space>
            <BookOutlined />
            <span>My Books</span>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="All Books" key="all" />
          <TabPane tab="In Progress" key="in-progress" />
          <TabPane tab="Completed" key="completed" />
          <TabPane tab="Not Started" key="not-started" />
          <TabPane tab="Favorites" key="favorites" />
        </Tabs>

        <Spin spinning={loading}>
          {books.length === 0 ? (
            <Empty description="No books in your library yet" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '40px 0' }}>
              <Button type="primary" onClick={() => navigate('/courses')}>
                Browse Books
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              {books.map(book => (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <Card
                    hoverable
                    cover={
                      <div
                        style={{
                          height: '200px',
                          background: book.bookThumbnail
                            ? `url(${book.bookThumbnail}) center/cover`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '48px',
                        }}
                      >
                        {!book.bookThumbnail && <BookOutlined />}
                      </div>
                    }
                    actions={[
                      <Button
                        key="favorite"
                        type="text"
                        icon={book.isFavorite ? <HeartFilled style={{ color: '#eb2f96' }} /> : <HeartOutlined />}
                        onClick={() => handleToggleFavorite(book.bookId)}
                      />,
                      <Button key="continue" type="text" icon={<PlayCircleOutlined />} onClick={() => handleStartLearning(book.bookId)}>
                        Continue
                      </Button>,
                      <Button
                        key="remove"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveBook(book.bookId, book.bookTitle)}
                      />,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong ellipsis={{ tooltip: book.bookTitle }}>
                            {book.bookTitle}
                          </Text>
                        </div>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Space wrap>
                            {book.bookLevel && <Tag color={getLevelColor(book.bookLevel)}>{book.bookLevel}</Tag>}
                            {getStatusTag(book.learningStatus)}
                          </Space>

                          {book.progressPercentage !== undefined && book.progressPercentage > 0 && (
                            <div>
                              <Progress percent={Math.round(book.progressPercentage)} size="small" status="active" />
                            </div>
                          )}

                          {book.currentChapterTitle && (
                            <Text type="secondary" ellipsis={{ tooltip: book.currentChapterTitle }} style={{ fontSize: '12px' }}>
                              Current: {book.currentChapterTitle}
                            </Text>
                          )}

                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Last accessed: {formatDate(book.lastAccessedAt)}
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default MyBooks;
