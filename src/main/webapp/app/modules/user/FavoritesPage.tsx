import React, { useEffect } from 'react';
import { Card, Row, Col, Typography, Empty, Spin, Button, message } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getFavorites, removeFavorite } from 'app/shared/services/favorite.service';
import { Heart, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import showConfirmModal from 'app/shared/components/ConfirmModal';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['favorites', 'common']);
  const navigate = useNavigate();
  const { entities: favorites, loading } = useAppSelector(state => state.favorite);

  useEffect(() => {
    dispatch(getFavorites());
  }, []);

  const handleRemove = (chapterId: number, chapterTitle: string) => {
    showConfirmModal({
      title: 'Remove from Favorites',
      content: `Are you sure you want to remove "${chapterTitle}" from your favorites?`,
      async onConfirm(): Promise<void> {
        try {
          await dispatch(removeFavorite(chapterId)).unwrap();
          message.success('Removed from favorites');
        } catch (error) {
          message.error('Failed to remove from favorites');
        }
      },
      danger: true,
    });
  };

  const handleNavigate = (bookId?: number, chapterId?: number) => {
    if (bookId && chapterId) {
      navigate(`/dashboard/books/${bookId}/chapter/${chapterId}`);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Heart size={32} color="#eb2f96" fill="#eb2f96" />
        <Title level={2} style={{ margin: 0 }}>
          {t('favorites.title')}
        </Title>
        <Text type="secondary">({t('favorites.stats.chapters', { count: favorites.length })})</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : favorites.length === 0 ? (
        <Card>
          <Empty description="No favorite chapters yet" image={<Heart size={64} color="#d9d9d9" />} style={{ padding: '48px 0' }}>
            <Button type="primary" onClick={() => navigate('/dashboard/books')}>
              Browse Books
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {favorites.map(chapter => (
            <Col xs={24} md={12} lg={8} key={chapter.id}>
              <Card
                hoverable
                cover={
                  chapter.book?.coverImageUrl ? (
                    <div
                      style={{
                        height: 180,
                        background: `url(${chapter.book.coverImageUrl}) center/cover`,
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          cursor: 'pointer',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          if (chapter.id) {
                            handleRemove(chapter.id, chapter.title || '');
                          }
                        }}
                      >
                        <Heart size={24} color="#eb2f96" fill="#eb2f96" />
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 180,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <BookOpen size={48} color="white" />
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          cursor: 'pointer',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          if (chapter.id) {
                            handleRemove(chapter.id, chapter.title || '');
                          }
                        }}
                      >
                        <Heart size={24} color="white" fill="white" />
                      </div>
                    </div>
                  )
                }
                onClick={() => handleNavigate(chapter.book?.id, chapter.id)}
              >
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  {chapter.book?.title}
                </Text>
                <Title level={5} style={{ margin: '0 0 8px' }}>
                  {chapter.title}
                </Title>
                <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: '12px' }}>
                  {chapter.description || 'No description available'}
                </Paragraph>
                <Button type="link" icon={<ArrowRight size={16} />} style={{ padding: 0 }}>
                  Continue Learning
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoritesPage;
