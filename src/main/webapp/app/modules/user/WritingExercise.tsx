import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col, Alert, message, Spin, Tag } from 'antd';
import { EditOutlined, CheckCircleOutlined, FormOutlined, InfoCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { IWritingExercise } from 'app/shared/model/models';
import SmartLanguageInput from 'app/shared/components/SmartLanguageInput';
import useHapticFeedback from 'app/shared/hooks/useHapticFeedback';
import { showSubmitFeedback } from 'app/shared/components/ExerciseFeedback';
import { colors, spacing, borderRadius, shadows, typography, cardBaseStyle, pageContainerStyle } from 'app/shared/styles/design-system';

const { Title, Text, Paragraph } = Typography;

const WritingExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const haptic = useHapticFeedback();

  const [exercise, setExercise] = useState<IWritingExercise | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSample, setShowSample] = useState(false);

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExercise = () => {
      setLoading(true);
      try {
        // Mock: Get writing exercise for demo
        const mockExercise: IWritingExercise = {
          id: parseInt(exerciseId, 10),
          chapterId: 1,
          skillType: 'WRITING',
          orderIndex: 1,
          prompt:
            'Viết một đoạn văn ngắn (50-80 từ) về cuộc gặp gỡ đầu tiên đáng nhớ của bạn. Sử dụng ít nhất 3 từ vựng đã học: 만남, 설레다, 인상',
          sampleAnswer:
            '작년 봄에 친구 소개로 새로운 사람을 만났어요. 첫 만남이었지만 정말 설렜어요. 그 사람의 첫 인상이 너무 좋았고 대화도 잘 통했어요. 지금은 제일 친한 친구가 되었어요.',
          minWords: 50,
          maxScore: 20,
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

  const countWords = (text: string) => {
    // Count Korean characters as words
    const koreanChars = text.match(/[\uAC00-\uD7A3]/g);
    return koreanChars ? koreanChars.length : 0;
  };

  const wordCount = countWords(userAnswer);
  const minWords = exercise?.minWords || 50;
  const isEnoughWords = wordCount >= minWords;

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      haptic.warning();
      message.warning('Vui lòng viết bài trước khi nộp');
      return;
    }

    if (!isEnoughWords) {
      haptic.warning();
      message.warning(`Bài viết của bạn cần ít nhất ${minWords} ký tự tiếng Hàn`);
      return;
    }

    setIsSubmitted(true);
    haptic.success();
    showSubmitFeedback();

    // Update progress
    if (exercise?.chapterId) {
      dispatch(
        upsertChapterProgress({
          chapterId: exercise.chapterId,
          exercisesCompleted: 1,
        }),
      );
    }
  };

  const handleRetry = () => {
    haptic.tap();
    setUserAnswer('');
    setIsSubmitted(false);
    setShowSample(false);
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

  return (
    <div
      className="writing-exercise-container"
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
              background: colors.secondary.gradient,
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${spacing.lg}`,
              boxShadow: shadows.staff,
            }}
          >
            <FormOutlined style={{ fontSize: '40px', color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Bài tập Luyện viết
          </Title>
          <Text type="secondary" style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
            Rèn luyện kỹ năng viết tiếng Hàn
          </Text>
        </div>

        {/* Instructions */}
        <Card
          style={{
            background: colors.background.secondary,
            border: `2px solid ${colors.border.light}`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: typography.fontSize.md, color: colors.text.primary }}>
                <InfoCircleOutlined style={{ marginRight: spacing.sm, color: colors.secondary.DEFAULT }} />
                Yêu cầu đề bài:
              </Text>
              <Paragraph
                style={{
                  fontSize: typography.fontSize.md,
                  lineHeight: '1.8',
                  color: colors.text.primary,
                  marginTop: spacing.md,
                  marginBottom: 0,
                }}
              >
                {exercise.prompt}
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" style={{ background: colors.background.primary, border: `1px solid ${colors.border.light}` }}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
                      Số ký tự tối thiểu:
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.lg, color: colors.secondary.DEFAULT }}>
                      {minWords} ký tự
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: colors.background.primary, border: `1px solid ${colors.border.light}` }}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
                      Điểm tối đa:
                    </Text>
                    <Text strong style={{ fontSize: typography.fontSize.lg, color: colors.secondary.DEFAULT }}>
                      {exercise.maxScore} điểm
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Writing Area */}
        <div style={{ marginBottom: spacing.xl }}>
          <div style={{ marginBottom: spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ marginBottom: 0, color: colors.text.primary }}>
              <EditOutlined style={{ marginRight: spacing.sm, color: colors.secondary.DEFAULT }} />
              Bài viết của bạn:
            </Title>
            <Space>
              <Tag
                color={isEnoughWords ? 'success' : 'warning'}
                style={{ fontSize: typography.fontSize.base, padding: `${spacing.xs} ${spacing.md}` }}
              >
                {wordCount} / {minWords} ký tự
              </Tag>
            </Space>
          </div>

          <SmartLanguageInput
            value={userAnswer}
            onChange={setUserAnswer}
            placeholder="Bắt đầu viết bằng tiếng Hàn..."
            disabled={isSubmitted}
            language="korean"
            type="textarea"
            autoSize={{ minRows: 8, maxRows: 12 }}
            autoCorrect="off"
            autoCapitalize="none"
            style={{
              fontSize: typography.fontSize.md,
              lineHeight: '1.8',
              borderRadius: borderRadius.md,
              border: `2px solid ${colors.border.light}`,
              background: isSubmitted ? colors.background.tertiary : colors.background.primary,
            }}
          />

          {!isEnoughWords && userAnswer.length > 0 && (
            <Text type="warning" style={{ marginTop: spacing.sm, display: 'block' }}>
              ⚠️ Bạn cần viết thêm {minWords - wordCount} ký tự nữa
            </Text>
          )}
        </div>

        {/* Sample Answer */}
        {exercise.sampleAnswer && (
          <Card
            style={{
              background: colors.background.secondary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              marginBottom: spacing.xl,
            }}
          >
            <div style={{ marginBottom: spacing.md }}>
              <Button type="link" onClick={() => setShowSample(!showSample)} style={{ padding: 0, fontSize: typography.fontSize.base }}>
                {showSample ? '▼' : '▶'} Xem bài mẫu tham khảo
              </Button>
            </div>
            {showSample && (
              <div
                style={{
                  padding: spacing.md,
                  background: colors.background.primary,
                  borderRadius: borderRadius.sm,
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <Paragraph
                  style={{
                    fontSize: typography.fontSize.md,
                    lineHeight: '1.8',
                    color: colors.text.primary,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    marginBottom: 0,
                  }}
                >
                  {exercise.sampleAnswer}
                </Paragraph>
              </div>
            )}
          </Card>
        )}

        {/* Result Message */}
        {isSubmitted && (
          <Alert
            message="🎉 Đã nộp bài!"
            description={`Bài viết của bạn đã được gửi thành công! Bạn được +${exercise.maxScore} điểm. Tiếp tục luyện tập để cải thiện kỹ năng viết nhé!`}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
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
                disabled={!isEnoughWords || !userAnswer.trim()}
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
            <Text strong style={{ color: colors.secondary.DEFAULT }}>
              💡 Mẹo viết bài:
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Sử dụng từ vựng và ngữ pháp đã học trong chương
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Viết câu đơn giản và rõ ràng, tránh câu quá dài
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Kiểm tra chính tả và ngữ pháp trước khi nộp bài
            </Text>
            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              • Tham khảo bài mẫu để học cách diễn đạt tự nhiên
            </Text>
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default WritingExercise;
