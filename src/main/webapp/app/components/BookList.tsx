import React, { useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Space, Spin, Tag } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../config/store';
import { getBooks } from '../shared/reducers/book.reducer';

const { Title, Text, Paragraph } = Typography;

const BookList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const books = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);

  useEffect(() => {
    dispatch(getBooks({ page: 0, size: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <BookOutlined /> Korean Learning Books
          </Title>
          <Text type="secondary">Choose a book to start your learning journey</Text>
        </div>

        <Row gutter={[16, 16]}>
          {books.map(book => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Card
                hoverable
                cover={
                  book.thumbnail ? (
                    <img alt={book.title} src={book.thumbnail} style={{ height: 200, objectFit: 'cover' }} />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BookOutlined style={{ fontSize: 64, color: 'white' }} />
                    </div>
                  )
                }
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={4}>{book.title}</Title>
                    {book.level && (
                      <Tag color={book.level === 'BEGINNER' ? 'green' : book.level === 'INTERMEDIATE' ? 'orange' : 'red'}>{book.level}</Tag>
                    )}
                  </div>

                  {book.description && (
                    <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                      {book.description}
                    </Paragraph>
                  )}

                  <Link to={`/books/${book.id}/chapters`}>
                    <Button type="primary" block>
                      View Chapters
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};

export default BookList;
