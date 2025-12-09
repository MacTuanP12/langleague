import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, Select, Tag, Space, Empty, Skeleton, message } from 'antd';
import { BookOutlined, SearchOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { getActiveBooks, searchBooks, getBooksByLevel } from 'app/shared/services/book.service';
import { IBook } from 'app/shared/model/models';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const BookLibrary: React.FC = () => {
  const { t } = useTranslation(['common', 'user']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [books, setBooks] = useState<IBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Use getActiveBooks instead of getBooks
      const result = await dispatch(getActiveBooks({ page: 0, size: 100 })).unwrap();
      console.log('Active books API result:', result);
      const booksArray = Array.isArray(result) ? result : result.content ? result.content : [];
      setBooks(booksArray);
      setFilteredBooks(booksArray);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter/Search books with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, selectedLevel]);

  const handleFilterBooks = async () => {
    setLoading(true);
    try {
      let result: any;

      // If searching, use search API
      if (searchText && searchText.trim()) {
        result = await dispatch(searchBooks({ keyword: searchText, page: 0, size: 100 })).unwrap();
      }
      // If filtering by level, use level API
      else if (selectedLevel !== 'all') {
        result = await dispatch(getBooksByLevel(selectedLevel)).unwrap();
      }
      // Otherwise get active books
      else {
        result = await dispatch(getActiveBooks({ page: 0, size: 100 })).unwrap();
      }

      const booksArray = Array.isArray(result) ? result : result.content ? result.content : [];
      setFilteredBooks(booksArray);
    } catch (error) {
      console.error('Error filtering books:', error);
      message.error(t('common.error') || 'Không thể lọc sách');
      // Fallback to client-side filtering if API fails
      let filtered = books;

      if (searchText) {
        filtered = filtered.filter(
          book =>
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchText.toLowerCase()) ||
            book.description?.toLowerCase().includes(searchText.toLowerCase()),
        );
      }

      if (selectedLevel !== 'all') {
        filtered = filtered.filter(book => book.level === selectedLevel);
      }

      setFilteredBooks(filtered);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level?: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'green',
      ELEMENTARY: 'cyan',
      INTERMEDIATE: 'blue',
      UPPER_INTERMEDIATE: 'purple',
      ADVANCED: 'red',
    };
    return colors[level || 'BEGINNER'] || 'default';
  };

  const getLevelText = (level?: string) => {
    const texts: Record<string, string> = {
      BEGINNER: 'Sơ cấp',
      ELEMENTARY: 'Cơ bản',
      INTERMEDIATE: 'Trung cấp',
      UPPER_INTERMEDIATE: 'Trung cao cấp',
      ADVANCED: 'Cao cấp',
    };
    return texts[level || 'BEGINNER'] || level;
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: 12 }} />
          {t('books.title')}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Khám phá và học tiếng Hàn với hàng trăm cuốn sách Hàn Quốc được AI phân tích chi tiết
        </Paragraph>
      </div>

      {/* Filters */}
      <Card variant="borderless" style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Input
              size="large"
              placeholder={t('books.search')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              size="large"
              placeholder={t('books.level')}
              value={selectedLevel}
              onChange={setSelectedLevel}
              style={{ width: '100%', borderRadius: 8 }}
            >
              <Option value="all">Tất cả mức độ</Option>
              <Option value="BEGINNER">Sơ cấp</Option>
              <Option value="INTERMEDIATE">Trung cấp</Option>
              <Option value="ADVANCED">Cao cấp</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Book Grid với Skeleton Loading */}
      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card style={{ borderRadius: 12 }}>
                <Skeleton.Image
                  active
                  style={{
                    width: '100%',
                    height: 280,
                    marginBottom: 16,
                  }}
                />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : filteredBooks.length === 0 ? (
        <Empty description={t('common.noData')} style={{ marginTop: 60 }} />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredBooks.map(book => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: 280,
                      backgroundColor: '#f5f5f5',
                      backgroundImage: book.thumbnail ? `url(${book.thumbnail})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px 12px 0 0',
                      position: 'relative',
                    }}
                  >
                    {!book.thumbnail && <BookOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
                    {/* Level Tag trên ảnh bìa */}
                    {book.level && (
                      <Tag
                        color={getLevelColor(book.level)}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          borderRadius: 8,
                          padding: '4px 12px',
                          fontWeight: 600,
                          fontSize: 12,
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        {getLevelText(book.level)}
                      </Tag>
                    )}
                  </div>
                }
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0',
                }}
                onClick={() => navigate(`/dashboard/books/${book.id}`)}
              >
                <Card.Meta
                  title={
                    <div style={{ marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 16, display: 'block' }} ellipsis={{ tooltip: book.title }}>
                        {book.title}
                      </Text>
                    </div>
                  }
                  description={
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Text type="secondary" ellipsis style={{ fontSize: 13 }}>
                        {book.author || t('books.author')}
                      </Text>

                      <Space split="|" size={8} style={{ fontSize: 12, color: '#999' }}>
                        {book.totalChapters && (
                          <span>
                            <FileTextOutlined /> {book.totalChapters} chương
                          </span>
                        )}
                        {book.totalPages && (
                          <span>
                            <ClockCircleOutlined /> {book.totalPages} trang
                          </span>
                        )}
                      </Space>

                      <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                        {book.description || t('books.description')}
                      </Paragraph>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BookLibrary;
