import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Tabs, Space, Progress, Statistic, Empty, Spin, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAchievements, getMyAchievements, AchievementDTO, UserAchievementDTO } from 'app/shared/services/achievement.service';
import { clearRecentUnlock } from 'app/shared/reducers/achievement.reducer';
import BadgeCard from 'app/shared/components/BadgeCard';
import { Trophy, Award, Star, Target } from 'lucide-react';
import UnlockNotification from './UnlockNotification';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Achievements: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['achievements', 'common']);
  const { achievements, myAchievements, loading, recentUnlock } = useAppSelector(state => state.achievement);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDTO | null>(null);

  useEffect(() => {
    dispatch(getAchievements({}));
    dispatch(getMyAchievements());
  }, []);

  // Create map of unlocked achievements
  const unlockedMap = new Map<number, UserAchievementDTO>();
  myAchievements.forEach(ua => {
    if (ua.achievementId) {
      unlockedMap.set(ua.achievementId, ua);
    }
  });

  // Filter achievements
  const filteredAchievements = selectedCategory === 'ALL' ? achievements : achievements.filter(a => a.category === selectedCategory);

  // Separate unlocked and locked
  const unlockedAchievements = filteredAchievements.filter(a => a.id && unlockedMap.has(a.id));
  const lockedAchievements = filteredAchievements.filter(a => a.id && !unlockedMap.has(a.id));

  // Calculate stats
  const totalPoints = myAchievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0);
  const completionRate = achievements.length > 0 ? (myAchievements.length / achievements.length) * 100 : 0;

  const handleAchievementClick = (achievement: AchievementDTO) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseNotification = () => {
    dispatch(clearRecentUnlock());
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Stats */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} bordered={false}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trophy size={48} color="white" />
            </div>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Achievements
            </Title>
          </Col>

          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.85)' }}>Unlocked</Text>}
              value={myAchievements.length}
              suffix={`/ ${achievements.length}`}
              valueStyle={{ color: 'white' }}
              prefix={<Award size={20} />}
            />
          </Col>

          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.85)' }}>Total Points</Text>}
              value={totalPoints}
              valueStyle={{ color: 'white' }}
              prefix={<Star size={20} />}
            />
          </Col>

          <Col xs={24} md={6}>
            <div>
              <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '8px' }}>Completion</Text>
              <Progress percent={Math.round(completionRate)} strokeColor="white" strokeLinecap="round" />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Category Tabs */}
      <Card>
        <Tabs activeKey={selectedCategory} onChange={setSelectedCategory}>
          <TabPane tab={t('achievements.categories.all')} key="ALL" />
          <TabPane tab={t('achievements.categories.streak')} key="STREAK" />
          <TabPane tab={t('achievements.categories.completion')} key="COMPLETION" />
          <TabPane tab={t('achievements.categories.vocabulary')} key="VOCABULARY" />
          <TabPane tab={t('achievements.categories.grammar')} key="GRAMMAR" />
          <TabPane tab={t('achievements.categories.exercise')} key="EXERCISE" />
          <TabPane tab={t('achievements.categories.social')} key="SOCIAL" />
          <TabPane tab={t('achievements.categories.special')} key="SPECIAL" />
        </Tabs>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  <Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Unlocked ({unlockedAchievements.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {unlockedAchievements.map(achievement => {
                    const userAchievement = achievement.id ? unlockedMap.get(achievement.id) : undefined;
                    return (
                      <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
                        <BadgeCard
                          name={achievement.name || ''}
                          description={achievement.description || ''}
                          iconUrl={achievement.iconUrl}
                          badgeColor={achievement.badgeColor}
                          rarity={achievement.rarity}
                          locked={false}
                          unlockedDate={userAchievement?.unlockedDate}
                          onClick={() => handleAchievementClick(achievement)}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <div>
                <Title level={4} style={{ marginBottom: '16px', color: '#8c8c8c' }}>
                  <Target size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Locked ({lockedAchievements.length})
                </Title>
                <Row gutter={[16, 16]}>
                  {lockedAchievements.map(achievement => (
                    <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
                      <BadgeCard
                        name={achievement.name || ''}
                        description={achievement.description || ''}
                        iconUrl={achievement.iconUrl}
                        badgeColor={achievement.badgeColor}
                        rarity={achievement.rarity}
                        locked={true}
                        requirement={achievement.requirement}
                        progress={0} // TODO: Fetch progress from backend
                        onClick={() => handleAchievementClick(achievement)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {filteredAchievements.length === 0 && <Empty description={t('achievements.messages.noAchievements')} />}
          </Space>
        )}
      </Card>

      {/* Achievement Details Modal */}
      <Modal open={!!selectedAchievement} onCancel={() => setSelectedAchievement(null)} footer={null} centered width={600}>
        {selectedAchievement && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            {selectedAchievement.iconUrl ? (
              <img
                src={selectedAchievement.iconUrl}
                alt={selectedAchievement.name}
                style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: '16px' }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: selectedAchievement.badgeColor || '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Trophy size={60} color="white" />
              </div>
            )}
            <Title level={2}>{selectedAchievement.name}</Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {selectedAchievement.description}
            </Text>
            <div style={{ marginTop: '24px' }}>
              <Space size="large">
                <Statistic title="Points" value={selectedAchievement.points} prefix={<Star size={16} />} />
                <Statistic title="Rarity" value={selectedAchievement.rarity} />
                <Statistic title="Category" value={selectedAchievement.category} />
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Unlock Notification */}
      {recentUnlock && <UnlockNotification achievement={recentUnlock} onClose={handleCloseNotification} />}
    </div>
  );
};

export default Achievements;
