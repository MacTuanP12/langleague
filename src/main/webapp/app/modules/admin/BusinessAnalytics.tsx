import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Progress, Table, Tag, Select, DatePicker, Space, Spin, message } from 'antd';
import {
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { useAppDispatch } from 'app/config/store';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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
      // TODO: Replace with actual API calls
      // const result = await dispatch(getBusinessAnalytics({ startDate, endDate })).unwrap();

      // Mock data for demonstration
      setMetrics({
        dau: 1250,
        wau: 4800,
        mau: 12500,
        retentionRate: { day1: 65, day7: 42, day30: 28 },
        avgSessionDuration: 18.5,
        completionRate: 68.5,
        churnRate: 12.3,
        revenue: { total: 45000, trend: 15.2 },
      });

      // Mock engagement data
      const mockEngagementData: UserEngagementData[] = [];
      for (let i = 29; i >= 0; i--) {
        mockEngagementData.push({
          date: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
          activeUsers: Math.floor(1000 + Math.random() * 500),
          newUsers: Math.floor(50 + Math.random() * 100),
          returningUsers: Math.floor(800 + Math.random() * 400),
        });
      }
      setUserEngagementData(mockEngagementData);

      // Mock chapter performance
      setChapterPerformance([
        { chapterName: 'Chương 1: Giới thiệu', completions: 2840, avgScore: 87.5, dropoffRate: 8.2 },
        { chapterName: 'Chương 2: Từ vựng cơ bản', completions: 2156, avgScore: 82.3, dropoffRate: 12.5 },
        { chapterName: 'Chương 3: Ngữ pháp', completions: 1873, avgScore: 75.8, dropoffRate: 18.7 },
        { chapterName: 'Chương 4: Giao tiếp', completions: 1542, avgScore: 79.2, dropoffRate: 22.4 },
        { chapterName: 'Chương 5: Văn hóa', completions: 1234, avgScore: 85.6, dropoffRate: 28.1 },
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('Không thể tải dữ liệu phân tích');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const engagementChartConfig = {
    data: userEngagementData,
    xField: 'date',
    yField: 'activeUsers',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
    lineStyle: {
      lineWidth: 2,
    },
    xAxis: {
      type: 'time',
      label: {
        formatter: (text: string) => dayjs(text).format('MM/DD'),
      },
    },
  };

  const chapterPerformanceChartConfig = {
    data: chapterPerformance,
    xField: 'chapterName',
    yField: 'completions',
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    color: '#667eea',
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
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
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
    },
  };

  const chapterColumns = [
    {
      title: 'Chương',
      dataIndex: 'chapterName',
      key: 'chapterName',
    },
    {
      title: 'Lượt hoàn thành',
      dataIndex: 'completions',
      key: 'completions',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.completions - b.completions,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Điểm TB',
      dataIndex: 'avgScore',
      key: 'avgScore',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.avgScore - b.avgScore,
      render: (val: number) => <Tag color={val >= 80 ? 'green' : val >= 60 ? 'orange' : 'red'}>{val.toFixed(1)}%</Tag>,
    },
    {
      title: 'Tỷ lệ bỏ dở',
      dataIndex: 'dropoffRate',
      key: 'dropoffRate',
      sorter: (a: ChapterPerformanceData, b: ChapterPerformanceData) => a.dropoffRate - b.dropoffRate,
      render: (val: number) => <span style={{ color: val > 20 ? '#ff4d4f' : val > 10 ? '#faad14' : '#52c41a' }}>{val.toFixed(1)}%</span>,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu phân tích..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            📊 Business Analytics
          </Title>
          <Text type="secondary">Phân tích chi tiết về hoạt động và hiệu quả kinh doanh</Text>
        </Col>
        <Col>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={dates => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="YYYY-MM-DD"
            />
          </Space>
        </Col>
      </Row>

      {/* Key Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="DAU (Daily Active Users)"
              value={metrics.dau}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<RiseOutlined style={{ fontSize: 12 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Người dùng hoạt động hàng ngày
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="WAU / MAU"
              value={`${metrics.wau} / ${metrics.mau}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Người dùng hoạt động tuần/tháng
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Session Duration"
              value={metrics.avgSessionDuration}
              suffix="mins"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thời gian học trung bình/phiên
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={metrics.completionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tỷ lệ hoàn thành khóa học
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Retention & Churn */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="📈 Retention Rate" bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', background: '#f0f5ff' }}>
                  <Statistic title="Day 1" value={metrics.retentionRate.day1} suffix="%" valueStyle={{ color: '#1890ff', fontSize: 24 }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
                  <Statistic title="Day 7" value={metrics.retentionRate.day7} suffix="%" valueStyle={{ color: '#52c41a', fontSize: 24 }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', background: '#fff7e6' }}>
                  <Statistic
                    title="Day 30"
                    value={metrics.retentionRate.day30}
                    suffix="%"
                    valueStyle={{ color: '#faad14', fontSize: 24 }}
                  />
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: 24 }}>
              <Pie {...retentionChartConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="⚠️ Churn Analysis" bordered={false}>
            <Statistic
              title="Churn Rate"
              value={metrics.churnRate}
              suffix="%"
              valueStyle={{ color: metrics.churnRate > 15 ? '#ff4d4f' : '#faad14' }}
              prefix={metrics.churnRate > 15 ? <FallOutlined /> : <RiseOutlined />}
            />
            <Progress percent={metrics.churnRate} strokeColor={metrics.churnRate > 15 ? '#ff4d4f' : '#faad14'} style={{ marginTop: 16 }} />
            <div style={{ marginTop: 24 }}>
              <Title level={5}>Recommended Actions:</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li>Tăng cường email reminder cho người dùng không hoạt động</li>
                <li>Tối ưu onboarding flow để cải thiện Day 1 retention</li>
                <li>Thêm tính năng gamification để tăng engagement</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      {/* User Engagement Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="👥 User Engagement Trend (30 days)" bordered={false}>
            <Line {...engagementChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Chapter Performance */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="📚 Chapter Performance" bordered={false}>
            <Table columns={chapterColumns} dataSource={chapterPerformance} pagination={false} rowKey="chapterName" size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="📊 Completion by Chapter" bordered={false}>
            <Column {...chapterPerformanceChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BusinessAnalytics;
