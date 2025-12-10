import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Progress, Tag, List, Spin, Empty, Statistic, message } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { getBook, getBookChapters } from 'app/shared/services/book.service';
import { getBookProgress, getChapterProgressesByBook } from 'app/shared/services/progress.service';
import { IBook, IChapter, IBookProgress, IChapterProgress } from 'app/shared/model/models';

const { Title, Text, Paragraph } = Typography;

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [book, setBook] = useState<IBook | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [bookProgress, setBookProgress] = useState<IBookProgress | null>(null);
  const [chapterProgresses, setChapterProgresses] = useState<IChapterProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      setLoading(true);
      setChaptersError(false);
      try {
        // Fetch book info
        const bookData = await dispatch(getBook(parseInt(bookId, 10))).unwrap();
        console.log('Book data loaded:', bookData);
        setBook(bookData);

        // Fetch chapters using book API endpoint
        try {
          const chaptersData = await dispatch(getBookChapters(parseInt(bookId, 10))).unwrap();
          console.log('Chapters data loaded:', chaptersData);
          const chaptersArray = Array.isArray(chaptersData) ? chaptersData : [];

          if (chaptersArray.length === 0) {
            console.warn('No chapters found for book:', bookId);
            setChaptersError(true);
          }

          setChapters(chaptersArray);
        } catch (chapterError: any) {
          console.error('Error fetching chapters:', chapterError);
          setChaptersError(true);
          message.error('Không thể tải danh sách chương');
        }

        // Fetch progress (optional - user might not have progress yet)
        try {
          const progressData = await dispatch(getBookProgress(parseInt(bookId, 10))).unwrap();
          setBookProgress(progressData);

          const chapterProgressData = await dispatch(getChapterProgressesByBook(parseInt(bookId, 10))).unwrap();
          setChapterProgresses(Array.isArray(chapterProgressData) ? chapterProgressData : []);
        } catch (progressError) {
          console.log('No progress data yet for this book');
        }
      } catch (error: any) {
        console.error('Error fetching book data:', error);
        message.error('Không thể tải thông tin sách');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, dispatch]);

  const getChapterProgress = (chapterId: number) => {
    return chapterProgresses.find(cp => cp.chapterId === chapterId);
  };

  const completedChapters = chapterProgresses.filter(cp => cp.isCompleted).length;
  const overallProgress = chapters.length > 0 ? (completedChapters / chapters.length) * 100 : 0;

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Spin spinning={loading}>
        {book && (
          <>
            {/* Book Header */}
            <Card variant="borderless" style={{ marginBottom: 24, borderRadius: 12 }}>
              <Row gutter={32}>
                <Col xs={24} md={6}>
                  <div
                    style={{
                      width: '100%',
                      height: 280,
                      backgroundColor: '#f5f5f5',
                      backgroundImage: book.thumbnail ? `url(${book.thumbnail})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!book.thumbnail && <BookOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
                  </div>
                </Col>

                <Col xs={24} md={18}>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div>
                      <Title level={2} style={{ marginBottom: 8 }}>
                        {book.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 16 }}>
                        {book.author || 'Không rõ tác giả'}
                      </Text>
                    </div>

                    {book.level && (
                      <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                        {book.level}
                      </Tag>
                    )}

                    <Paragraph>{book.description || 'Không có mô tả'}</Paragraph>

                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic title="Chương" value={book.totalChapters || chapters.length} prefix={<FileTextOutlined />} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="Trang" value={book.totalPages || 0} prefix={<ReadOutlined />} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="Hoàn thành" value={`${completedChapters}/${chapters.length}`} prefix={<CheckCircleOutlined />} />
                      </Col>
                      <Col span={6}>
                        <Statistic title="Tiến độ" value={Math.round(overallProgress)} suffix="%" prefix={<TrophyOutlined />} />
                      </Col>
                    </Row>

                    {bookProgress && (
                      <div>
                        <Text type="secondary">Tiến độ tổng thể</Text>
                        <Progress
                          percent={Math.round(overallProgress)}
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          style={{ marginTop: 8 }}
                        />
                      </div>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Chapters List */}
            <Card variant="borderless" style={{ borderRadius: 12 }}>
              <Title level={4} style={{ marginBottom: 24 }}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Danh sách chương
              </Title>

              {chapters.length === 0 ? (
                <Empty
                  description={
                    chaptersError
                      ? 'Không thể tải danh sách chương. Vui lòng thử lại sau hoặc liên hệ quản trị viên.'
                      : 'Chưa có chương nào'
                  }
                  image={chaptersError ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
                >
                  {chaptersError && (
                    <Button type="primary" onClick={() => window.location.reload()}>
                      Tải lại trang
                    </Button>
                  )}
                </Empty>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={chapters}
                  renderItem={(chapter, index) => {
                    const progress = getChapterProgress(chapter.id);
                    const isCompleted = progress?.isCompleted || false;
                    const progressPercent = progress?.progressPercentage || 0;

                    return (
                      <List.Item
                        style={{
                          padding: '16px',
                          borderRadius: 8,
                          marginBottom: 12,
                          backgroundColor: isCompleted ? '#f6ffed' : '#fafafa',
                          border: isCompleted ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => navigate(`/dashboard/books/${bookId}/chapter/${chapter.id}`)}
                        actions={[
                          <Button
                            key="action"
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/dashboard/books/${bookId}/chapter/${chapter.id}`);
                            }}
                          >
                            {isCompleted ? 'Ôn tập' : progress ? 'Tiếp tục' : 'Bắt đầu'}
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: isCompleted ? '#52c41a' : '#1890ff',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                              }}
                            >
                              {isCompleted ? <CheckCircleOutlined /> : index + 1}
                            </div>
                          }
                          title={
                            <Space>
                              <Text strong style={{ fontSize: 16 }}>
                                {chapter.title}
                              </Text>
                              {isCompleted && (
                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                  Hoàn thành
                                </Tag>
                              )}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                              {chapter.description && <Text type="secondary">{chapter.description}</Text>}
                              <Space size={16} style={{ fontSize: 12, color: '#999' }}>
                                {chapter.totalWords && (
                                  <span>
                                    <ReadOutlined /> {chapter.totalWords} từ vựng
                                  </span>
                                )}
                                {chapter.totalGrammars && (
                                  <span>
                                    <FileTextOutlined /> {chapter.totalGrammars} ngữ pháp
                                  </span>
                                )}
                                {chapter.totalExercises && (
                                  <span>
                                    <ClockCircleOutlined /> {chapter.totalExercises} bài tập
                                  </span>
                                )}
                              </Space>
                              {progress && progressPercent > 0 && !isCompleted && (
                                <Progress percent={Math.round(progressPercent)} size="small" style={{ width: '100%', maxWidth: 400 }} />
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              )}
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
};

export default BookDetail;
