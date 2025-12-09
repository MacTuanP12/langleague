import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Divider, Tabs, Progress, Spin, message } from 'antd';
import {
  SoundOutlined,
  TranslationOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

interface Question {
  id: number;
  question: string;
  questionKorean: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonData {
  id: number;
  title: string;
  titleKorean?: string;
  description?: string;
  level: string;
  estimatedMinutes?: number;
  content?: any;
  readingText?: {
    korean: string;
    english: string;
  };
  vocabulary?: any[];
  questions?: Question[];
}

const ReadingLesson = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLessonData();
    }
  }, [id]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lessons/${id}`);
      const lesson = response.data;

      // Try to fetch reading exercises
      let readingText = defaultReadingText;
      const questions = defaultQuestions;
      const vocabulary = defaultVocabulary;

      try {
        const exercisesResponse = await axios.get(`/api/lessons/${id}/exercises`);
        if (exercisesResponse.data?.readingExercises?.[0]) {
          const reading = exercisesResponse.data.readingExercises[0];
          readingText = {
            korean: reading.content || defaultReadingText.korean,
            english: reading.translation || defaultReadingText.english,
          };
        }
      } catch (error) {
        console.warn('Reading exercises not available, using default data');
      }

      setLessonData({
        id: lesson.id,
        title: lesson.title,
        titleKorean: lesson.description,
        level: lesson.level,
        estimatedMinutes: lesson.estimatedMinutes,
        readingText,
        vocabulary,
        questions,
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
      message.error('Failed to load lesson data');
      // Set default lesson data
      setLessonData({
        id: Number(id) || 1,
        title: 'A Day in My Life',
        titleKorean: '나의 하루',
        level: 'Beginner',
        estimatedMinutes: 5,
        readingText: defaultReadingText,
        vocabulary: defaultVocabulary,
        questions: defaultQuestions,
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultReadingText = {
    korean: `안녕하세요? 제 이름은 김민수입니다. 저는 대학생입니다.

오늘은 월요일입니다. 저는 아침 7시에 일어납니다. 먼저 세수를 하고 아침을 먹습니다. 어머니가 만든 김치찌개와 밥을 먹습니다. 정말 맛있습니다!

8시에 학교에 갑니다. 학교는 집에서 30분 걸립니다. 저는 버스를 타고 갑니다. 학교에서 친구들을 만납니다. 우리는 같이 한국어를 공부합니다.

오후 2시에 점심을 먹습니다. 학교 식당에서 비빔밥을 먹습니다. 오후에는 도서관에서 숙제를 합니다.

저녁 6시에 집에 옵니다. 가족과 저녁을 먹고 텔레비전을 봅니다. 밤 11시에 잠을 잡니다.

이것이 제 하루입니다. 여러분의 하루는 어떻습니까?`,

    english: `Hello? My name is Kim Minsu. I am a university student.

Today is Monday. I wake up at 7 AM. First, I wash my face and eat breakfast. I eat kimchi stew and rice that my mother made. It's really delicious!

I go to school at 8 o'clock. School takes 30 minutes from home. I go by bus. I meet my friends at school. We study Korean together.

I eat lunch at 2 PM. I eat bibimbap at the school cafeteria. In the afternoon, I do homework at the library.

I come home at 6 PM. I eat dinner with my family and watch television. I sleep at 11 PM.

This is my day. How is your day?`,
  };

  const defaultVocabulary = [
    { korean: '대학생', romanization: 'daehaksaeng', english: 'university student' },
    { korean: '일어나다', romanization: 'ireonada', english: 'to wake up' },
    { korean: '세수', romanization: 'sesu', english: 'face washing' },
    { korean: '만들다', romanization: 'mandeulda', english: 'to make' },
    { korean: '걸리다', romanization: 'geollida', english: 'to take (time)' },
    { korean: '숙제', romanization: 'sukje', english: 'homework' },
  ];

  const defaultQuestions: Question[] = [
    {
      id: 1,
      question: 'What time does Minsu wake up?',
      questionKorean: '민수는 몇 시에 일어납니까?',
      options: ['6 AM', '7 AM', '8 AM', '9 AM'],
      correctAnswer: 1,
      explanation: 'Minsu wakes up at 7 AM (아침 7시에 일어납니다).',
    },
    {
      id: 2,
      question: 'How does Minsu go to school?',
      questionKorean: '민수는 어떻게 학교에 갑니까?',
      options: ['By car', 'By subway', 'By bus', 'On foot'],
      correctAnswer: 2,
      explanation: 'Minsu goes to school by bus (버스를 타고 갑니다).',
    },
    {
      id: 3,
      question: 'What does Minsu eat for lunch?',
      questionKorean: '민수는 점심에 무엇을 먹습니까?',
      options: ['Kimchi stew', 'Bibimbap', 'Rice', 'Ramyeon'],
      correctAnswer: 1,
      explanation: 'Minsu eats bibimbap for lunch (비빔밥을 먹습니다).',
    },
  ];

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Title level={3}>Lesson not found</Title>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const questions = lessonData.questions || [];
  const vocabulary = lessonData.vocabulary || [];
  const readingText = lessonData.readingText || { korean: '', english: '' };
  const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        Back to Lessons
      </Button>

      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '32px',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Tag color="gold">{lessonData.level} • Easy</Tag>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            {lessonData.title}
          </Title>
          <Title level={4} style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 400 }}>
            {lessonData.titleKorean || ''}
          </Title>
          <Space size="large" style={{ marginTop: '16px' }}>
            <Space>
              <BookOutlined style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>{lessonData.estimatedMinutes || 5} mins</Text>
            </Space>
            <Space>
              <QuestionCircleOutlined style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>{questions.length} Questions</Text>
            </Space>
          </Space>
        </Space>
      </Card>

      <Tabs defaultActiveKey="reading" size="large">
        <Tabs.TabPane
          tab={
            <Space>
              <BookOutlined />
              Reading
            </Space>
          }
          key="reading"
        >
          <Card
            style={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '32px' }}
            extra={
              <Button
                icon={showTranslation ? <BookOutlined /> : <TranslationOutlined />}
                onClick={() => setShowTranslation(!showTranslation)}
              >
                {showTranslation ? 'Hide Translation' : 'Show Translation'}
              </Button>
            }
          >
            <div style={{ marginBottom: '24px' }}>
              <Button type="primary" icon={<SoundOutlined />} size="large" style={{ borderRadius: '8px' }}>
                Listen to Audio
              </Button>
            </div>

            <Row gutter={32}>
              <Col xs={24} lg={showTranslation ? 12 : 24}>
                <Paragraph
                  style={{
                    fontSize: '18px',
                    lineHeight: '2',
                    whiteSpace: 'pre-line',
                    fontFamily: '"Noto Sans KR", sans-serif',
                  }}
                >
                  {readingText.korean}
                </Paragraph>
              </Col>
              {showTranslation && (
                <Col xs={24} lg={12}>
                  <Paragraph
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      whiteSpace: 'pre-line',
                      color: '#595959',
                    }}
                  >
                    {readingText.english}
                  </Paragraph>
                </Col>
              )}
            </Row>

            <Divider />

            <Title level={4}>Key Vocabulary</Title>
            <Row gutter={[16, 16]}>
              {vocabulary.map((word, index) => (
                <Col xs={12} md={8} key={index}>
                  <Card
                    size="small"
                    style={{
                      background: '#f5f5f5',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    <Space direction="vertical" size={4}>
                      <Text strong style={{ fontSize: '18px', color: '#667eea' }}>
                        {word.korean}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {word.romanization}
                      </Text>
                      <Text style={{ fontSize: '14px' }}>{word.english}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <Space>
              <QuestionCircleOutlined />
              Comprehension Quiz
            </Space>
          }
          key="quiz"
        >
          <Card
            style={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {showResults && (
              <Card
                style={{
                  marginBottom: '24px',
                  background: correctCount === questions.length ? '#f6ffed' : '#fff7e6',
                  border: `1px solid ${correctCount === questions.length ? '#b7eb8f' : '#ffd591'}`,
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Title level={4} style={{ margin: 0 }}>
                      Your Score: {correctCount} / {questions.length}
                    </Title>
                  </Col>
                  <Col>
                    <Progress
                      type="circle"
                      percent={Math.round((correctCount / questions.length) * 100)}
                      width={60}
                      strokeColor={correctCount === questions.length ? '#52c41a' : '#faad14'}
                    />
                  </Col>
                </Row>
              </Card>
            )}

            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {questions.map((question, index) => (
                <Card
                  key={question.id}
                  style={{
                    background: '#fafafa',
                    border: 'none',
                  }}
                >
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div>
                      <Title level={5}>Question {index + 1}</Title>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>
                        {question.question}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        {question.questionKorean}
                      </Text>
                    </div>

                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedAnswers[question.id] === optIndex;
                        const isCorrect = optIndex === question.correctAnswer;
                        const showCorrectAnswer = showResults && isCorrect;
                        const showWrongAnswer = showResults && isSelected && !isCorrect;

                        return (
                          <Button
                            key={optIndex}
                            block
                            size="large"
                            style={{
                              textAlign: 'left',
                              height: 'auto',
                              padding: '12px 16px',
                              background: showCorrectAnswer ? '#f6ffed' : showWrongAnswer ? '#fff1f0' : isSelected ? '#e6f7ff' : 'white',
                              border: showCorrectAnswer
                                ? '2px solid #52c41a'
                                : showWrongAnswer
                                  ? '2px solid #ff4d4f'
                                  : isSelected
                                    ? '2px solid #1890ff'
                                    : '1px solid #d9d9d9',
                              borderRadius: '8px',
                            }}
                            onClick={() => !showResults && handleAnswerSelect(question.id, optIndex)}
                            disabled={showResults}
                            icon={showCorrectAnswer ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : null}
                          >
                            <Text>{option}</Text>
                          </Button>
                        );
                      })}
                    </Space>

                    {showResults && selectedAnswers[question.id] !== undefined && (
                      <Card size="small" style={{ background: '#e6f7ff', border: 'none' }}>
                        <Text type="secondary">
                          <strong>Explanation:</strong> {question.explanation}
                        </Text>
                      </Card>
                    )}
                  </Space>
                </Card>
              ))}
            </Space>

            <Divider />

            <Row justify="center">
              {!showResults ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={checkAnswers}
                  disabled={Object.keys(selectedAnswers).length !== questions.length}
                  style={{ borderRadius: '8px', paddingLeft: '32px', paddingRight: '32px' }}
                >
                  Submit Answers
                </Button>
              ) : (
                <Space>
                  <Button
                    size="large"
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers({});
                    }}
                    style={{ borderRadius: '8px' }}
                  >
                    Try Again
                  </Button>
                  <Button type="primary" size="large" onClick={() => navigate('/dashboard/courses')} style={{ borderRadius: '8px' }}>
                    Next Lesson
                  </Button>
                </Space>
              )}
            </Row>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ReadingLesson;
