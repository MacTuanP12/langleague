import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider, Empty, Spin, Pagination, message } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getBookReviews, markReviewHelpful, deleteBookReview } from 'app/shared/services/book-review.service';
import StarRating from 'app/shared/components/StarRating';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReviewForm from './ReviewForm';
import showConfirmModal from 'app/shared/components/ConfirmModal';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

interface BookReviewsProps {
  bookId: number;
  bookTitle?: string;
  currentUserId?: number;
}

const BookReviews: React.FC<BookReviewsProps> = ({ bookId, bookTitle, currentUserId }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('book-reviews');
  const { entities: reviews, loading, totalItems } = useAppSelector(state => state.bookReview);
  const [page, setPage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadReviews();
  }, [bookId, page]);

  const loadReviews = () => {
    dispatch(getBookReviews({ bookId, page, size: pageSize }));
  };

  const handleLike = async (reviewId: number) => {
    try {
      await dispatch(markReviewHelpful(reviewId)).unwrap();
      message.success(t('bookReviews.messages.likeSuccess'));
    } catch (error) {
      message.error(t('bookReviews.messages.likeFailed'));
    }
  };

  const handleDelete = (reviewId: number) => {
    showConfirmModal({
      title: t('bookReviews.deleteReview'),
      content: t('bookReviews.messages.deleteConfirm'),
      async onConfirm() {
        try {
          await dispatch(deleteBookReview(reviewId)).unwrap();
          message.success(t('bookReviews.messages.deleteSuccess'));
          loadReviews();
        } catch (error) {
          message.error(t('bookReviews.messages.deleteFailed'));
        }
      },
      danger: true,
    });
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;

  // Group reviews by rating
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[32, 16]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
            <Title level={1} style={{ margin: 0, fontSize: '48px' }}>
              {averageRating.toFixed(1)}
            </Title>
            <StarRating value={averageRating} disabled size="large" />
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {t('bookReviews.stats.totalReviews', { count: totalItems })}
            </Text>
          </Col>

          <Col xs={24} md={16}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {ratingCounts.map(({ star, count }) => (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Text style={{ minWidth: '60px' }}>{star} stars</Text>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${totalItems > 0 ? (count / totalItems) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: '#fadb14',
                      }}
                    />
                  </div>
                  <Text type="secondary" style={{ minWidth: '40px', textAlign: 'right' }}>
                    {count}
                  </Text>
                </div>
              ))}
            </Space>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          {!showReviewForm ? (
            <Button type="primary" size="large" onClick={() => setShowReviewForm(true)}>
              {t('bookReviews.writeReview')}
            </Button>
          ) : (
            <Button onClick={() => setShowReviewForm(false)}>{t('common.cancel')}</Button>
          )}
        </div>

        {showReviewForm && (
          <div style={{ marginTop: '24px' }}>
            <ReviewForm bookId={bookId} bookTitle={bookTitle} onSuccess={handleReviewSubmitted} />
          </div>
        )}
      </Card>

      {/* Reviews List */}
      <Title level={3} style={{ marginBottom: '16px' }}>
        {t('bookReviews.title')}
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : reviews.length === 0 ? (
        <Empty description={t('bookReviews.noReviews')} />
      ) : (
        <>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {reviews.map(review => (
              <Card key={review.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <Text strong>{review.userDisplayName || review.userLogin || 'Anonymous'}</Text>
                    <div style={{ marginTop: '4px' }}>
                      <StarRating value={review.rating} disabled size="small" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text type="secondary">{dayjs(review.createdDate).fromNow()}</Text>
                    {currentUserId === review.appUserId && (
                      <div style={{ marginTop: '4px' }}>
                        <Button type="link" danger size="small" onClick={() => review.id && handleDelete(review.id)}>
                          {t('common.delete')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {review.title && (
                  <Title level={5} style={{ margin: '8px 0' }}>
                    {review.title}
                  </Title>
                )}

                <Paragraph style={{ margin: '12px 0' }}>{review.content}</Paragraph>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Button
                    type="text"
                    icon={<ThumbsUp size={16} />}
                    onClick={() => review.id && handleLike(review.id)}
                    style={{ color: review.isHelpful ? '#1890ff' : undefined }}
                  >
                    {t('bookReviews.helpful')} ({review.helpfulCount || 0})
                  </Button>
                </div>
              </Card>
            ))}
          </Space>

          {totalItems > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Pagination
                current={page + 1}
                total={totalItems}
                pageSize={pageSize}
                onChange={p => setPage(p - 1)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookReviews;
