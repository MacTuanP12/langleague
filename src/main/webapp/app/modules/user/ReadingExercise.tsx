import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Radio, Row, Col, Alert, message, Spin, Divider } from 'antd';
import { ReadOutlined, CheckCircleOutlined, CloseCircleOutlined, BookOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { IReadingExercise } from 'app/shared/model/models';
import { colors, spacing, borderRadius, shadows, typography, cardBaseStyle, pageContainerStyle } from 'app/shared/styles/design-system';

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
    <div
      className="reading-exercise-container"
      style={{
        ...pageContainerStyle,
        maxWidth: 900,
        margin: '0 auto',
        padding: undefined,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.lg }}>
        <Button icon={<LeftOutlined />} onClick={handleBack} type="text" size="large">
          Quay lại
        </Button>
      </div>

      <Card style={{ ...cardBaseStyle }}>
        {/* Exercise Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: colors.info,
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${spacing.lg}`,
              boxShadow: shadows.admin,
            }}
          >
            <BookOutlined style={{ fontSize: '40px', color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Bài tập Luyện đọc
          </Title>
          <Text type="secondary" style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
            Đọc hiểu đoạn văn tiếng Hàn
          </Text>
        </div>

        {/* Reading Passage */}
        <Card
          style={{
            background: colors.background.secondary,
            border: `2px solid ${colors.border.light}`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
          }}
        >
          <div style={{ marginBottom: spacing.md }}>
            <ReadOutlined style={{ fontSize: '20px', color: colors.info, marginRight: spacing.sm }} />
            <Text strong style={{ fontSize: typography.fontSize.md, color: colors.text.primary }}>
              Đoạn văn:
            </Text>
          </div>
          <div
            style={{
              padding: spacing.lg,
              background: colors.background.primary,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.border.light}`,
            }}
          >
            <Paragraph
              style={{
                fontSize: typography.fontSize.lg,
                lineHeight: '2',
                color: colors.text.primary,
                fontFamily: "'Noto Sans KR', sans-serif",
                marginBottom: 0,
              }}
            >
              {exercise.passage}
            </Paragraph>
          </div>

          <Divider style={{ margin: `${spacing.md} 0` }} />

          {/* Translation Helper */}
          <div
            style={{
              padding: spacing.md,
              background: colors.background.secondary,
              borderRadius: borderRadius.sm,
            }}
          >
            <Text type="secondary" style={{ fontSize: typography.fontSize.base, fontStyle: 'italic' }}>
              💡 <Text strong>Dịch nghĩa:</Text> Kim Ji-young đã gặp anh ấy lần đầu tiên ở trường đại học. Thời tiết hôm đó rất đẹp và hoa
              anh đào trong khuôn viên trường đang nở rộ. Anh ấy đang đọc sách trước thư viện, và Ji-young đã yêu từ cái nhìn đầu tiên khi
              thấy anh ấy đang tập trung đọc sách.
            </Text>
          </div>
        </Card>

        {/* Question */}
        <div style={{ marginBottom: spacing.xl }}>
          <Title level={4} style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Câu hỏi:
          </Title>
          <Card
            style={{
              background: colors.background.secondary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.sm,
            }}
          >
            <Paragraph style={{ fontSize: typography.fontSize.md, lineHeight: '1.6', color: colors.text.primary, marginBottom: 0 }}>
              {exercise.question}
            </Paragraph>
          </Card>
        </div>

        {/* Answer Options */}
        <div style={{ marginBottom: spacing.xl }}>
          <Title level={4} style={{ marginBottom: spacing.md, color: colors.text.primary }}>
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
                        ? `2px solid ${colors.info}`
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? `2px solid ${colors.success}`
                          : isSubmitted && selectedAnswer === option.value
                            ? `2px solid ${colors.error}`
                            : `1px solid ${colors.border.default}`,
                    background:
                      selectedAnswer === option.value
                        ? `rgba(28, 176, 246, 0.05)`
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? `rgba(88, 204, 2, 0.05)`
                          : colors.background.primary,
                    borderRadius: borderRadius.md,
                    transition: 'all 0.3s',
                  }}
                >
                  <Radio value={option.value} style={{ width: '100%' }}>
                    <Text style={{ fontSize: typography.fontSize.md, fontWeight: selectedAnswer === option.value ? 600 : 400 }}>
                      {option.label}
                    </Text>
                    {isSubmitted && option.value === exercise.correctAnswer && (
                      <CheckCircleOutlined style={{ color: colors.success, marginLeft: spacing.md, fontSize: typography.fontSize.lg }} />
                    )}
                    {isSubmitted && selectedAnswer === option.value && !isCorrect && (
                      <CloseCircleOutlined style={{ color: colors.error, marginLeft: spacing.md, fontSize: typography.fontSize.lg }} />
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
            style={{ marginBottom: spacing.lg, borderRadius: borderRadius.md }}
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
                  fontSize: typography.fontSize.md,
                  borderRadius: borderRadius.md,
                  background: colors.primary.gradient,
                  border: 'none',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Nộp bài
              </Button>
            </Col>
          ) : (
            <>
              <Col span={12}>
                <Button
                  size="large"
                  onClick={handleRetry}
                  block
                  style={{
                    height: '48px',
                    fontSize: typography.fontSize.md,
                    borderRadius: borderRadius.md,
                  }}
                >
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
                    fontSize: typography.fontSize.md,
                    borderRadius: borderRadius.md,
                    background: colors.primary.gradient,
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
            marginTop: spacing.lg,
            background: colors.background.secondary,
            border: `1px solid ${colors.border.light}`,
            borderRadius: borderRadius.md,
          }}
        >
          <Space direction="vertical" size="small">
            <Text strong style={{ color: colors.info }}>
              💡 Mẹo đọc hiểu:
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Đọc toàn bộ đoạn văn trước để nắm ý chính
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Chú ý các từ khóa: 어디서 (ở đâu), 무엇 (gì), 누구 (ai), 언제 (khi nào)
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Tìm thông tin cụ thể trong đoạn văn để trả lời câu hỏi
            </Text>
          </Space>
        </Card>

        {/* Score Info */}
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            background: colors.background.secondary,
            borderRadius: borderRadius.md,
            textAlign: 'center',
          }}
        >
          <Text type="secondary">
            Điểm tối đa:{' '}
            <Text strong style={{ color: colors.info }}>
              {exercise.maxScore} điểm
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ReadingExercise;
