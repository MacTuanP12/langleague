import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Space, Typography, Empty, Spin, message, Avatar } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getChapterComments, createComment, updateComment, deleteComment } from 'app/shared/services/comment.service';
import CommentThread, { CommentData } from 'app/shared/components/CommentThread';
import { MessageCircle } from 'lucide-react';
import { t } from 'i18next';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface ChapterDiscussionProps {
  chapterId: number;
  chapterTitle?: string;
  currentUserId?: number;
}

const ChapterDiscussion: React.FC<ChapterDiscussionProps> = ({ chapterId, chapterTitle, currentUserId }) => {
  const dispatch = useAppDispatch();
  const { entities: comments, loading } = useAppSelector(state => state.comment);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [chapterId]);

  const loadComments = () => {
    dispatch(getChapterComments({ chapterId }));
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    setPosting(true);
    try {
      await dispatch(
        createComment({
          content: newComment,
          chapter: { id: chapterId },
        }),
      ).unwrap();
      setNewComment('');
      message.success('Comment posted successfully');
      loadComments();
    } catch (error) {
      message.error('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (parentCommentId: number, content: string) => {
    await dispatch(
      createComment({
        content,
        chapter: { id: chapterId },
        parentCommentId,
      }),
    ).unwrap();
    loadComments();
  };

  const handleEdit = async (commentId: number, content: string) => {
    await dispatch(
      updateComment({
        id: commentId,
        comment: { id: commentId, content },
      }),
    ).unwrap();
    loadComments();
  };

  const handleDelete = async (commentId: number) => {
    await dispatch(deleteComment(commentId)).unwrap();
    loadComments();
  };

  // Transform comments to CommentData format
  const commentData: CommentData[] = comments.map(c => ({
    id: c.id,
    content: c.content || '',
    createdAt: c.createdAt || '',
    appUser: c.appUser,
    replies: c.replies?.map(r => ({
      id: r.id,
      content: r.content || '',
      createdAt: r.createdAt || '',
      appUser: r.appUser,
    })),
  }));

  return (
    <div style={{ padding: '24px 0' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <MessageCircle size={24} />
          <Title level={3} style={{ margin: 0 }}>
            {t('comments.title')}
          </Title>
          <Text type="secondary">({t('comments.stats.comments', { count: comments.length })})</Text>
        </div>

        {/* New Comment Form */}
        <Card style={{ backgroundColor: '#fafafa', marginBottom: '24px' }} bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <TextArea
              rows={4}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={t('comments.form.placeholder')}
              style={{ borderRadius: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" onClick={handlePostComment} loading={posting} disabled={!newComment.trim()}>
                {t('comments.form.submit')}
              </Button>
            </div>
          </Space>
        </Card>

        {/* Comments Thread */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : comments.length === 0 ? (
          <Empty description={t('comments.noComments')} />
        ) : (
          <CommentThread
            comments={commentData}
            currentUserId={currentUserId}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
};

export default ChapterDiscussion;
