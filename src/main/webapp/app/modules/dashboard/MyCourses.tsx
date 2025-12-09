import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Typography, Row, Col, Tag, Input, Space, Spin, Empty } from 'antd';
import { SearchOutlined, BookOutlined, UserOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { getMyBooks } from 'app/shared/services/progress.service';

const { Title, Text } = Typography;

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started';
  bookId?: number;
  totalChapters?: number;
  completedChapters?: number;
}

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const bookProgresses = await dispatch(getMyBooks()).unwrap();

      if (Array.isArray(bookProgresses)) {
        const coursesData: Course[] = bookProgresses.map((progress: any) => ({
          id: progress.id || 0,
          bookId: progress.bookId,
          title: progress.bookTitle || progress.book?.title || 'Untitled Book',
          description: progress.book?.description || 'Korean language course',
          image: progress.bookThumbnail || progress.book?.thumbnail || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
          progress: Math.round(progress.percent || progress.progressPercentage || 0),
          totalChapters: progress.book?.totalChapters || 0,
          completedChapters: Math.round(((progress.percent || 0) / 100) * (progress.book?.totalChapters || 0)),
          status: progress.completed ? 'completed' : (progress.percent || 0) > 0 ? 'in-progress' : 'not-started',
        }));
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    if (status === 'completed') {
      return (
        <Tag color="success" style={{ borderRadius: 6 }}>
          ✓ Completed
        </Tag>
      );
    }
    if (status === 'in-progress') {
      return (
        <Tag color="processing" style={{ borderRadius: 6 }}>
          ⏳ In Progress
        </Tag>
      );
    }
    return (
      <Tag color="default" style={{ borderRadius: 6 }}>
        🔒 Not Started
      </Tag>
    );
  };

  const handleCourseClick = (courseId: string) => {
    // Navigate to course chapters
    navigate(`/dashboard/courses/${courseId}/chapters`);
  };

  const filteredCourses = courses.filter(
    course =>
      course.title.toLowerCase().includes(searchText.toLowerCase()) || course.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div style={{ padding: '32px', background: '#f5f5f7', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #e41d8aff 0%, #f1c602ff 100%))',
          borderRadius: 16,
          marginBottom: 24,
          border: 'none',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
              My Learning Journey
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>Continue your language learning progress</Text>
          </Col>
          <Col>
            <img
              src="https://img.freepik.com/free-vector/students-watching-webinar-computer-studying-online_74855-15522.jpg"
              alt="Learning"
              style={{ height: 120, objectFit: 'contain' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
          My Courses
        </Title>
        <Title level={4} style={{ margin: 0, fontWeight: 500, color: '#595959' }}>
          Khóa học tiếng hàn
        </Title>
      </div>

      {/* Search Bar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Input
            placeholder="Search courses..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300, borderRadius: 8 }}
            size="large"
          />
        </Col>
        <Col>
          <Space>
            <Text type="secondary">Total Courses: {courses.length}</Text>
            <Text type="secondary">|</Text>
            <Text type="secondary">In Progress: {courses.filter(c => c.status === 'in-progress').length}</Text>
            <Text type="secondary">|</Text>
            <Text type="secondary">Completed: {courses.filter(c => c.status === 'completed').length}</Text>
          </Space>
        </Col>
      </Row>

      {/* Course Cards Grid */}
      <Row gutter={[24, 24]}>
        {filteredCourses.map(course => (
          <Col key={course.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img
                    alt={course.title}
                    src={course.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    {getStatusTag(course.status)}
                  </div>
                </div>
              }
              style={{ borderRadius: 12, overflow: 'hidden' }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} style={{ marginBottom: 8, minHeight: 48 }}>
                {course.title}
              </Title>

              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space size={16}>
                  <Space size={4}>
                    <BookOutlined style={{ color: '#667eea' }} />
                    <Text type="secondary">
                      Chapters: {course.completedChapters || 0}/{course.totalChapters || 0}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <ClockCircleOutlined style={{ color: '#667eea' }} />
                    <Text type="secondary">Progress: {course.progress}%</Text>
                  </Space>
                </Space>

                {/* Progress Bar */}
                {course.status !== 'not-started' && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, color: '#999' }}>Progress</Text>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: '#667eea' }}>{course.progress}%</Text>
                    </div>
                    <Progress
                      percent={course.progress}
                      strokeColor={{
                        '0%': '#667eea',
                        '100%': '#764ba2',
                      }}
                      showInfo={false}
                      strokeWidth={8}
                    />
                  </div>
                )}

                <Button
                  type="primary"
                  block
                  icon={<PlayCircleOutlined />}
                  onClick={() => navigate(`/dashboard/books/${course.bookId}`)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: 8,
                    height: 40,
                    fontWeight: 500,
                  }}
                >
                  {course.status === 'completed' ? 'Review' : course.status === 'in-progress' ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 12 }}>
          <BookOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#999' }}>
            No courses found
          </Title>
          <Text type="secondary">Try adjusting your search terms</Text>
        </Card>
      )}
    </div>
  );
};

export default MyCourses;
