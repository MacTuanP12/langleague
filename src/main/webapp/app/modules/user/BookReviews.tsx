import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider, Empty, Spin, Pagination, message, Progress } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getBookReviews, markReviewHelpful, deleteBookReview } from 'app/shared/services/book-review.service';
import StarRating from 'app/shared/components/StarRating';
import { ThumbsUp, MessageSquare, Star } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReviewForm from './ReviewForm';
import showConfirmModal from 'app/shared/components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import * as ds from 'app/shared/styles/design-system';

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
  const pageSize = 5;

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

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div style={{ padding: `${ds.spacing.lg} 0` }}>
      <Card style={{ ...ds.cardBaseStyle, marginBottom: ds.spacing.lg }}>
        <Row gutter={[32, 16]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center', borderRight: `1px solid ${ds.colors.border.light}` }}>
            <Title level={1} style={{ margin: 0, fontSize: 48, color: ds.colors.warning }}>{averageRating.toFixed(1)}</Title>
            <StarRating value={averageRating} disabled size="large" />
            <Text type="secondary" style={{ display: 'block', marginTop: ds.spacing.sm }}>
              {t('bookReviews.stats.totalReviews', { count: totalItems })}
            </Text>
          </Col>
          <Col xs={24} md={16}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {ratingCounts.map(({ star, count }) => (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: ds.spacing.sm }}>
                  <Text style={{ minWidth: 60 }}>{star} <Star size={14} fill={ds.colors.warning} color={ds.colors.warning} /></Text>
                  <Progress percent={totalItems > 0 ? (count / totalItems) * 100 : 0} showInfo={false} strokeColor={ds.colors.warning} trailColor={ds.colors.background.tertiary} />
                  <Text type="secondary" style={{ minWidth: 40, textAlign: 'right' }}>{count}</Text>
                </div>
              ))}
            </Space>
          </Col>
        </Row>
        {currentUserId && (
          <>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" size="large" onClick={() => setShowReviewForm(!showReviewForm)}>{showReviewForm ? t('common.cancel') : t('bookReviews.writeReview')}</Button>
            </div>
            {showReviewForm && <div style={{ marginTop: ds.spacing.lg }}><ReviewForm bookId={bookId} bookTitle={bookTitle} onSuccess={handleReviewSubmitted} /></div>}
          </>
        )}
      </Card>

      <Title level={3} style={{ marginBottom: ds.spacing.md }}>{t('bookReviews.title')}</Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: ds.spacing.xxl }}><Spin size="large" /></div>
      ) : reviews.length === 0 ? (
        <Card style={ds.cardBaseStyle}><Empty description={t('bookReviews.noReviews')} /></Card>
      ) : (
        <>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {reviews.map(review => (
              <Card key={review.id} style={ds.cardBaseStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: ds.spacing.md }}>
                  <div>
                    <Text strong>{review.userDisplayName || review.userLogin || 'Anonymous'}</Text>
                    <div style={{ marginTop: ds.spacing.xs }}><StarRating value={review.rating} disabled size="small" /></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text type="secondary">{dayjs(review.createdDate).fromNow()}</Text>
                    {currentUserId === review.appUserId && <div style={{ marginTop: ds.spacing.xs }}><Button type="link" danger size="small" onClick={() => review.id && handleDelete(review.id)}>{t('common.delete')}</Button></div>}
                  </div>
                </div>
                {review.title && <Title level={5} style={{ margin: `${ds.spacing.sm} 0` }}>{review.title}</Title>}
                <Paragraph style={{ margin: `${ds.spacing.md} 0` }}>{review.content}</Paragraph>
                <Button type="text" icon={<ThumbsUp size={16} />} onClick={() => review.id && handleLike(review.id)} style={{ color: review.isHelpful ? ds.colors.info : undefined }} disabled={!currentUserId}>
                  {t('bookReviews.helpful')} ({review.helpfulCount || 0})
                </Button>
              </Card>
            ))}
          </Space>
          {totalItems > pageSize && <div style={{ textAlign: 'center', marginTop: ds.spacing.lg }}><Pagination current={page + 1} total={totalItems} pageSize={pageSize} onChange={p => setPage(p - 1)} showSizeChanger={false} /></div>}
        </>
      )}
    </div>
  );
};

export default BookReviews;
