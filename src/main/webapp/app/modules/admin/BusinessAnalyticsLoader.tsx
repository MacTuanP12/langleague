// Lazy-loaded wrapper for BusinessAnalytics dashboard
// Chart libraries are heavy (~200KB+), so we lazy load them to reduce initial bundle size
import React, { Suspense } from 'react';
import { Spin, Card, Row, Col, Skeleton } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

const BusinessAnalyticsLazy = React.lazy(() => import('./BusinessAnalytics'));

const BusinessAnalyticsLoader: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
          {/* Beautiful Loading State with Skeleton */}
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
            <Row align="middle" justify="center">
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <LineChartOutlined style={{ fontSize: 64, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }} />
                  <Spin size="large" tip="Đang tải dashboard phân tích..." style={{ color: 'white' }} />
                  <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: 14 }}>
                    Đang tải thư viện biểu đồ... Vui lòng đợi trong giây lát
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Skeleton Cards for Metrics */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          </Row>

          {/* Skeleton for Charts */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="📈 Retention Rate">
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="⚠️ Churn Analysis">
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Card title="👥 User Engagement Trend">
              <Skeleton.Image active style={{ width: '100%', height: 300 }} />
            </Card>
          </div>
        </div>
      }
    >
      <BusinessAnalyticsLazy />
    </Suspense>
  );
};

export default BusinessAnalyticsLoader;
