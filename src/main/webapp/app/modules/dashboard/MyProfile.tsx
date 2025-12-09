import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Spin, Row, Col, Tag, Empty, Button } from 'antd';
import {
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAccount } from 'app/shared/services/account.service';
import { getCurrentAppUser } from 'app/shared/services/app-user.service';
import { getMyAchievements } from 'app/shared/services/achievement.service';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// ============================================
// HELPER FUNCTIONS
// ============================================

const getDisplayName = (userData: any, appUserData: any): string => {
  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
  return appUserData?.displayName || fullName || userData?.login || 'User';
};

const getBio = (appUserData: any, currentLocale: string): string => {
  return appUserData?.bio || (currentLocale === 'vi' ? 'Chưa có tiểu sử' : 'No bio yet');
};

const getAvatarUrl = (userData: any, appUserData: any): string | undefined => {
  return userData?.imageUrl || appUserData?.avatar;
};

const getUserStats = (appUserData: any) => ({
  totalPoints: appUserData?.totalPoints || appUserData?.points || 0,
  currentLevel: appUserData?.currentLevel || appUserData?.level || 1,
  streakDays: appUserData?.streakDays || appUserData?.streak || 0,
  totalStudyTime: appUserData?.totalStudyTime || 0,
});

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <Card style={{ borderRadius: 12, textAlign: 'center' }} styles={{ body: { padding: '20px 12px' } }}>
    {icon}
    <div>
      <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color }}>{value}</div>
    </div>
  </Card>
);

interface AchievementItemProps {
  achievement: any;
  currentLocale: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, currentLocale }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ffa940 0%, #ff7a45 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 8px',
        boxShadow: '0 2px 8px rgba(255,169,64,0.3)',
      }}
    >
      <TrophyOutlined style={{ fontSize: 28, color: 'white' }} />
    </div>
    <Text strong style={{ fontSize: 12, display: 'block' }}>
      {achievement.achievement?.name || achievement.name || 'Achievement'}
    </Text>
    <Text type="secondary" style={{ fontSize: 11 }}>
      +{achievement.achievement?.points || achievement.points || 0} {currentLocale === 'vi' ? 'điểm' : 'pts'}
    </Text>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const MyProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [appUserData, setAppUserData] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userResult = await dispatch(getAccount()).unwrap();
        setUserData(userResult);

        try {
          const appUserResult = await dispatch(getCurrentAppUser()).unwrap();
          setAppUserData(appUserResult);
        } catch (error) {
          console.log('AppUser profile not found');
        }

        try {
          const achievementsResult = await dispatch(getMyAchievements()).unwrap();
          setAchievements(achievementsResult || []);
        } catch (error) {
          console.log('Could not load achievements');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip={currentLocale === 'vi' ? 'Đang tải hồ sơ...' : 'Loading profile...'} />
      </div>
    );
  }

  const displayName = getDisplayName(userData, appUserData);
  const bio = getBio(appUserData, currentLocale);
  const avatarUrl = getAvatarUrl(userData, appUserData);
  const stats = getUserStats(appUserData);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header Card */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            marginBottom: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
            </Col>
            <Col xs={24} md={18}>
              <div style={{ color: 'white' }}>
                <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
                  {displayName}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <MailOutlined />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>{userData?.email}</Text>
                </div>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 16, fontSize: 15 }}>{bio}</Paragraph>
                <Button icon={<SettingOutlined />} onClick={() => navigate('/dashboard/settings')} size="large" style={{ borderRadius: 8 }}>
                  {currentLocale === 'vi' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <StatCard
              icon={<TrophyOutlined style={{ fontSize: 32, color: '#ffa940', marginBottom: 8 }} />}
              label={currentLocale === 'vi' ? 'Điểm' : 'Points'}
              value={stats.totalPoints}
              color="#1890ff"
            />
          </Col>
          <Col xs={12} md={6}>
            <StatCard
              icon={<ThunderboltOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />}
              label={currentLocale === 'vi' ? 'Cấp độ' : 'Level'}
              value={stats.currentLevel}
              color="#52c41a"
            />
          </Col>
          <Col xs={12} md={6}>
            <StatCard
              icon={<FireOutlined style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 8 }} />}
              label={currentLocale === 'vi' ? 'Streak' : 'Streak Days'}
              value={`${stats.streakDays} ${currentLocale === 'vi' ? 'ngày' : 'days'}`}
              color="#ff4d4f"
            />
          </Col>
          <Col xs={12} md={6}>
            <StatCard
              icon={<ClockCircleOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />}
              label={currentLocale === 'vi' ? 'Thời gian học' : 'Study Time'}
              value={`${Math.floor(stats.totalStudyTime / 60)} ${currentLocale === 'vi' ? 'phút' : 'mins'}`}
              color="#722ed1"
            />
          </Col>
        </Row>

        {/* Achievements Section */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrophyOutlined style={{ color: '#ffa940' }} />
              <span>{currentLocale === 'vi' ? 'Thành tích' : 'Achievements'}</span>
            </div>
          }
          style={{ borderRadius: 12 }}
          extra={
            <Tag color="blue">
              {achievements.length} {currentLocale === 'vi' ? 'mở khóa' : 'unlocked'}
            </Tag>
          }
        >
          {achievements.length > 0 ? (
            <Row gutter={[16, 16]}>
              {achievements.slice(0, 6).map((achievement: any, index: number) => (
                <Col xs={12} sm={8} md={4} key={index}>
                  <AchievementItem achievement={achievement} currentLocale={currentLocale} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description={currentLocale === 'vi' ? 'Chưa có thành tích nào' : 'No achievements yet'}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          {achievements.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="link" onClick={() => navigate('/dashboard/achievements')}>
                {currentLocale === 'vi' ? 'Xem tất cả' : 'View all'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
