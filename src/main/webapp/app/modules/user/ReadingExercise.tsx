import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Radio, Row, Col, Alert, message, Spin, Divider } from 'antd';
import { ReadOutlined, CheckCircleOutlined, CloseCircleOutlined, LeftOutlined, BookOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { IReadingExercise } from 'app/shared/model/models';

const { Title, Text, Paragraph } = Typography;

const ReadingExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [exercise, setExercise] = useState<IReadingExercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExercise = () => {
      setLoading(true);
      try {
        // Mock: Get reading exercise for demo
        const mockExercise: IReadingExercise = {
          id: parseInt(exerciseId, 10),
          chapterId: 1,
          skillType: 'READING',
          orderIndex: 1,
          passage:
            '김지영은 대학교에서 처음 그를 만났다. 그날 날씨가 정말 좋았고 캠퍼스의 벚꽃이 활짝 피어 있었다. 그는 도서관 앞에서 책을 읽고 있었고, 지영은 그의 집중하는 모습에 첫눈에 반했다.',
          question: '김지영은 어디서 그를 처음 만났나요?',
          correctAnswer: 'A',
          maxScore: 10,
        };
        setExercise(mockExercise);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        message.error('Không thể tải bài tập');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId, dispatch]);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      message.warning('Vui lòng chọn một đáp án');
      return;
    }

    const correct = selectedAnswer === exercise?.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      message.success('Chính xác! Bạn đã trả lời đúng! 🎉');
      // Update progress
      if (exercise?.chapterId) {
        dispatch(
          upsertChapterProgress({
            chapterId: exercise.chapterId,
            exercisesCompleted: 1,
          }),
        );
      }
    } else {
      message.error('Chưa đúng. Hãy đọc lại đoạn văn và thử lại nhé! 💪');
    }
  };

  const handleRetry = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="Đang tải bài tập..." />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Alert message="Không tìm thấy bài tập" type="warning" showIcon />
        <Button type="primary" onClick={handleBack} style={{ marginTop: '20px' }}>
          Quay lại
        </Button>
      </div>
    );
  }

  const answerOptions = [
    { value: 'A', label: 'A. Ở trường đại học (대학교에서)' },
    { value: 'B', label: 'B. Ở công viên (공원에서)' },
    { value: 'C', label: 'C. Ở quán cà phê (카페에서)' },
    { value: 'D', label: 'D. Ở thư viện (도서관에서)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<LeftOutlined />} onClick={handleBack} type="text" size="large">
          Quay lại
        </Button>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
          border: '2px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        {/* Exercise Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
            }}
          >
            <BookOutlined style={{ fontSize: '40px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#1a1a1a' }}>
            Bài tập Luyện đọc
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Đọc hiểu đoạn văn tiếng Hàn
          </Text>
        </div>

        {/* Reading Passage */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)',
            border: '2px solid rgba(79, 172, 254, 0.2)',
            borderRadius: '12px',
            marginBottom: '32px',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <ReadOutlined style={{ fontSize: '20px', color: '#4facfe', marginRight: '8px' }} />
            <Text strong style={{ fontSize: '16px', color: '#1a1a1a' }}>
              Đoạn văn:
            </Text>
          </div>
          <div
            style={{
              padding: '24px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid rgba(79, 172, 254, 0.2)',
            }}
          >
            <Paragraph
              style={{
                fontSize: '18px',
                lineHeight: '2',
                color: '#262626',
                fontFamily: "'Noto Sans KR', sans-serif",
                marginBottom: 0,
              }}
            >
              {exercise.passage}
            </Paragraph>
          </div>

          <Divider style={{ margin: '20px 0' }} />

          {/* Translation Helper */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(79, 172, 254, 0.05)',
              borderRadius: '8px',
            }}
          >
            <Text type="secondary" style={{ fontSize: '14px', fontStyle: 'italic' }}>
              💡 <Text strong>Dịch nghĩa:</Text> Kim Ji-young đã gặp anh ấy lần đầu tiên ở trường đại học. Thời tiết hôm đó rất đẹp và hoa
              anh đào trong khuôn viên trường đang nở rộ. Anh ấy đang đọc sách trước thư viện, và Ji-young đã yêu từ cái nhìn đầu tiên khi
              thấy anh ấy đang tập trung đọc sách.
            </Text>
          </div>
        </Card>

        {/* Question */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ marginBottom: '20px', color: '#1a1a1a' }}>
            Câu hỏi:
          </Title>
          <Card
            style={{
              background: 'rgba(79, 172, 254, 0.05)',
              border: '1px solid rgba(79, 172, 254, 0.2)',
              borderRadius: '8px',
            }}
          >
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#262626', marginBottom: 0 }}>{exercise.question}</Paragraph>
          </Card>
        </div>

        {/* Answer Options */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ marginBottom: '20px', color: '#1a1a1a' }}>
            Chọn đáp án:
          </Title>
          <Radio.Group
            value={selectedAnswer}
            onChange={e => setSelectedAnswer(e.target.value)}
            disabled={isSubmitted}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {answerOptions.map(option => (
                <Card
                  key={option.value}
                  hoverable={!isSubmitted}
                  style={{
                    border:
                      selectedAnswer === option.value
                        ? '2px solid #4facfe'
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? '2px solid #52c41a'
                          : isSubmitted && selectedAnswer === option.value
                            ? '2px solid #ff4d4f'
                            : '1px solid #d9d9d9',
                    background:
                      selectedAnswer === option.value
                        ? 'rgba(79, 172, 254, 0.05)'
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? 'rgba(82, 196, 26, 0.05)'
                          : 'white',
                    borderRadius: '12px',
                    transition: 'all 0.3s',
                  }}
                >
                  <Radio value={option.value} style={{ width: '100%' }}>
                    <Text style={{ fontSize: '16px', fontWeight: selectedAnswer === option.value ? 600 : 400 }}>{option.label}</Text>
                    {isSubmitted && option.value === exercise.correctAnswer && (
                      <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '12px', fontSize: '18px' }} />
                    )}
                    {isSubmitted && selectedAnswer === option.value && !isCorrect && (
                      <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: '12px', fontSize: '18px' }} />
                    )}
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Result Message */}
        {isSubmitted && (
          <Alert
            message={isCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng'}
            description={
              isCorrect
                ? `Bạn đã trả lời đúng! Đáp án là ${exercise.correctAnswer}. Bạn được +${exercise.maxScore} điểm.`
                : `Đáp án đúng là ${exercise.correctAnswer}. Hãy đọc lại đoạn văn và chú ý các chi tiết quan trọng nhé!`
            }
            type={isCorrect ? 'success' : 'error'}
            showIcon
            style={{ marginBottom: '24px', borderRadius: '12px' }}
          />
        )}

        {/* Action Buttons */}
        <Row gutter={16}>
          {!isSubmitted ? (
            <Col span={24}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                block
                disabled={!selectedAnswer}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Nộp bài
              </Button>
            </Col>
          ) : (
            <>
              <Col span={12}>
                <Button size="large" onClick={handleRetry} block style={{ height: '48px', fontSize: '16px', borderRadius: '12px' }}>
                  Làm lại
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBack}
                  block
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    border: 'none',
                  }}
                >
                  Tiếp tục học
                </Button>
              </Col>
            </>
          )}
        </Row>

        {/* Tips */}
        <Card
          style={{
            marginTop: '24px',
            background: 'rgba(79, 172, 254, 0.05)',
            border: '1px solid rgba(79, 172, 254, 0.2)',
            borderRadius: '12px',
          }}
        >
          <Space direction="vertical" size="small">
            <Text strong style={{ color: '#4facfe' }}>
              💡 Mẹo đọc hiểu:
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              • Đọc toàn bộ đoạn văn trước để nắm ý chính
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              • Chú ý các từ khóa: 어디서 (ở đâu), 무엇 (gì), 누구 (ai), 언제 (khi nào)
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              • Tìm thông tin cụ thể trong đoạn văn để trả lời câu hỏi
            </Text>
          </Space>
        </Card>

        {/* Score Info */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(79, 172, 254, 0.05)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Text type="secondary">
            Điểm tối đa:{' '}
            <Text strong style={{ color: '#4facfe' }}>
              {exercise.maxScore} điểm
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ReadingExercise;
