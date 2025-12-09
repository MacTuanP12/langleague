import React, { useState } from 'react';
import { Avatar, Button, Input, Space, Typography, message } from 'antd';
import { Reply, Trash2, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Text } = Typography;

export interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  appUser?: {
    id?: number;
    login?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  replies?: CommentData[];
}

interface CommentThreadProps {
  comments: CommentData[];
  currentUserId?: number;
  onReply?: (commentId: number, content: string) => Promise<void>;
  onEdit?: (commentId: number, content: string) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
}

const CommentThread: React.FC<CommentThreadProps> = ({ comments, currentUserId, onReply, onEdit, onDelete }) => {
  const { t } = useTranslation(['comments', 'common']);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (commentId: number) => {
    if (!replyContent.trim()) {
      message.warning('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      await onReply?.(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
      message.success('Reply posted successfully');
    } catch (error) {
      message.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) {
      message.warning('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      await onEdit?.(commentId, editContent);
      setEditContent('');
      setEditingId(null);
      message.success('Comment updated successfully');
    } catch (error) {
      message.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await onDelete?.(commentId);
      message.success(t('comments.messages.deleteSuccess'));
    } catch (error) {
      message.error(t('comments.messages.deleteFailed'));
    }
  };

  const renderComment = (comment: CommentData, isReply = false) => {
    const isOwner = currentUserId === comment.appUser?.id;
    const isEditing = editingId === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div
        key={comment.id}
        style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: isReply ? '#fafafa' : 'white',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <Avatar
            src={comment.appUser?.avatarUrl || '/content/images/default-avatar.png'}
            alt={comment.appUser?.displayName || comment.appUser?.login}
          />

          <div style={{ flex: 1 }}>
            {/* Author and timestamp */}
            <div style={{ marginBottom: '8px' }}>
              <Text strong>{comment.appUser?.displayName || comment.appUser?.login || 'Anonymous'}</Text>
              <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                {dayjs(comment.createdAt).fromNow()}
              </Text>
            </div>

            {/* Content */}
            {isEditing ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea
                  rows={3}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder={t('comments.form.editPlaceholder')}
                />
                <Space>
                  <Button type="primary" size="small" onClick={() => handleEdit(comment.id)} loading={submitting}>
                    {t('common.save')}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </Space>
              </Space>
            ) : (
              <Text>{comment.content}</Text>
            )}

            {/* Actions */}
            {!isEditing && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
                {!isReply && (
                  <Button
                    type="text"
                    size="small"
                    icon={<Reply size={14} />}
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setReplyContent('');
                    }}
                  >
                    {t('comments.reply')}
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      type="text"
                      size="small"
                      icon={<Edit2 size={14} />}
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      {t('comments.actions.edit')}
                    </Button>
                    <Button type="text" size="small" danger icon={<Trash2 size={14} />} onClick={() => handleDelete(comment.id)}>
                      {t('comments.actions.delete')}
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Reply form */}
            {isReplying && (
              <div style={{ marginTop: '12px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <TextArea
                    rows={3}
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder={t('comments.form.replyPlaceholder')}
                  />
                  <Space>
                    <Button type="primary" size="small" onClick={() => handleReply(comment.id)} loading={submitting}>
                      {t('comments.form.postReply')}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      {t('common.cancel')}
                    </Button>
                  </Space>
                </Space>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: '16px', marginLeft: '12px' }}>{comment.replies.map(reply => renderComment(reply, true))}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <div className="comment-thread">{comments.map(comment => renderComment(comment))}</div>;
};

export default CommentThread;
