import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col, Alert, message, Spin, Tag, Divider } from 'antd';
import { AudioOutlined, CheckCircleOutlined, LeftOutlined, PlayCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { ISpeakingExercise } from 'app/shared/model/models';
import { colors, spacing, borderRadius, shadows, typography, cardBaseStyle, pageContainerStyle } from 'app/shared/styles/design-system';

const { Title, Text, Paragraph } = Typography;

const SpeakingExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [exercise, setExercise] = useState<ISpeakingExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [samplePlaying, setSamplePlaying] = useState(false);

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExercise = () => {
      setLoading(true);
      try {
        // Mock: Get speaking exercise for demo
        const mockExercise: ISpeakingExercise = {
          id: parseInt(exerciseId, 10),
          chapterId: 1,
          skillType: 'SPEAKING',
          orderIndex: 1,
          prompt: 'Hãy giới thiệu về cuộc gặp đầu tiên của bạn với một người quan trọng. Sử dụng mẫu câu: 처음 만났을 때...',
          sampleAudio: '/audio/chapter1-speaking1-sample.mp3',
          targetPhrase: '처음 만났을 때 정말 설렜어요',
          maxScore: 15,
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

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handlePlaySample = () => {
    setSamplePlaying(true);
    message.info('Đang phát audio mẫu... (Demo: Audio file chưa có)');
    setTimeout(() => setSamplePlaying(false), 2000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    message.info('Bắt đầu ghi âm... (Demo: Tính năng ghi âm chưa tích hợp)');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    message.success('Đã dừng ghi âm!');
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    message.success('Bài tập đã được gửi! 🎉');

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
    setIsRecording(false);
    setIsCompleted(false);
    setRecordingTime(0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      className="speaking-exercise-container"
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
              background: colors.error,
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${spacing.lg}`,
              boxShadow: '0 4px 12px rgba(255, 75, 75, 0.3)',
            }}
          >
            <AudioOutlined style={{ fontSize: '40px', color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Bài tập Luyện nói
          </Title>
          <Text type="secondary" style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
            Luyện phát âm và diễn đạt tiếng Hàn
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
          <Title level={4} style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            <SoundOutlined style={{ marginRight: spacing.sm, color: colors.error }} />
            Yêu cầu:
          </Title>
          <Paragraph style={{ fontSize: typography.fontSize.md, lineHeight: '1.8', color: colors.text.primary, marginBottom: spacing.md }}>
            {exercise.prompt}
          </Paragraph>

          <Divider style={{ margin: `${spacing.md} 0` }} />

          <div>
            <Text strong style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
              Cụm từ mục tiêu:
            </Text>
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.md,
                background: colors.background.primary,
                borderRadius: borderRadius.sm,
                border: `1px solid ${colors.border.light}`,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.error,
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                {exercise.targetPhrase}
              </Text>
            </div>
          </div>
        </Card>

        {/* Sample Audio */}
        {exercise.sampleAudio && (
          <Card
            style={{
              background: colors.background.secondary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              marginBottom: spacing.xl,
            }}
          >
            <Row align="middle" justify="space-between">
              <Col>
                <Text strong style={{ fontSize: typography.fontSize.base }}>
                  <PlayCircleOutlined style={{ marginRight: spacing.sm, color: colors.primary.DEFAULT }} />
                  Audio mẫu - Nghe để tham khảo cách phát âm
                </Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<SoundOutlined />}
                  onClick={handlePlaySample}
                  loading={samplePlaying}
                  style={{
                    background: colors.primary.gradient,
                    border: 'none',
                    borderRadius: borderRadius.full,
                  }}
                >
                  {samplePlaying ? 'Đang phát...' : 'Nghe mẫu'}
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        {/* Recording Section */}
        <Card
          style={{
            background: isRecording ? `rgba(255, 75, 75, 0.05)` : colors.background.secondary,
            border: `2px solid ${isRecording ? colors.error : colors.border.light}`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
            textAlign: 'center',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Recording Timer */}
            {isRecording && (
              <div>
                <Tag color="red" style={{ fontSize: typography.fontSize.md, padding: `${spacing.sm} ${spacing.md}` }}>
                  ⏺ Đang ghi âm...
                </Tag>
                <div style={{ marginTop: spacing.md }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xxxl,
                      fontWeight: typography.fontWeight.semibold,
                      fontFamily: 'monospace',
                      color: colors.error,
                    }}
                  >
                    {formatTime(recordingTime)}
                  </Text>
                </div>
              </div>
            )}

            {/* Recording Icon */}
            <div
              style={{
                width: '100px',
                height: '100px',
                background: isRecording ? colors.error : colors.primary.gradient,
                borderRadius: borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: isRecording ? '0 8px 24px rgba(255, 75, 75, 0.4)' : shadows.primary,
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                cursor: 'pointer',
              }}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              <AudioOutlined style={{ fontSize: '48px', color: '#FFFFFF' }} />
            </div>

            {/* Recording Button */}
            {!isCompleted && (
              <Button
                type={isRecording ? 'default' : 'primary'}
                size="large"
                danger={isRecording}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                style={{
                  height: '48px',
                  fontSize: typography.fontSize.md,
                  borderRadius: borderRadius.full,
                  padding: `0 ${spacing.xxl}`,
                  background: isRecording ? undefined : colors.error,
                  border: isRecording ? undefined : 'none',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                {isRecording ? '⏹ Dừng ghi âm' : '🎤 Bắt đầu ghi âm'}
              </Button>
            )}

            <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
              {isRecording ? 'Nhấn nút để dừng ghi âm' : 'Nhấn nút và bắt đầu nói'}
            </Text>
          </Space>
        </Card>

        {/* Result Message */}
        {isCompleted && (
          <Alert
            message="🎉 Hoàn thành!"
            description={`Bạn đã hoàn thành bài tập! Bạn được +${exercise.maxScore} điểm. Tiếp tục luyện tập để nâng cao kỹ năng nói nhé!`}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: spacing.lg, borderRadius: borderRadius.md }}
          />
        )}

        {/* Action Buttons */}
        <Row gutter={16}>
          {!isCompleted ? (
            <Col span={24}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                block
                disabled={recordingTime === 0}
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
            <Text strong style={{ color: colors.error }}>
              {exercise.maxScore} điểm
            </Text>
          </Text>
        </div>
      </Card>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 8px 24px rgba(255, 75, 75, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 12px 32px rgba(255, 75, 75, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 8px 24px rgba(255, 75, 75, 0.4);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeakingExercise;
