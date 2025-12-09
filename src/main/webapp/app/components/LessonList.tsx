import React, { useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Link, useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, Space, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../config/store';
import { getLessonsByChapterId } from '../shared/reducers/lesson.reducer';

const { Title, Text, Paragraph } = Typography;

const LessonList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { chapterId } = useParams<{ chapterId: string }>();
  const lessons = useAppSelector(state => state.lesson.entities);
  const loading = useAppSelector(state => state.lesson.loading);

  useEffect(() => {
    if (chapterId) {
      dispatch(getLessonsByChapterId(parseInt(chapterId, 10)));
    }
  }, [chapterId, dispatch]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{lessons[0]?.chapterTitle || t('learning.lesson')}</Title>
      <Row gutter={[16, 16]}>
        {lessons.map(lesson => (
          <Col xs={24} sm={12} md={8} key={lesson.id}>
            <Card
              hoverable
              cover={
                lesson.thumbnail ? <img alt={lesson.title} src={lesson.thumbnail} style={{ height: 140, objectFit: 'cover' }} /> : undefined
              }
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={4}>{lesson.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                  {lesson.description}
                </Paragraph>
                <Space>
                  <Tag color={lesson.level === 'BEGINNER' ? 'green' : lesson.level === 'INTERMEDIATE' ? 'orange' : 'red'}>
                    {t(`books.${lesson.level?.toLowerCase() || 'beginner'}`)}
                  </Tag>
                  {lesson.estimatedMinutes && (
                    <Space size="small">
                      <ClockCircleOutlined />
                      <Text>
                        {lesson.estimatedMinutes} {t('common.minutes')}
                      </Text>
                    </Space>
                  )}
                </Space>
                <Link to={`/lessons/${lesson.id}`}>
                  <Button type="primary" block>
                    {t('learning.startLesson')}
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

export default LessonList;
