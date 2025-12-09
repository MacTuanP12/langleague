import * as React from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Form, Input, Button, Row, Col, Card, Typography } from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  FacebookFilled,
  LinkedinFilled,
  TwitterOutlined,
  PinterestOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    form.resetFields();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)' }}>
      <div
        style={{
          background: 'linear-gradient(to right, #2563eb, #3b82f6, #60a5fa)',
          color: 'white',
          padding: '80px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Title level={1} style={{ color: 'white', fontSize: '3.5rem', marginBottom: 24, fontWeight: 'bold' }}>
            Get in Touch
          </Title>
          <Text style={{ fontSize: '1.25rem', color: '#dbeafe', display: 'block', maxWidth: 700, margin: '0 auto' }}>
            Feel free to contact us any time, we will get back to you as soon as we can!
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', marginTop: -64 }}>
        <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  padding: 20,
                  borderRadius: 16,
                  display: 'inline-block',
                  marginBottom: 24,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                <PhoneOutlined style={{ fontSize: 48, color: 'white' }} />
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>
                Give us a call
              </Title>
              <Text style={{ display: 'block', fontSize: 16, color: '#6b7280' }}>+12 4850 123</Text>
              <Text style={{ display: 'block', fontSize: 16, color: '#6b7280' }}>+14 5689 463</Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  padding: 20,
                  borderRadius: 16,
                  display: 'inline-block',
                  marginBottom: 24,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                <EnvironmentOutlined style={{ fontSize: 48, color: 'white' }} />
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>
                Our main office
              </Title>
              <Text style={{ display: 'block', fontSize: 16, color: '#6b7280' }}>Agiou Markou 15,</Text>
              <Text style={{ display: 'block', fontSize: 16, color: '#6b7280' }}>Athina 165 61, UK</Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  padding: 20,
                  borderRadius: 16,
                  display: 'inline-block',
                  marginBottom: 24,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                <MailOutlined style={{ fontSize: 48, color: 'white' }} />
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>
                Send us a email
              </Title>
              <Text style={{ display: 'block', fontSize: 16, color: '#6b7280' }}>mail@speakup.com</Text>
            </Card>
          </Col>
        </Row>

        <Card
          style={{
            marginBottom: 64,
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: 'linear-gradient(to right, #eff6ff, white)', padding: '48px 24px' }}>
            <Title
              level={2}
              style={{
                textAlign: 'center',
                background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 12,
              }}
            >
              How May We Help You!
            </Title>
            <Text style={{ display: 'block', textAlign: 'center', color: '#6b7280', marginBottom: 40 }}>
              We'd love to hear from you. Send us a message!
            </Text>

            <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 800, margin: '0 auto' }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input placeholder="Name" size="large" style={{ borderRadius: 8, padding: '12px 16px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input placeholder="Email" size="large" style={{ borderRadius: 8, padding: '12px 16px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="subject" rules={[{ required: true, message: 'Please enter subject' }]}>
                <Input placeholder="Subject" size="large" style={{ borderRadius: 8, padding: '12px 16px' }} />
              </Form.Item>

              <Form.Item name="message" rules={[{ required: true, message: 'Please enter your message' }]}>
                <TextArea placeholder="Write your problem..." rows={6} style={{ borderRadius: 8, padding: '12px 16px' }} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    height: 'auto',
                    padding: '14px 48px',
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 12,
                    background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <Card
          style={{
            marginBottom: 64,
            overflow: 'hidden',
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ width: '100%', height: 500 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841841841844!2d-73.98823492346166!3d40.74844097138796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
          </div>
        </Card>
      </div>

      <footer style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb, #3b82f6)', color: 'white', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <div>
                <Title level={3} style={{ color: 'white', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🌐
                  </div>
                  LangLeague
                </Title>
                <Text style={{ color: '#dbeafe', fontSize: 14, lineHeight: 1.6, display: 'block', marginBottom: 16 }}>
                  Expand your skills, know more do more, move forward reach the importance and life conversations
                </Text>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {[FacebookFilled, LinkedinFilled, TwitterOutlined, PinterestOutlined].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      style={{
                        width: 40,
                        height: 40,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Icon style={{ fontSize: 18, color: 'white' }} />
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <Title level={4} style={{ color: 'white', marginBottom: 24 }}>
                Speak up courses
              </Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Learn English', 'Learn Spanish', 'Learn French'].map(course => (
                  <li key={course} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: '#dbeafe', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#93c5fd' }}>▸</span>
                      {course}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={24} md={6}>
              <Title level={4} style={{ color: 'white', marginBottom: 24 }}>
                Products
              </Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Looking page', 'About us', 'Contact us'].map(product => (
                  <li key={product} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: '#dbeafe', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#93c5fd' }}>▸</span>
                      {product}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={24} md={6}>
              <Title level={4} style={{ color: 'white', marginBottom: 24 }}>
                Contact Information
              </Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { icon: '📞', text: '+5461297846' },
                  { icon: '✉️', text: 'info@speakup.us' },
                  { icon: '📍', text: 'Kemerboz, Of de Umekag' },
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Text style={{ color: '#dbeafe', fontSize: 14 }}>{item.text}</Text>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              marginTop: 48,
              paddingTop: 32,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Text style={{ color: '#dbeafe', fontSize: 14 }}>© 2023 Speakup. All Rights Reserved.</Text>
            <div style={{ display: 'flex', gap: 32 }}>
              <a href="#" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: 14 }}>
                Terms & Conditions
              </a>
              <a href="#" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: 14 }}>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
