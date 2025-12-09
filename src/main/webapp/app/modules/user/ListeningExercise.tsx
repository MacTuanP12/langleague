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
import { IListeningExercise } from 'app/shared/model/models';

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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            <AudioOutlined style={{ fontSize: '40px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#1a1a1a' }}>
            Bài tập Luyện nghe
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Nghe kỹ và chọn đáp án đúng nhất
          </Text>
        </div>

        {/* Image */}
        {exercise.imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Image
              src={exercise.imageUrl}
              alt="Listening exercise"
              style={{ borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }}
              preview={false}
            />
          </div>
        )}

        {/* Audio Player with Howler.js */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '12px',
            marginBottom: '32px',
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Progress Bar */}
            <div>
              <Slider value={progress} onChange={handleSeek} tooltip={{ formatter: null }} style={{ margin: '0 8px' }} />
              <Row justify="space-between" style={{ marginTop: '8px', padding: '0 8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatTime(currentTime)}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
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
                <Text type="secondary" style={{ fontSize: '14px' }}>
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
                      borderRadius: '6px',
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
                <SoundOutlined style={{ fontSize: '18px', color: '#667eea' }} />
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
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ marginBottom: '20px', color: '#1a1a1a' }}>
            Câu hỏi:
          </Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#262626' }}>{exercise.question}</Paragraph>
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
                        ? '2px solid #667eea'
                        : isSubmitted && option.value === exercise.correctAnswer
                          ? '2px solid #52c41a'
                          : isSubmitted && selectedAnswer === option.value
                            ? '2px solid #ff4d4f'
                            : '1px solid #d9d9d9',
                    background:
                      selectedAnswer === option.value
                        ? 'rgba(102, 126, 234, 0.05)'
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
                : `Đáp án đúng là ${exercise.correctAnswer}. Hãy thử lại để hiểu rõ hơn nhé!`
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

        {/* Score Info */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Text type="secondary">
            Điểm tối đa:{' '}
            <Text strong style={{ color: '#667eea' }}>
              {exercise.maxScore} điểm
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ListeningExercise;
