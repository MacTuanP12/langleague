import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col, Alert, message, Spin, Tag, Divider } from 'antd';
import { AudioOutlined, CheckCircleOutlined, LeftOutlined, PlayCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { upsertChapterProgress } from 'app/shared/services/progress.service';
import { ISpeakingExercise } from 'app/shared/model/models';

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
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            }}
          >
            <AudioOutlined style={{ fontSize: '40px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#1a1a1a' }}>
            Bài tập Luyện nói
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Luyện phát âm và diễn đạt tiếng Hàn
          </Text>
        </div>

        {/* Instructions */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(238, 90, 111, 0.05) 100%)',
            border: '2px solid rgba(255, 107, 107, 0.2)',
            borderRadius: '12px',
            marginBottom: '32px',
          }}
        >
          <Title level={4} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
            <SoundOutlined style={{ marginRight: '8px', color: '#ff6b6b' }} />
            Yêu cầu:
          </Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#262626', marginBottom: '16px' }}>{exercise.prompt}</Paragraph>

          <Divider style={{ margin: '20px 0' }} />

          <div>
            <Text strong style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Cụm từ mục tiêu:
            </Text>
            <div
              style={{
                marginTop: '12px',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 107, 0.3)',
              }}
            >
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#ff6b6b',
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
              background: 'rgba(102, 126, 234, 0.05)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              marginBottom: '32px',
            }}
          >
            <Row align="middle" justify="space-between">
              <Col>
                <Text strong style={{ fontSize: '15px' }}>
                  <PlayCircleOutlined style={{ marginRight: '8px', color: '#667eea' }} />
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '20px',
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
            background: isRecording ? 'rgba(255, 107, 107, 0.05)' : 'rgba(102, 126, 234, 0.05)',
            border: `2px solid ${isRecording ? 'rgba(255, 107, 107, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
            borderRadius: '12px',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Recording Timer */}
            {isRecording && (
              <div>
                <Tag color="red" style={{ fontSize: '16px', padding: '8px 16px' }}>
                  ⏺ Đang ghi âm...
                </Tag>
                <div style={{ marginTop: '12px' }}>
                  <Text style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'monospace', color: '#ff6b6b' }}>
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
                background: isRecording
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: isRecording ? '0 8px 24px rgba(255, 107, 107, 0.4)' : '0 8px 24px rgba(102, 126, 234, 0.3)',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                cursor: 'pointer',
              }}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              <AudioOutlined style={{ fontSize: '48px', color: '#fff' }} />
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
                  fontSize: '16px',
                  borderRadius: '24px',
                  padding: '0 40px',
                  background: isRecording ? undefined : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                  border: isRecording ? undefined : 'none',
                  fontWeight: 600,
                }}
              >
                {isRecording ? '⏹ Dừng ghi âm' : '🎤 Bắt đầu ghi âm'}
              </Button>
            )}

            <Text type="secondary" style={{ fontSize: '14px' }}>
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
            style={{ marginBottom: '24px', borderRadius: '12px' }}
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
            background: 'rgba(255, 107, 107, 0.05)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Text type="secondary">
            Điểm tối đa:{' '}
            <Text strong style={{ color: '#ff6b6b' }}>
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
              box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 12px 32px rgba(255, 107, 107, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeakingExercise;
