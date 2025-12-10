import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Space, Radio, Row, Col, message, Spin, Alert, Image, Slider } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  AudioOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  FastForwardOutlined,
  FastBackwardOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { saveExerciseResult } from 'app/shared/services/exercise-result.service';
import { IListeningExercise } from 'app/shared/model/models';
import { colors, spacing, borderRadius, shadows, typography, cardBaseStyle, pageContainerStyle } from 'app/shared/styles/design-system';

const { Title, Text, Paragraph } = Typography;

const ListeningExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [exercise, setExercise] = useState<IListeningExercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExercise = () => {
      setLoading(true);
      try {
        // Mock: Get listening exercise with sample audio
        const mockExercise: IListeningExercise = {
          id: parseInt(exerciseId, 10),
          chapterId: 1,
          skillType: 'LISTENING',
          orderIndex: 1,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          question: 'Nghe đoạn hội thoại và chọn câu trả lời đúng: Họ gặp nhau ở đâu?',
          correctAnswer: 'B',
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

  // Initialize Howler when exercise is loaded
  useEffect(() => {
    if (!exercise?.audioUrl) return;

    const sound = new Howl({
      src: [exercise.audioUrl],
      html5: true,
      volume,
      rate: playbackRate,
      onload() {
        setDuration(sound.duration());
      },
      onplay() {
        setIsPlaying(true);
        // Update progress
        progressIntervalRef.current = window.setInterval(() => {
          if (sound.playing()) {
            const seek = sound.seek();
            setCurrentTime(seek);
            setProgress((seek / sound.duration()) * 100);
          }
        }, 100);
      },
      onpause() {
        setIsPlaying(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      },
      onstop() {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      },
      onend() {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      },
    });

    soundRef.current = sound;

    return () => {
      sound.unload();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [exercise?.audioUrl, volume, playbackRate]);

  const handlePlayPause = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleStop = () => {
    if (!soundRef.current) return;
    soundRef.current.stop();
  };

  const handleSeek = (value: number) => {
    if (!soundRef.current) return;
    const seekTime = (value / 100) * duration;
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
    setProgress(value);
  };

  const handleSkipForward = () => {
    if (!soundRef.current) return;
    const newTime = Math.min(currentTime + 10, duration);
    soundRef.current.seek(newTime);
  };

  const handleSkipBackward = () => {
    if (!soundRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
    soundRef.current.seek(newTime);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (soundRef.current) {
      soundRef.current.rate(rate);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (soundRef.current) {
      soundRef.current.volume(vol);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      message.warning('Vui lòng chọn một đáp án');
      return;
    }

    const correct = selectedAnswer === exercise?.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (exercise) {
      dispatch(saveExerciseResult({
        exerciseId: exercise.id,
        exerciseType: 'LISTENING',
        isCorrect: correct,
        score: correct ? exercise.maxScore : 0,
        userAnswer: selectedAnswer,
      }));
    }

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
      message.error('Chưa đúng. Hãy thử lại nhé! 💪');
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
    { value: 'A', label: 'A. Ở công viên' },
    { value: 'B', label: 'B. Ở trường đại học' },
    { value: 'C', label: 'C. Ở quán cà phê' },
    { value: 'D', label: 'D. Ở thư viện' },
  ];

  return (
    <div
      className="listening-exercise-container"
      style={{
        ...pageContainerStyle,
        maxWidth: 900,
        margin: '0 auto',
        padding: undefined, // Override to use CSS class for responsive
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.lg }}>
        <Button icon={<LeftOutlined />} onClick={handleBack} type="text" size="large">
          Quay lại
        </Button>
      </div>

      <Card
        style={{
          ...cardBaseStyle,
        }}
      >
        {/* Exercise Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: colors.primary.gradient,
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${spacing.lg}`,
              boxShadow: shadows.primary,
            }}
          >
            <AudioOutlined style={{ fontSize: '40px', color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Bài tập Luyện nghe
          </Title>
          <Text type="secondary" style={{ fontSize: typography.fontSize.md, color: colors.text.secondary }}>
            Nghe kỹ và chọn đáp án đúng nhất
          </Text>
        </div>

        {/* Image */}
        {exercise.imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <Image
              src={exercise.imageUrl}
              alt="Listening exercise"
              style={{ borderRadius: borderRadius.md, maxHeight: '300px', objectFit: 'cover' }}
              preview={false}
            />
          </div>
        )}

        {/* Audio Player with Howler.js */}
        <Card
          style={{
            background: colors.background.secondary,
            border: `2px solid ${colors.border.light}`,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Progress Bar */}
            <div>
              <Slider value={progress} onChange={handleSeek} tooltip={{ formatter: null }} style={{ margin: '0 8px' }} />
              <Row justify="space-between" style={{ marginTop: spacing.sm, padding: `0 ${spacing.sm}` }}>
                <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
                  {formatTime(currentTime)}
                </Text>
                <Text type="secondary" style={{ fontSize: typography.fontSize.xs }}>
                  {formatTime(duration)}
                </Text>
              </Row>
            </div>

            {/* Playback Controls */}
            <Row justify="center" align="middle" gutter={16}>
              <Col>
                <Button shape="circle" size="large" icon={<FastBackwardOutlined />} onClick={handleSkipBackward} title="Lùi 10s" />
              </Col>
              <Col>
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={handlePlayPause}
                  style={{
                    width: '64px',
                    height: '64px',
                    background: colors.primary.gradient,
                    border: 'none',
                    boxShadow: shadows.primary,
                  }}
                />
              </Col>
              <Col>
                <Button shape="circle" size="large" icon={<FastForwardOutlined />} onClick={handleSkipForward} title="Tiến 10s" />
              </Col>
              <Col>
                <Button shape="circle" size="large" icon={<ReloadOutlined />} onClick={handleStop} title="Dừng và reset" />
              </Col>
            </Row>

            {/* Speed Control */}
            <Row justify="center" gutter={8}>
              <Col>
                <Text type="secondary" style={{ fontSize: typography.fontSize.base }}>
                  Tốc độ:
                </Text>
              </Col>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                <Col key={rate}>
                  <Button
                    size="small"
                    type={playbackRate === rate ? 'primary' : 'default'}
                    onClick={() => handlePlaybackRateChange(rate)}
                    style={{
                      borderRadius: borderRadius.sm,
                      minWidth: '50px',
                    }}
                  >
                    {rate}x
                  </Button>
                </Col>
              ))}
            </Row>

            {/* Volume Control */}
            <Row align="middle" gutter={16}>
              <Col span={3}>
                <SoundOutlined style={{ fontSize: typography.fontSize.lg, color: colors.primary.DEFAULT }} />
              </Col>
              <Col flex="auto">
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  tooltip={{ formatter: value => `${Math.round(value * 100)}%` }}
                />
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Question */}
        <div style={{ marginBottom: spacing.xl }}>
          <Title level={4} style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Câu hỏi:
          </Title>
          <Paragraph style={{ fontSize: typography.fontSize.md, lineHeight: '1.6', color: colors.text.primary }}>
            {exercise.question}
          </Paragraph>
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
                        ? `2px solid ${colors.primary.DEFAULT}`
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? `2px solid ${colors.success}`
                          : isSubmitted && selectedAnswer === option.value
                            ? `2px solid ${colors.error}`
                            : `1px solid ${colors.border.default}`,
                    background:
                      selectedAnswer === option.value
                        ? `rgba(88, 204, 2, 0.05)`
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
                : `Đáp án đúng là ${exercise.correctAnswer}. Hãy thử lại để hiểu rõ hơn nhé!`
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
            <Text strong style={{ color: colors.primary.DEFAULT }}>
              {exercise.maxScore} điểm
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ListeningExercise;
