import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Space, Typography, Empty, Spin, message, Avatar } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getChapterComments, createComment, updateComment, deleteComment } from 'app/shared/services/comment.service';
import CommentThread, { CommentData } from 'app/shared/components/CommentThread';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as ds from 'app/shared/styles/design-system';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface ChapterDiscussionProps {
  chapterId: number;
  currentUserId?: number;
}

const ChapterDiscussion: React.FC<ChapterDiscussionProps> = ({ chapterId, currentUserId }) => {
  const { t } = useTranslation('comments');
  const dispatch = useAppDispatch();
  const { entities: comments, loading } = useAppSelector(state => state.comment);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [chapterId]);

  const loadComments = () => dispatch(getChapterComments({ chapterId }));

  const handlePostComment = async () => {
    if (!currentUserId) return message.error(t('loginRequired'));
    if (!newComment.trim()) return message.warning(t('errors.empty'));

    setPosting(true);
    try {
      await dispatch(createComment({ content: newComment, chapter: { id: chapterId } })).unwrap();
      setNewComment('');
      message.success(t('messages.postSuccess'));
      loadComments();
    } catch (error) {
      message.error(t('messages.postFailed'));
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (parentCommentId: number, content: string) => {
    await dispatch(createComment({ content, chapter: { id: chapterId }, parentCommentId })).unwrap();
    loadComments();
  };

  const handleEdit = async (commentId: number, content: string) => {
    await dispatch(updateComment({ id: commentId, comment: { id: commentId, content } })).unwrap();
    loadComments();
  };

  const handleDelete = async (commentId: number) => {
    await dispatch(deleteComment(commentId)).unwrap();
    loadComments();
  };

  const commentData: CommentData[] = comments.map(c => ({
    id: c.id,
    content: c.content || '',
    createdAt: c.createdAt || '',
    appUser: c.appUser,
    replies: c.replies?.map(r => ({ id: r.id, content: r.content || '', createdAt: r.createdAt || '', appUser: r.appUser })),
  }));

  return (
    <div style={{ padding: `${ds.spacing.lg} 0` }}>
      <Card style={ds.cardBaseStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: ds.spacing.sm, marginBottom: ds.spacing.lg }}>
          <MessageSquare size={24} color={ds.colors.primary.DEFAULT} />
          <Title level={3} style={{ margin: 0 }}>{t('title')}</Title>
          <Text type="secondary">({t('stats.comments', { count: comments.length })})</Text>
        </div>

        <Card style={{ background: 'var(--bg-secondary)', marginBottom: ds.spacing.lg, borderRadius: ds.borderRadius.lg }} bordered={false}>
          <TextArea
            rows={4}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={currentUserId ? t('form.placeholder') : t('loginToComment')}
            style={{ ...ds.inputStyle, marginBottom: ds.spacing.md }}
            disabled={!currentUserId}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={handlePostComment} loading={posting} disabled={!newComment.trim() || !currentUserId}>
              {t('form.submit')}
            </Button>
          </div>
        </Card>

        {loading ? (
          <div style={{ textAlign: 'center', padding: ds.spacing.xxl }}><Spin size="large" /></div>
        ) : comments.length === 0 ? (
          <Empty description={t('noComments')} />
        ) : (
          <CommentThread comments={commentData} currentUserId={currentUserId} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  );
};

export default ChapterDiscussion;
