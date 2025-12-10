import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Progress, Table, Tag, DatePicker, Space, Spin, message } from 'antd';
import {
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { useAppDispatch } from 'app/config/store';
import dayjs from 'dayjs';
import { getBusinessAnalytics } from 'app/shared/services/business-analytics.service';
import * as ds from 'app/shared/styles/design-system';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface BusinessMetrics {
  dau: number;
  wau: number;
  mau: number;
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
  };
  avgSessionDuration: number;
  completionRate: number;
  churnRate: number;
  revenue: {
    total: number;
    trend: number;
  };
}

interface UserEngagementData {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

interface ChapterPerformanceData {
  chapterName: string;
  completions: number;
  avgScore: number;
  dropoffRate: number;
}

const BusinessAnalytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    dau: 0,
    wau: 0,
    mau: 0,
    retentionRate: { day1: 0, day7: 0, day30: 0 },
    avgSessionDuration: 0,
    completionRate: 0,
    churnRate: 0,
    revenue: { total: 0, trend: 0 },
  });

  const [userEngagementData, setUserEngagementData] = useState<UserEngagementData[]>([]);
  const [chapterPerformance, setChapterPerformance] = useState<ChapterPerformanceData[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(30, 'days'), dayjs()]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange.map(date => date.format('YYYY-MM-DD'));
      const result = await dispatch(getBusinessAnalytics({ startDate, endDate })).unwrap();

      setMetrics(result.metrics);
      setUserEngagementData(result.userEngagementData);
      setChapterPerformance(result.chapterPerformance);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('Không thể tải dữ liệu phân tích');
    } finally {
      setLoading(false);
    }
  };

  const engagementChartConfig = {
    data: userEngagementData,
    xField: 'date',
    yField: 'activeUsers',
    seriesField: 'type',
    smooth: true,
    color: [ds.colors.info, ds.colors.success, ds.colors.warning],
    lineStyle: { lineWidth: 2 },
    xAxis: {
      label: { formatter: (text: string) => dayjs(text).format('MM/DD') },
    },
  };

  const chapterPerformanceChartConfig = {
    data: chapterPerformance,
    xField: 'chapterName',
    yField: 'completions',
    color: ds.colors.primary.DEFAULT,
    columnStyle: { radius: [ds.borderRadius.sm, ds.borderRadius.sm, 0, 0] },
  };

  const retentionData = [
    { period: 'Day 1', rate: metrics.retentionRate.day1 },
    { period: 'Day 7', rate: metrics.retentionRate.day7 },
    { period: 'Day 30', rate: metrics.retentionRate.day30 },
  ];

  const retentionChartConfig = {
    data: retentionData,
    angleField: 'rate',
    colorField: 'period',
    radius: 0.8,
    innerRadius: 0.6,
    color: [ds.colors.info, ds.colors.success, ds.colors.warning],
    label: { content: '{value}%', style: { textAlign: 'center', fontSize: 14, fill: ds.colors.text.white } },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
  };

  const chapterColumns = [
    { title: 'Chương', dataIndex: 'chapterName', key: 'chapterName' },
    {
      title: 'Lượt hoàn thành',
      dataIndex: 'completions',
      key: 'completions',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.completions - b.completions,
    },
    {
      title: 'Điểm TB',
      dataIndex: 'avgScore',
      key: 'avgScore',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.avgScore - b.avgScore,
      render: (val: number) => <Tag color={val >= 80 ? 'success' : val >= 60 ? 'warning' : 'error'}>{val.toFixed(1)}%</Tag>,
    },
    {
      title: 'Tỷ lệ bỏ dở',
      dataIndex: 'dropoffRate',
      key: 'dropoffRate',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.dropoffRate - b.dropoffRate,
      render: (val: number) => <Text type={val > 20 ? 'danger' : val > 10 ? 'warning' : 'secondary'}>{val.toFixed(1)}%</Text>,
    },
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" tip="Đang tải dữ liệu phân tích..." /></div>;
  }

  return (
    <div style={ds.pageContainerStyle}>
      <Row justify="space-between" align="middle" style={{ marginBottom: ds.spacing.lg }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: ds.colors.text.primary }}>
            <BarChartOutlined style={{ marginRight: ds.spacing.sm, color: ds.colors.admin.solid }} />
            Business Analytics
          </Title>
          <Text type="secondary">Phân tích chi tiết về hoạt động và hiệu quả kinh doanh</Text>
        </Col>
        <Col>
          <RangePicker value={dateRange} onChange={dates => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} format="YYYY-MM-DD" size="large" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: ds.spacing.lg }}>
        {[ // Metric cards
          { title: "DAU", value: metrics.dau, icon: <UserOutlined />, color: ds.colors.success, change: <RiseOutlined /> },
          { title: "WAU / MAU", value: `${metrics.wau} / ${metrics.mau}`, icon: <UserOutlined />, color: ds.colors.info },
          { title: "Avg Session (mins)", value: metrics.avgSessionDuration, icon: <ClockCircleOutlined />, color: '#722ed1' }, // custom for purple
          { title: "Completion Rate", value: metrics.completionRate, suffix: '%', icon: <TrophyOutlined />, color: ds.colors.success },
        ].map(item => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card style={ds.cardBaseStyle}>
              <Statistic title={item.title} value={item.value} prefix={item.icon} suffix={item.suffix} valueStyle={{ color: item.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: ds.spacing.lg }}>
        <Col xs={24} lg={12}>
          <Card title="📈 Retention Rate" style={ds.cardBaseStyle}>
            <Pie {...retentionChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="⚠️ Churn Analysis" style={ds.cardBaseStyle}>
            <Statistic
              title="Churn Rate"
              value={metrics.churnRate}
              suffix="%"
              valueStyle={{ color: metrics.churnRate > 15 ? ds.colors.error : ds.colors.warning }}
              prefix={metrics.churnRate > 15 ? <FallOutlined /> : <RiseOutlined />}
            />
            <Progress percent={metrics.churnRate} strokeColor={metrics.churnRate > 15 ? ds.colors.error : ds.colors.warning} style={{ marginTop: ds.spacing.md }} />
            <div style={{ marginTop: ds.spacing.lg }}>
              <Title level={5}>Recommended Actions:</Title>
              <ul style={{ paddingLeft: 20, color: ds.colors.text.secondary }}>
                <li>Tăng cường email reminder cho người dùng không hoạt động</li>
                <li>Tối ưu onboarding flow để cải thiện Day 1 retention</li>
                <li>Thêm tính năng gamification để tăng engagement</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="👥 User Engagement Trend" style={{ ...ds.cardBaseStyle, marginBottom: ds.spacing.lg }}>
        <Line {...engagementChartConfig} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="📚 Chapter Performance" style={ds.cardBaseStyle}>
            <Table columns={chapterColumns} dataSource={chapterPerformance} pagination={false} rowKey="chapterName" size="middle" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="📊 Completion by Chapter" style={ds.cardBaseStyle}>
            <Column {...chapterPerformanceChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BusinessAnalytics;
