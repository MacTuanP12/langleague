import React, { useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Space, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../config/store';
import { getChapters, getChaptersByBookId } from '../shared/reducers/chapter.reducer';

const { Title, Text } = Typography;

interface ChapterListProps {
  bookId?: number;
}

const ChapterList: React.FC<ChapterListProps> = ({ bookId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const chapters = useAppSelector(state => state.chapter.entities);
  const loading = useAppSelector(state => state.chapter.loading);

  useEffect(() => {
    if (bookId) {
      dispatch(getChaptersByBookId(bookId));
    } else {
      dispatch(getChapters());
    }
  }, [bookId, dispatch]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {chapters.map(chapter => (
          <Col xs={24} sm={12} md={8} key={chapter.id}>
            <Card hoverable>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={4}>{chapter.title}</Title>
                <Text type="secondary">Chapter {chapter.orderIndex}</Text>
                {chapter.bookTitle && <Text type="secondary">Book: {chapter.bookTitle}</Text>}
                <Link to={`/chapters/${chapter.id}/lessons`}>
                  <Button type="primary" block>
                    View Lessons
                  </Button>
                </Link>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ChapterList;
