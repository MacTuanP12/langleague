import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Empty, Spin, DatePicker } from 'antd';
import { Column } from '@ant-design/plots';
import { Download, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';
import ChartCard from 'app/shared/components/ChartCard';
import ProgressTimeline, { TimelineItem } from 'app/shared/components/ProgressTimeline';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface MyProgressDTO {
  totalStudyTime?: number;
  totalWords?: number;
  totalGrammars?: number;
  totalExercises?: number;
  booksStarted?: number;
  booksCompleted?: number;
  chaptersCompleted?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalPoints?: number;
  currentLevel?: number;
  recentActivities?: any[];
  weeklyProgress?: any[];
  skillsProgress?: any[];
}

const LearningReports: React.FC = () => {
  const { t } = useTranslation(['reports', 'common']);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<MyProgressDTO>({});
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/learning-reports/my-progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.get('/api/learning-reports/export-pdf', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `learning-report-${dayjs().format('YYYY-MM-DD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const weeklyData = progress.weeklyProgress || [];
  const skillsData = progress.skillsProgress || [];
  const activities: TimelineItem[] = (progress.recentActivities || []).map((a: any) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    timestamp: a.timestamp,
    points: a.points,
  }));

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Learning Reports</Title>
        <Space>
          <RangePicker value={dateRange} onChange={(dates: any) => dates && setDateRange(dates)} />
          <Button type="primary" icon={<Download size={16} />} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </Space>
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
                title="Study Time"
                value={`${Math.floor((progress.totalStudyTime || 0) / 60)}h ${(progress.totalStudyTime || 0) % 60}m`}
                icon={<Clock size={24} />}
                color="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title="Books Completed"
                value={`${progress.booksCompleted || 0} / ${progress.booksStarted || 0}`}
                icon={<BookOpen size={24} />}
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard
                title="Current Streak"
                value={`${progress.currentStreak || 0} days`}
                icon={<TrendingUp size={24} />}
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ChartCard title="Total Points" value={progress.totalPoints || 0} icon={<Trophy size={24} />} color="#722ed1" />
            </Col>
          </Row>

          {/* Weekly Progress Chart */}
          <Card title="Weekly Progress">
            {weeklyData.length > 0 ? (
              <Column data={weeklyData} xField="label" yField="value" color="#1890ff" columnStyle={{ radius: [8, 8, 0, 0] }} height={300} />
            ) : (
              <Empty description="No data available" />
            )}
          </Card>

          {/* Skills Progress */}
          <Card title="Skills Progress">
            {skillsData.length > 0 ? (
              <Row gutter={[16, 16]}>
                {skillsData.map((skill: any) => (
                  <Col xs={24} md={12} key={skill.skill}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>{skill.skill}</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '24px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${skill.percent || 0}%`,
                              height: '100%',
                              backgroundColor: '#1890ff',
                              borderRadius: '12px',
                            }}
                          />
                        </div>
                        <Text type="secondary">{skill.percent || 0}%</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {skill.completed || 0} / {skill.total || 0} completed
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description={t('reports.messages.noData')} />
            )}
          </Card>

          {/* Recent Activities */}
          <Card title={t('reports.history.title')}>
            {activities.length > 0 ? <ProgressTimeline items={activities} /> : <Empty description={t('reports.messages.noData')} />}
          </Card>
        </Space>
      )}
    </div>
  );
};

export default LearningReports;
