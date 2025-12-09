import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Tag, Space, Progress, Avatar, Timeline, Button, message } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';
import { useAppDispatch } from 'app/config/store';
import { getAdminStatistics, AdminStatisticsDTO } from 'app/shared/services/learning-report.service';

const { Title, Text } = Typography;

const AdminOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<AdminStatisticsDTO>({});

  // Fetch statistics from API
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const result = await dispatch(getAdminStatistics()).unwrap();
      setStatistics(result);
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      let errorMessage = 'Failed to load statistics';

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check backend';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view statistics';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while loading statistics';
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Extract data with fallbacks
  const userStats = {
    total: statistics.totalUsers || 0,
    active: statistics.activeUsers || 0,
    new: statistics.newUsers || 0,
    growth: statistics.userGrowthRate || 0,
  };

  const courseStats = {
    total: statistics.totalCourses || 0,
    published: statistics.publishedCourses || 0,
    draft: statistics.draftCourses || 0,
    completed: statistics.totalCompletions || 0,
  };

  const recentActivities = statistics.recentActivities || [];
  const userGrowthData = statistics.userGrowthData || [];
  const courseCompletionData = statistics.courseCompletionData || [];

  const userGrowthConfig = {
    data: userGrowthData,
    xField: 'month',
    yField: 'users',
    smooth: true,
    color: '#667eea',
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#667eea',
      },
    },
    lineStyle: {
      lineWidth: 3,
    },
    yAxis: {
      label: {
        formatter(v: string) {
          const num = parseFloat(v);
          return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${num}`;
        },
      },
    },
  };

  const courseCompletionConfig = {
    data: courseCompletionData,
    xField: 'course',
    yField: 'completions',
    color: '#f6c344',
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
  };

  const getActivityColor = (type?: string) => {
    switch (type) {
      case 'CHAPTER_COMPLETED':
        return 'blue';
      case 'EXERCISE_COMPLETED':
        return 'green';
      case 'ACHIEVEMENT_UNLOCKED':
        return 'gold';
      case 'STREAK_MILESTONE':
        return 'orange';
      default:
        return 'default';
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Banner - Academic Style */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
          borderRadius: 12,
          marginBottom: 24,
          border: 'none',
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.15)',
        }}
        styles={{ body: { padding: '40px' } }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title
              level={2}
              style={{ color: 'white', margin: 0, marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}
            >
              Welcome, Admin! 👋
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Overview of LangLeague Platform
            </Text>
          </Col>
          <Col>
            <div
              style={{
                width: 120,
                height: 120,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              📊
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards - Academic Style */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            <Statistic
              title={
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: '#4b5563' }}>
                  Total Users
                </Text>
              }
              value={userStats.total}
              prefix={<UserOutlined style={{ color: '#2c5282' }} />}
              suffix={
                userStats.growth > 0 ? (
                  <Tag color="green" style={{ marginLeft: 8, borderRadius: '6px' }}>
                    +{userStats.growth.toFixed(1)}%
                  </Tag>
                ) : null
              }
              valueStyle={{ color: '#1e3a5f', fontWeight: 600 }}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Active users: {userStats.active}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            <Statistic
              title={
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: '#4b5563' }}>
                  Books
                </Text>
              }
              value={courseStats.total}
              prefix={<BookOutlined style={{ color: '#2c5282' }} />}
              valueStyle={{ color: '#1e3a5f', fontWeight: 600 }}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Published: {courseStats.published} | Draft: {courseStats.draft}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            <Statistic
              title={
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: '#4b5563' }}>
                  Completions
                </Text>
              }
              value={courseStats.completed}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Total lessons completed
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            <Statistic
              title={
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: '#4b5563' }}>
                  New Users
                </Text>
              }
              value={userStats.new}
              prefix={<RiseOutlined style={{ color: '#1e3a5f' }} />}
              suffix={<Text type="secondary">/week</Text>}
              valueStyle={{ color: '#1e3a5f', fontWeight: 600 }}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Growth: +{userStats.growth.toFixed(1)}%
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts - Academic Style */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#2c5282' }} />
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', color: '#1e3a5f' }}>
                  User Growth
                </Text>
              </Space>
            }
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            {!loading && userGrowthData.length > 0 ? (
              <Line key="user-growth-chart" {...userGrowthConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {loading ? 'Loading...' : 'No data available'}
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: '#2c5282' }} />
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', color: '#1e3a5f' }}>
                  Top Books
                </Text>
              </Space>
            }
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            {!loading && courseCompletionData.length > 0 ? (
              <Column key="course-completion-chart" {...courseCompletionConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {loading ? 'Loading...' : 'No data available'}
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Activity Log and Quick Stats - Academic Style */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#2c5282' }} />
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', color: '#1e3a5f' }}>
                  Recent Activity
                </Text>
              </Space>
            }
            extra={
              <Button type="link" onClick={fetchStatistics} style={{ color: '#2c5282', fontFamily: 'Inter, system-ui, sans-serif' }}>
                View All
              </Button>
            }
            style={{ borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            {recentActivities.length > 0 ? (
              <Timeline>
                {recentActivities.map(activity => (
                  <Timeline.Item key={activity.id} dot={<Avatar icon={<TeamOutlined />} size="small" style={{ background: '#667eea' }} />}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>{activity.title}</Text>
                      {activity.description && (
                        <div>
                          <Text type="secondary">{activity.description}</Text>
                        </div>
                      )}
                      <div>
                        <Space size={8}>
                          <Tag
                            color={getActivityColor(activity.type)}
                            style={{ marginTop: 4, borderRadius: '6px', fontFamily: 'Inter, system-ui, sans-serif' }}
                          >
                            {activity.type === 'CHAPTER_COMPLETED'
                              ? 'Chapter'
                              : activity.type === 'EXERCISE_COMPLETED'
                                ? 'Exercise'
                                : activity.type === 'ACHIEVEMENT_UNLOCKED'
                                  ? 'Achievement'
                                  : 'Streak'}
                          </Tag>
                          {activity.points && (
                            <Tag color="gold" style={{ marginTop: 4, borderRadius: '6px' }}>
                              +{activity.points} pts
                            </Tag>
                          )}
                          <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {activity.timestamp}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  No recent activity
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', color: '#1e3a5f' }}>
                  Quick Stats
                </Text>
              </Space>
            }
            style={{ borderRadius: 12, marginBottom: 24, border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            loading={loading}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>Book Completion Rate</Text>
                  <Text strong style={{ float: 'right', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {statistics.completionRate ? `${statistics.completionRate.toFixed(0)}%` : '0%'}
                  </Text>
                </div>
                <Progress percent={statistics.completionRate || 0} strokeColor="#52c41a" strokeWidth={10} />
              </div>

              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>Engagement Rate</Text>
                  <Text strong style={{ float: 'right', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {statistics.engagementRate ? `${statistics.engagementRate.toFixed(0)}%` : '0%'}
                  </Text>
                </div>
                <Progress percent={statistics.engagementRate || 0} strokeColor="#2c5282" strokeWidth={10} />
              </div>

              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>Average Rating</Text>
                  <Text strong style={{ float: 'right', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {statistics.averageRating ? `${statistics.averageRating.toFixed(1)}/5` : '0/5'}
                  </Text>
                </div>
                <Progress percent={(statistics.averageRating || 0) * 20} strokeColor="#f59e0b" strokeWidth={10} />
              </div>

              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>User Retention Rate</Text>
                  <Text strong style={{ float: 'right', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {statistics.retentionRate ? `${statistics.retentionRate.toFixed(0)}%` : '0%'}
                  </Text>
                </div>
                <Progress percent={statistics.retentionRate || 0} strokeColor="#1e3a5f" strokeWidth={10} />
              </div>
            </Space>
          </Card>

          <Card
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(30, 58, 95, 0.15)',
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <Title level={4} style={{ color: 'white', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
                System Running Smoothly
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, system-ui, sans-serif' }}>No warnings or issues</Text>
              <div style={{ marginTop: 16 }}>
                <CheckCircleOutlined style={{ fontSize: 48, color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
