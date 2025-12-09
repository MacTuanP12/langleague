import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Select, Space, Empty, Spin } from 'antd';
import { Line, Pie, Column } from '@ant-design/plots';
import { Target, TrendingUp, Award, Clock } from 'lucide-react';
import axios from 'axios';
import ChartCard from 'app/shared/components/ChartCard';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Option } = Select;

interface ExerciseStats {
  totalExercises?: number;
  completedExercises?: number;
  averageScore?: number;
  totalTimeSpent?: number;
  exercisesByType?: any[];
  performanceOverTime?: any[];
  scoreDistribution?: any[];
}

const ExerciseAnalytics: React.FC = () => {
  const { t } = useTranslation(['analytics', 'common']);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExerciseStats>({});
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/exercise-results/analytics', {
        params: { days: timeRange },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Mock data for demo
      setStats({
        totalExercises: 120,
        completedExercises: 95,
        averageScore: 82.5,
        totalTimeSpent: 1450,
        exercisesByType: [
          { type: 'Listening', value: 35 },
          { type: 'Reading', value: 30 },
          { type: 'Writing', value: 20 },
          { type: 'Speaking', value: 15 },
        ],
        performanceOverTime: [
          { date: '2024-11-01', score: 75 },
          { date: '2024-11-08', score: 78 },
          { date: '2024-11-15', score: 80 },
          { date: '2024-11-22', score: 82 },
          { date: '2024-11-29', score: 85 },
        ],
        scoreDistribution: [
          { range: '0-20', count: 2 },
          { range: '21-40', count: 5 },
          { range: '41-60', count: 15 },
          { range: '61-80', count: 38 },
          { range: '81-100', count: 35 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalExercises && stats.completedExercises ? (stats.completedExercises / stats.totalExercises) * 100 : 0;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>{t('analytics.title')}</Title>
        <Select value={timeRange} onChange={setTimeRange} style={{ width: 150 }}>
          <Option value="7">{t('analytics.period.last7days')}</Option>
          <Option value="30">{t('analytics.period.last30days')}</Option>
          <Option value="90">{t('analytics.period.last90days')}</Option>
          <Option value="365">{t('analytics.period.lastYear')}</Option>
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Stats Overview */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title={t('analytics.overview.totalExercises')}
                value={stats.totalExercises || 0}
                icon={<Target size={24} />}
                color="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title={t('analytics.overview.completionRate')}
                value={`${completionRate.toFixed(1)}%`}
                icon={<TrendingUp size={24} />}
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title={t('analytics.overview.averageScore')}
                value={`${(stats.averageScore || 0).toFixed(1)}%`}
                icon={<Award size={24} />}
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title={t('analytics.overview.timeSpent')}
                value={`${Math.floor((stats.totalTimeSpent || 0) / 60)}h ${(stats.totalTimeSpent || 0) % 60}m`}
                icon={<Clock size={24} />}
                color="#722ed1"
              />
            </Col>
          </Row>

          {/* Charts */}
          <Row gutter={[16, 16]}>
            {/* Performance Over Time */}
            <Col xs={24} lg={16}>
              <Card title={t('analytics.charts.performanceOverTime')}>
                {stats.performanceOverTime && stats.performanceOverTime.length > 0 ? (
                  <Line
                    data={stats.performanceOverTime}
                    xField="date"
                    yField="score"
                    color="#1890ff"
                    point={{ size: 5, shape: 'circle' }}
                    height={300}
                    yAxis={{
                      min: 0,
                      max: 100,
                      title: { text: 'Score (%)' },
                    }}
                    xAxis={{
                      title: { text: 'Date' },
                    }}
                  />
                ) : (
                  <Empty description={t('analytics.messages.noData')} />
                )}
              </Card>
            </Col>
            {/* Exercises by Type */}
            <Col xs={24} lg={8}>
              <Card title={t('analytics.charts.exercisesByType')}>
                {stats.exercisesByType && stats.exercisesByType.length > 0 ? (
                  <Pie
                    data={stats.exercisesByType}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} {percentage}',
                    }}
                    height={300}
                  />
                ) : (
                  <Empty description={t('analytics.messages.noData')} />
                )}
              </Card>
            </Col>
          </Row>

          {/* Score Distribution */}
          <Card title={t('analytics.charts.scoreDistribution')}>
            {stats.scoreDistribution && stats.scoreDistribution.length > 0 ? (
              <Column
                data={stats.scoreDistribution}
                xField="range"
                yField="count"
                color="#52c41a"
                columnStyle={{ radius: [8, 8, 0, 0] }}
                height={300}
                yAxis={{
                  title: { text: t('analytics.axis.numberOfExercises') },
                }}
                xAxis={{
                  title: { text: t('analytics.axis.scoreRange') },
                }}
              />
            ) : (
              <Empty description={t('analytics.messages.noData')} />
            )}
          </Card>
        </Space>
      )}
    </div>
  );
};

export default ExerciseAnalytics;
