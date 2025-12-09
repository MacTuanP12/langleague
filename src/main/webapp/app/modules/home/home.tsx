import * as React from 'react';
import { Button, Row, Col, Card, Typography, Space, Statistic, Avatar } from 'antd';
import {
  RocketOutlined,
  TrophyOutlined,
  GlobalOutlined,
  StarFilled,
  PlayCircleOutlined,
  ArrowRightOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
// Import logo from content so webpack will bundle it correctly
const logo = '/content/images/logo.png';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: <BookOutlined style={{ fontSize: '40px', color: '#667eea' }} />,
      title: t('home.features.learnThroughBooks.title'),
      description: t('home.features.learnThroughBooks.description'),
    },
    {
      icon: <RocketOutlined style={{ fontSize: '40px', color: '#f6c344' }} />,
      title: t('home.features.aiAnalysis.title'),
      description: t('home.features.aiAnalysis.description'),
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '40px', color: '#e85b8a' }} />,
      title: t('home.features.fourSkills.title'),
      description: t('home.features.fourSkills.description'),
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '40px', color: '#5b8dee' }} />,
      title: t('home.features.trackProgress.title'),
      description: t('home.features.trackProgress.description'),
    },
  ];

  const bookSamples = [
    {
      title: '82년생 김지영',
      subtitle: '조남주 (Cho Nam-joo)',
      level: t('home.books.levels.intermediate'),
      chapters: t('home.books.chapters', { count: 12 }),
      learners: '3,450',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      color: '#667eea',
    },
    {
      title: '미움받을 용기',
      subtitle: '기시미 이치로 (Kishimi Ichiro)',
      level: t('home.books.levels.beginner'),
      chapters: t('home.books.chapters', { count: 15 }),
      learners: '5,890',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      color: '#5b8dee',
    },
    {
      title: '아몬드',
      subtitle: '손원평 (Son Won-pyung)',
      level: t('home.books.levels.advanced'),
      chapters: t('home.books.chapters', { count: 8 }),
      learners: '2,120',
      image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
      color: '#e85b8a',
    },
  ];

  const testimonials = [
    {
      name: t('home.testimonials.student1.name'),
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: t('home.testimonials.student1.role'),
      content: t('home.testimonials.student1.content'),
      rating: 5,
    },
    {
      name: t('home.testimonials.student2.name'),
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: t('home.testimonials.student2.role'),
      content: t('home.testimonials.student2.content'),
      rating: 5,
    },
    {
      name: t('home.testimonials.student3.name'),
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: t('home.testimonials.student3.role'),
      content: t('home.testimonials.student3.content'),
      rating: 5,
    },
  ];

  return (
    <div style={{ background: '#ffffff' }}>
      {/* Header/Navigation */}
      <header
        style={{
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: windowWidth <= 768 ? '16px 20px' : '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={logo}
              alt="Langleague Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <Title level={4} style={{ margin: 0, fontSize: windowWidth <= 768 ? '18px' : '20px' }}>
              Langleague
            </Title>
          </div>

          {windowWidth > 768 && (
            <Space size="large">
              <a href="#features" style={{ color: '#262626', textDecoration: 'none' }}>
                {t('home.nav.features')}
              </a>
              <a href="#courses" style={{ color: '#262626', textDecoration: 'none' }}>
                {t('home.nav.courses')}
              </a>
              <a href="#testimonials" style={{ color: '#262626', textDecoration: 'none' }}>
                {t('home.nav.testimonials')}
              </a>
            </Space>
          )}

          <Space>
            <Button onClick={() => navigate('/login')}>{t('home.nav.login')}</Button>
            <Button
              type="primary"
              onClick={() => navigate('/register')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #081edfff 100%)',
                border: 'none',
              }}
            >
              {t('home.nav.signup')}
            </Button>
          </Space>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #081edfff 100%)',
          padding: windowWidth <= 768 ? '60px 20px' : '100px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <div>
                  <Title
                    level={1}
                    style={{
                      color: 'white',
                      fontSize: windowWidth <= 768 ? '32px' : '56px',
                      marginBottom: '16px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {t('home.hero.title')}
                    <br />
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {t('home.hero.subtitle')}
                    </span>
                  </Title>
                  <Paragraph
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: windowWidth <= 768 ? '16px' : '18px',
                      marginBottom: 0,
                    }}
                  >
                    {t('home.hero.description')}
                  </Paragraph>
                </div>

                <Space size="middle" style={{ flexWrap: 'wrap' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate('/register')}
                    style={{
                      height: '56px',
                      padding: '0 40px',
                      fontSize: '16px',
                      fontWeight: 600,
                      background: 'white',
                      color: '#667eea',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    {t('home.hero.startButton')}
                  </Button>
                  <Button
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate('/login')}
                    style={{
                      height: '56px',
                      padding: '0 40px',
                      fontSize: '16px',
                      fontWeight: 600,
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid white',
                      borderRadius: '8px',
                    }}
                  >
                    {t('home.hero.libraryButton')}
                  </Button>
                </Space>

                <Row gutter={32} style={{ marginTop: '24px' }}>
                  <Col>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('home.hero.stats.students')}</span>}
                      value="5,000+"
                      valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 700 }}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('home.hero.stats.books')}</span>}
                      value="500+"
                      valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 700 }}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('home.hero.stats.satisfaction')}</span>}
                      value="98%"
                      valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 700 }}
                    />
                  </Col>
                </Row>
              </Space>
            </Col>

            <Col xs={24} lg={12}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                  alt="Learning"
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: windowWidth <= 768 ? '60px 20px' : '100px 40px',
          background: '#fafafa',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ fontSize: windowWidth <= 768 ? '28px' : '40px' }}>
              {t('home.features.title')}
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959', maxWidth: '600px', margin: '0 auto' }}>
              {t('home.features.subtitle')}
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    height: '100%',
                    textAlign: 'center',
                  }}
                  styles={{ body: { padding: '40px 24px' } }}
                >
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4} style={{ margin: 0 }}>
                      {feature.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {feature.description}
                    </Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        style={{
          padding: windowWidth <= 768 ? '60px 20px' : '100px 40px',
          background: 'white',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ fontSize: windowWidth <= 768 ? '28px' : '40px' }}>
              {t('home.books.title')}
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959' }}>{t('home.books.subtitle')}</Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {bookSamples.map((course, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        height: '240px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <StarFilled style={{ color: '#fadb14', fontSize: '16px' }} />
                        {/* <Text strong>{course.rating}</Text> */}
                      </div>
                    </div>
                  }
                  style={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {course.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: '18px' }}>
                        {course.subtitle}
                      </Text>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {course.level}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {course.chapters}
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/register')}
                      style={{
                        background: course.color,
                        border: 'none',
                        borderRadius: '8px',
                        marginTop: '8px',
                      }}
                    >
                      {t('home.books.startLearning')}
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        style={{
          padding: windowWidth <= 768 ? '60px 20px' : '100px 40px',
          background: '#fafafa',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ fontSize: windowWidth <= 768 ? '28px' : '40px' }}>
              {t('home.testimonials.title')}
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959' }}>{t('home.testimonials.subtitle')}</Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  style={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    height: '100%',
                  }}
                  styles={{ body: { padding: '32px' } }}
                >
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled key={i} style={{ color: '#fadb14', fontSize: '18px' }} />
                      ))}
                    </div>

                    <Paragraph style={{ fontSize: '15px', color: '#595959', lineHeight: 1.8 }}>"{testimonial.content}"</Paragraph>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <Avatar src={testimonial.avatar} size={48} />
                      <div>
                        <Text strong style={{ display: 'block' }}>
                          {testimonial.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {testimonial.role}
                        </Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #081edfff 100%)',
          padding: windowWidth <= 768 ? '60px 20px' : '80px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Title
              level={2}
              style={{
                color: 'white',
                fontSize: windowWidth <= 768 ? '28px' : '40px',
                marginBottom: 0,
              }}
            >
              {t('home.cta.title')}
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: 0 }}>{t('home.cta.description')}</Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/register')}
              style={{
                height: '56px',
                padding: '0 48px',
                fontSize: '16px',
                fontWeight: 600,
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              {t('home.cta.button')}
            </Button>
          </Space>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#001529',
          color: 'white',
          padding: windowWidth <= 768 ? '40px 20px 20px' : '60px 40px 30px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <Space direction="vertical" size={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={logo}
                    alt="Langleague Logo"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                  <Title level={4} style={{ margin: 0, color: 'white' }}>
                    Langleague
                  </Title>
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>{t('home.footer.description')}</Text>
              </Space>
            </Col>

            <Col xs={12} sm={6} lg={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.footer.courses')}
              </Title>
              <Space direction="vertical">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.learnKorean')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.learnEnglish')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.learnJapanese')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.learnChinese')}
                </a>
              </Space>
            </Col>

            <Col xs={12} sm={6} lg={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.footer.company')}
              </Title>
              <Space direction="vertical">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.aboutUs')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.contact')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.careers')}
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('home.footer.blog')}
                </a>
              </Space>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                {t('home.footer.contactTitle')}
              </Title>
              <Space direction="vertical">
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>📞 +34 833 478 486</Text>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>✉️ info@langleague.com</Text>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>📍 Barcelona, Spain</Text>
              </Space>
            </Col>
          </Row>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              marginTop: '40px',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.45)' }}>{t('home.footer.copyright')}</Text>
            <Space>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('home.footer.terms')}
              </a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('home.footer.privacy')}
              </a>
            </Space>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
