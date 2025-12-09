import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Typography, Row, Col, Tag, Tabs, Radio, Space, Input } from 'antd';
import {
  CheckCircleOutlined,
  LockOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  ReadOutlined,
  AudioOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { getWordsByChapter } from '../../shared/services/word.service';
import { getGrammarsByChapter } from '../../shared/services/grammar.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Exercise {
  id: number;
  type: 'listening' | 'reading' | 'speaking' | 'writing';
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  timeLimit?: string;
  difficulty?: string;
}

const ChapterExercise: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showOverview, setShowOverview] = useState(true);
  const [activeTab, setActiveTab] = useState('listening');
  const [vocabularyListState, setVocabularyListState] = useState<Array<any>>([]);
  const [grammarListState, setGrammarListState] = useState<Array<any>>([]);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [loadingGrammar, setLoadingGrammar] = useState(false);
  const params = useParams();
  const chapterId = params.id ? parseInt(params.id, 10) : undefined;

  const exercises: Exercise[] = [
    // Listening exercises
    {
      id: 1,
      type: 'listening',
      title: 'Nghe & Chọn đáp án',
      description: 'Nghe đoạn hội thoại và chọn đáp án đúng (Câu 1/5)',
      status: 'in-progress',
      progress: 60,
      timeLimit: '00:00 / 00:12',
      difficulty: 'CEFR A2',
    },
    {
      id: 2,
      type: 'listening',
      title: 'Nghe & Điền từ còn thiếu',
      description: 'Điền 2 chữ trống',
      status: 'completed',
      difficulty: 'Intermediate',
    },
    {
      id: 3,
      type: 'listening',
      title: 'Nghe chép chính tả (30s)',
      description: 'Nghe tối đa 2 lần. Viết lại chính xác nội dung.',
      status: 'locked',
    },
    // Reading exercises
    {
      id: 4,
      type: 'reading',
      title: 'Read & Answer Questions',
      description: 'Read the passage and answer comprehension questions',
      status: 'completed',
      progress: 100,
    },
    {
      id: 5,
      type: 'reading',
      title: 'Read & Fill Blanks',
      description: 'Complete the text with missing words',
      status: 'in-progress',
      progress: 45,
    },
    // Speaking exercises
    {
      id: 6,
      type: 'speaking',
      title: 'Pronunciation Practice',
      description: 'Practice speaking with native pronunciation',
      status: 'in-progress',
      progress: 30,
    },
    {
      id: 7,
      type: 'speaking',
      title: 'Conversation Practice',
      description: 'Role-play conversation scenarios',
      status: 'locked',
    },
    // Writing exercises
    {
      id: 8,
      type: 'writing',
      title: 'Write a Paragraph',
      description: 'Write about your daily routine',
      status: 'in-progress',
      progress: 20,
    },
    {
      id: 9,
      type: 'writing',
      title: 'Grammar Practice',
      description: 'Complete sentences with correct grammar',
      status: 'locked',
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Tag color="success" style={{ borderRadius: 12, padding: '4px 12px', fontSize: 12 }}>
          <CheckCircleOutlined /> Completed
        </Tag>
      );
    }
    if (status === 'in-progress') {
      return (
        <Tag color="processing" style={{ borderRadius: 12, padding: '4px 12px', fontSize: 12 }}>
          <PlayCircleOutlined /> In Progress
        </Tag>
      );
    }
    return (
      <Tag color="default" style={{ borderRadius: 12, padding: '4px 12px', fontSize: 12 }}>
        <LockOutlined /> Locked
      </Tag>
    );
  };

  const getActionButton = (exercise: Exercise) => {
    if (exercise.status === 'completed') {
      return (
        <Button size="large" style={{ width: '100%', borderRadius: 8, height: 44 }}>
          <CheckCircleOutlined /> Review
        </Button>
      );
    }
    if (exercise.status === 'in-progress') {
      return (
        <Button type="primary" size="large" style={{ width: '100%', borderRadius: 8, height: 44, background: '#667eea' }}>
          <PlayCircleOutlined /> Continue
        </Button>
      );
    }
    return (
      <Button disabled size="large" style={{ width: '100%', borderRadius: 8, height: 44 }}>
        <LockOutlined /> Locked
      </Button>
    );
  };

  const renderListeningStats = () => (
    <Card style={{ borderRadius: 12, background: '#f8f9ff' }} bodyStyle={{ padding: 16 }}>
      <Title level={5} style={{ marginBottom: 16, fontSize: 16 }}>
        📊 Tiến độ Listening
      </Title>
      <Text style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 16 }}>Chỉ số hiện tại</Text>
      <Row gutter={16}>
        <Col span={6}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#667eea', margin: 0 }}>
              40%
            </Title>
            <Text style={{ fontSize: 12, color: '#999' }}>Hoàn thành</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
              85%
            </Title>
            <Text style={{ fontSize: 12, color: '#999' }}>Độ chính xác</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
              18
            </Title>
            <Text style={{ fontSize: 12, color: '#999' }}>XP earned</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#fa8c16', margin: 0 }}>
              5
            </Title>
            <Text style={{ fontSize: 12, color: '#999' }}>Ngày streak</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderExerciseExample = () => {
    if (activeTab === 'listening') {
      return (
        <Card style={{ borderRadius: 12, marginTop: 24 }} bodyStyle={{ padding: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 8 }}>
              🎧 Nghe & Chọn đáp án
            </Title>
            <Text type="secondary">Nghe đoạn hội thoại và chọn đáp án đúng (Câu 1/5)</Text>
          </div>

          <div style={{ background: '#f5f5f5', padding: 24, borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
            <Button type="primary" size="large" icon={<PlayCircleOutlined />} style={{ marginBottom: 12 }}>
              ▶ Phát
            </Button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
              <Text style={{ fontSize: 13 }}>CEFR A2</Text>
              <Text style={{ fontSize: 13 }}>00:00 / 00:12</Text>
              <Text style={{ fontSize: 13 }}>🔊 5a</Text>
            </div>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Radio.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Radio value="A" style={{ width: '100%', padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  A. He went to the park.
                </Radio>
                <Radio value="B" style={{ width: '100%', padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  B. He is at the office.
                </Radio>
                <Radio value="C" style={{ width: '100%', padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  C. He will go tomorrow.
                </Radio>
                <Radio value="D" style={{ width: '100%', padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  D. He likes the beach.
                </Radio>
              </Space>
            </Radio.Group>
          </Space>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button size="large" style={{ borderRadius: 8 }}>
                💡 Gợi ý
              </Button>
              <Button type="primary" size="large" style={{ borderRadius: 8, background: '#667eea' }}>
                Xác nhận
              </Button>
            </Space>
          </div>
        </Card>
      );
    }
    return null;
  };

  const filteredExercises = exercises.filter(ex => ex.type === activeTab);

  const tabItems = [
    {
      key: 'listening',
      label: (
        <span>
          <SoundOutlined /> Listening
        </span>
      ),
    },
    {
      key: 'reading',
      label: (
        <span>
          <ReadOutlined /> Reading
        </span>
      ),
    },
    {
      key: 'speaking',
      label: (
        <span>
          <AudioOutlined /> Speaking
        </span>
      ),
    },
    {
      key: 'writing',
      label: (
        <span>
          <EditOutlined /> Writing
        </span>
      ),
    },
    {
      key: 'vocabulary',
      label: (
        <span>
          <UnorderedListOutlined /> Vocabulary
        </span>
      ),
    },
    {
      key: 'grammar',
      label: (
        <span>
          <BookOutlined /> Grammar
        </span>
      ),
    },
  ];

  // Fallback vocabulary and grammar data (used if API not available)
  const fallbackVocabulary = [
    { id: 1, word: '아침', meaning: 'morning', example: '아침에 운동해요.' },
    { id: 2, word: '저녁', meaning: 'evening', example: '저녁을 먹었어요.' },
    { id: 3, word: '학교', meaning: 'school', example: '학교에 갑니다.' },
  ];

  const fallbackGrammar = [
    {
      id: 1,
      title: '-습니다 / -ㅂ니다 (formal polite)',
      explanation: 'Dùng ở văn viết, thể hiện sự trang trọng.',
      example: '갑니다 = go (formal)',
    },
    { id: 2, title: '-아/어/여요 (polite)', explanation: 'Dùng trong hội thoại lịch sự.', example: '가요 = go (polite)' },
    { id: 3, title: '~고 있다 (progressive)', explanation: 'Diễn tả hành động đang diễn ra.', example: '공부하고 있어요 = am studying' },
  ];

  useEffect(() => {
    if (!showOverview && chapterId) {
      if (activeTab === 'vocabulary') {
        loadVocabulary(chapterId);
      }
      if (activeTab === 'grammar') {
        loadGrammar(chapterId);
      }
    }
  }, [showOverview, activeTab, chapterId]);

  const loadVocabulary = async (id: number) => {
    setLoadingVocab(true);
    try {
      const data = await dispatch(getWordsByChapter(id)).unwrap();
      setVocabularyListState(Array.isArray(data) && data.length ? data : fallbackVocabulary);
    } catch (e) {
      setVocabularyListState(fallbackVocabulary);
    } finally {
      setLoadingVocab(false);
    }
  };

  const loadGrammar = async (id: number) => {
    setLoadingGrammar(true);
    try {
      const data = await dispatch(getGrammarsByChapter(id)).unwrap();
      setGrammarListState(Array.isArray(data) && data.length ? data : fallbackGrammar);
    } catch (e) {
      setGrammarListState(fallbackGrammar);
    } finally {
      setLoadingGrammar(false);
    }
  };

  const renderVocabulary = () => (
    <Card style={{ borderRadius: 12, marginTop: 24 }} bodyStyle={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 12 }}>
        📘 Vocabulary - Korean
      </Title>
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {(vocabularyListState.length ? vocabularyListState : fallbackVocabulary).map(v => (
          <Card key={v.id} style={{ borderRadius: 8 }} bodyStyle={{ padding: 12 }}>
            <Row align="middle">
              <Col flex="120px">
                <Title level={4} style={{ margin: 0 }}>
                  {v.word}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {v.meaning}
                </Text>
              </Col>
              <Col flex="auto">
                <Text>{v.example}</Text>
              </Col>
              <Col>
                <Button size="small">Practice</Button>
              </Col>
            </Row>
          </Card>
        ))}
      </Space>
    </Card>
  );

  const renderGrammar = () => (
    <Card style={{ borderRadius: 12, marginTop: 24 }} bodyStyle={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 12 }}>
        📗 Grammar - Korean
      </Title>
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {(grammarListState.length ? grammarListState : fallbackGrammar).map(g => (
          <Card key={g.id} style={{ borderRadius: 8 }} bodyStyle={{ padding: 12 }}>
            <Row>
              <Col flex="auto">
                <Title level={5} style={{ marginBottom: 6 }}>
                  {g.title}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  {g.explanation}
                </Text>
                <Text>{g.example}</Text>
              </Col>
              <Col>
                <Button size="small">Learn</Button>
              </Col>
            </Row>
          </Card>
        ))}
      </Space>
    </Card>
  );

  // Overview Screen
  const renderOverview = () => (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        Chapter Overview
      </Title>

      <Row gutter={24}>
        {/* Main Card */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
            }}
            bodyStyle={{ padding: 32 }}
          >
            {/* Chapter Badge and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6 }}>
                Chapter 1
              </Tag>
              <Tag color="processing" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6 }}>
                <PlayCircleOutlined /> In Progress
              </Tag>
            </div>

            {/* Title */}
            <Title level={3} style={{ marginBottom: 8 }}>
              Chapter 3: Daily Routine
            </Title>
            <Text type="secondary" style={{ fontSize: 15, display: 'block', marginBottom: 24 }}>
              일상 생활
            </Text>

            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text strong>Progress</Text>
                <Text strong style={{ color: '#667eea' }}>
                  60%
                </Text>
              </div>
              <Progress percent={60} strokeColor="#667eea" strokeWidth={8} />
            </div>

            {/* Info Row */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
              <div>
                <ClockCircleOutlined style={{ marginRight: 8, color: '#999' }} />
                <Text type="secondary">55 mins</Text>
              </div>
              <div>
                <ReadOutlined style={{ marginRight: 8, color: '#999' }} />
                <Text type="secondary">35 words</Text>
              </div>
            </div>

            {/* Grammar Section */}
            <div style={{ marginBottom: 32 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Grammar:
              </Text>
              <Space wrap>
                <Tag style={{ padding: '6px 14px', fontSize: 13 }}>Time expressions</Tag>
                <Tag style={{ padding: '6px 14px', fontSize: 13 }}>Daily activities</Tag>
              </Space>
            </div>

            {/* Continue Button */}
            <Button
              type="primary"
              size="large"
              block
              icon={<PlayCircleOutlined />}
              onClick={() => setShowOverview(false)}
              style={{
                height: 56,
                borderRadius: 8,
                fontSize: 16,
                background: '#667eea',
                fontWeight: 500,
              }}
            >
              Continue
            </Button>
          </Card>
        </Col>

        {/* Side Info - Optional */}
        <Col xs={24} lg={8}>
          <Card
            title="📚 Learning Tips"
            style={{
              borderRadius: 12,
              border: '1px solid #e8e8e8',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  💡 Practice regularly
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Complete exercises daily to improve your skills
                </Text>
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  🎯 Focus on grammar
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Understanding grammar helps you speak naturally
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Skills Tabs Screen
  const renderSkillsTabs = () => (
    <>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <div style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              {filteredExercises.map(exercise => (
                <Col key={exercise.id} xs={24}>
                  <Card
                    hoverable={exercise.status !== 'locked'}
                    style={{
                      borderRadius: 12,
                      border: '1px solid #e8e8e8',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 8 }}>{getStatusBadge(exercise.status)}</div>
                        <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                          {exercise.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {exercise.description}
                        </Text>

                        {exercise.timeLimit && (
                          <div style={{ marginTop: 12 }}>
                            <Space>
                              <Tag>{exercise.difficulty}</Tag>
                              <Tag icon={<ClockCircleOutlined />}>{exercise.timeLimit}</Tag>
                            </Space>
                          </div>
                        )}

                        {exercise.progress !== undefined && exercise.status !== 'locked' && (
                          <div style={{ marginTop: 16 }}>
                            <Progress percent={exercise.progress} strokeColor="#667eea" />
                          </div>
                        )}
                      </div>

                      <div style={{ marginLeft: 16, minWidth: 140 }}>{getActionButton(exercise)}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {renderExerciseExample()}
        </Col>

        <Col xs={24} lg={8}>
          {activeTab === 'listening' && renderListeningStats()}
        </Col>
      </Row>
    </>
  );

  return (
    <div style={{ padding: '32px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/courses')} style={{ marginBottom: 24 }} size="large">
          Back to Chapters
        </Button>

        {showOverview ? (
          renderOverview()
        ) : (
          <>
            <Title level={2} style={{ marginBottom: 24 }}>
              Chapter 3: Daily Routine
            </Title>
            {renderSkillsTabs()}
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterExercise;
