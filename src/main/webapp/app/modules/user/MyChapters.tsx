import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Tag,
  Progress,
  Empty,
  Spin,
  Tabs,
  Statistic,
  List,
  Avatar,
  message,
  Modal,
  Input,
  Tooltip,
  Badge,
} from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  RightOutlined,
  HeartOutlined,
  HeartFilled,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  TagsOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'app/shared/utils/useTranslation';
import {
  getMyChapters,
  getMyInProgressChapters,
  getMyCompletedChapters,
  getSavedChapters,
  getFavoriteChapters,
  saveChapter,
  removeChapter,
  toggleFavorite,
  updateNotes,
  updateTags,
  MyChapterDTO,
  UserChapterDTO,
} from 'app/shared/services/my-chapter-hybrid.service';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const MyChapters: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['staff', 'user', 'common']);
  const [chapters, setChapters] = useState<(MyChapterDTO | UserChapterDTO)[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [tagsModalVisible, setTagsModalVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [notesInput, setNotesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    loadChapters('all');
  }, []);

  const loadChapters = async (tab: string) => {
    try {
      setLoading(true);
      let response;

      switch (tab) {
        case 'all': {
          // Merge learned and saved chapters
          const learnedRes = await Promise.all([getMyChapters(), getSavedChapters()]);
          const [learned, saved] = learnedRes;
          const combined: any[] = [...learned.data, ...saved.data];
          const uniqueMap = new Map();
          combined.forEach((ch: any) => {
            const key = ch.chapterId || ch.chapter?.id;
            if (!uniqueMap.has(key) || ch.isFavorite) {
              uniqueMap.set(key, ch);
            }
          });
          setChapters(Array.from(uniqueMap.values()));
          setLoading(false);
          return;
        }
        case 'learning':
          response = await getMyInProgressChapters();
          break;
        case 'completed':
          response = await getMyCompletedChapters();
          break;
        case 'saved':
          response = await getSavedChapters();
          break;
        case 'favorites':
          response = await getFavoriteChapters();
          break;
        default:
          response = await getMyChapters();
      }

      setChapters(response.data);
    } catch (error) {
      console.error('Failed to load chapters:', error);
      message.error('Không thể tải danh sách chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    loadChapters(key);
  };

  const handleSaveChapter = async (chapterId: number) => {
    try {
      await saveChapter(chapterId);
      message.success('Đã lưu chapter vào thư viện');
      loadChapters(activeTab);
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.warning('Chapter đã được lưu trước đó');
      } else {
        message.error('Không thể lưu chapter');
      }
    }
  };

  const handleRemoveChapter = (chapterId: number, chapterTitle: string) => {
    Modal.confirm({
      title: 'Xóa chapter',
      content: `Bạn có chắc muốn xóa "${chapterTitle}" khỏi thư viện?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          console.log('🗑️ Removing chapter:', chapterId);
          await removeChapter(chapterId);
          message.success('Đã xóa chapter khỏi thư viện');
          // Force reload to update UI
          await loadChapters(activeTab);
        } catch (error: any) {
          console.error('❌ Error removing chapter:', error);
          message.error(error.response?.data?.message || 'Không thể xóa chapter');
        }
      },
    });
  };

  const handleToggleFavorite = async (chapterId: number) => {
    try {
      console.log('⭐ Toggling favorite for chapter:', chapterId);
      const response = await toggleFavorite(chapterId);
      console.log('✅ Toggle favorite response:', response);
      message.success('Đã cập nhật yêu thích');
      // Force reload to update UI
      await loadChapters(activeTab);
    } catch (error: any) {
      console.error('❌ Error toggling favorite:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      message.error(error.response?.data?.message || error.response?.data?.title || 'Không thể cập nhật yêu thích');
    }
  };

  const handleOpenNotesModal = (chapter: any) => {
    setSelectedChapter(chapter);
    setNotesInput((chapter as UserChapterDTO).notes || '');
    setNotesModalVisible(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedChapter) return;
    try {
      const chapterId = 'chapterId' in selectedChapter ? selectedChapter.chapterId : selectedChapter.chapter?.id;
      await updateNotes(chapterId, notesInput);
      message.success('Đã lưu ghi chú');
      setNotesModalVisible(false);
      loadChapters(activeTab);
    } catch (error) {
      message.error('Không thể lưu ghi chú');
    }
  };

  const handleOpenTagsModal = (chapter: any) => {
    setSelectedChapter(chapter);
    setTagsInput((chapter as UserChapterDTO).tags || '');
    setTagsModalVisible(true);
  };

  const handleSaveTags = async () => {
    if (!selectedChapter) return;
    try {
      const chapterId = 'chapterId' in selectedChapter ? selectedChapter.chapterId : selectedChapter.chapter?.id;
      await updateTags(chapterId, tagsInput);
      message.success('Đã lưu tags');
      setTagsModalVisible(false);
      loadChapters(activeTab);
    } catch (error) {
      message.error('Không thể lưu tags');
    }
  };

  const handleContinueLearning = (chapter: any) => {
    // Get chapter and book IDs
    const chapterId = chapter.chapterId || chapter.chapter?.id || 0;
    const bookId = chapter.bookId || chapter.book?.id || 0;

    if (chapterId && bookId) {
      // Navigate to correct route: /dashboard/books/:bookId/chapter/:chapterId
      navigate(`/dashboard/books/${bookId}/chapter/${chapterId}`);
    } else {
      message.error('Không thể tìm thấy thông tin chapter');
    }
  };

  const handleViewBook = (bookId: number) => {
    navigate(`/dashboard/books/${bookId}`);
  };

  const getChapterId = (chapter: any): number => {
    // Support both MyChapterDTO (chapterId) and UserChapterDTO (chapter.id or id from API response)
    return chapter.chapterId || chapter.chapter?.id || chapter.id || 0;
  };

  const getChapterTitle = (chapter: any): string => {
    return chapter.chapterTitle || '';
  };

  const getBookId = (chapter: any): number => {
    return chapter.bookId || 0;
  };

  const getBookTitle = (chapter: any): string => {
    return chapter.bookTitle || '';
  };

  const getProgressPercent = (chapter: any): number => {
    return chapter.progressPercent || 0;
  };

  const isCompleted = (chapter: any): boolean => {
    return chapter.completed || false;
  };

  const isSaved = (chapter: any): boolean => {
    return 'savedAt' in chapter;
  };

  const isFavorite = (chapter: any): boolean => {
    return 'isFavorite' in chapter && chapter.isFavorite;
  };

  const getStatusTag = (chapter: any) => {
    if (isCompleted(chapter)) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã hoàn thành
        </Tag>
      );
    }
    const percent = getProgressPercent(chapter);
    if (percent > 0) {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          Đang học
        </Tag>
      );
    }
    return (
      <Tag icon={<PlayCircleOutlined />} color="default">
        Chưa bắt đầu
      </Tag>
    );
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return '#52c41a';
    if (percent >= 50) return '#1890ff';
    return '#faad14';
  };

  const formatLastAccessed = (lastAccessed: string) => {
    if (!lastAccessed) return '';
    const date = new Date(lastAccessed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const stats = {
    total: chapters.length,
    inProgress: chapters.filter(c => !isCompleted(c) && getProgressPercent(c) > 0).length,
    completed: chapters.filter(c => isCompleted(c)).length,
    notStarted: chapters.filter(c => getProgressPercent(c) === 0).length,
    saved: chapters.filter(c => isSaved(c)).length,
    favorites: chapters.filter(c => isFavorite(c)).length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined /> Chapters Của Tôi
        </Title>
        <Paragraph type="secondary">Quản lý và theo dõi tiến trình học các chapters mà bạn đã lưu</Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Tổng số" value={stats.total} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Đang học" value={stats.inProgress} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Hoàn thành" value={stats.completed} prefix={<TrophyOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Chưa bắt đầu" value={stats.notStarted} prefix={<PlayCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Đã lưu" value={stats.saved} prefix={<SaveOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic title="Yêu thích" value={stats.favorites} prefix={<StarFilled />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab={`Tất cả (${chapters.length})`} key="all" />
          <TabPane tab={`Đang học`} key="learning" />
          <TabPane tab={`Đã hoàn thành`} key="completed" />
          <TabPane tab={`Đã lưu`} key="saved" />
          <TabPane tab={`⭐ Yêu thích`} key="favorites" />
        </Tabs>

        <Spin spinning={loading}>
          {chapters.length === 0 ? (
            <Empty
              description={
                activeTab === 'all'
                  ? 'Bạn chưa có chapter nào. Hãy bắt đầu học một sách mới!'
                  : activeTab === 'learning'
                    ? 'Bạn chưa có chapter nào đang học'
                    : activeTab === 'completed'
                      ? 'Bạn chưa hoàn thành chapter nào'
                      : activeTab === 'saved'
                        ? 'Bạn chưa lưu chapter nào. Click nút "Lưu" để thêm vào thư viện!'
                        : 'Bạn chưa có chapter yêu thích nào'
              }
              style={{ padding: '48px 0' }}
            >
              {activeTab === 'all' && (
                <Button type="primary" onClick={() => navigate('/books')}>
                  Khám phá sách
                </Button>
              )}
            </Empty>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={chapters}
              renderItem={chapter => {
                const chapterId = getChapterId(chapter);
                const chapterTitle = getChapterTitle(chapter);
                const bookId = getBookId(chapter);
                const bookTitle = getBookTitle(chapter);
                const progressPercent = getProgressPercent(chapter);
                const completed = isCompleted(chapter);
                const saved = isSaved(chapter);
                const favorite = isFavorite(chapter);
                const notes = 'notes' in chapter ? chapter.notes : '';
                const tags = 'tags' in chapter ? chapter.tags : '';
                const lastAccessed =
                  'lastAccessed' in chapter ? chapter.lastAccessed : 'lastAccessedAt' in chapter ? chapter.lastAccessedAt : '';
                const chapterOrderIndex = 'chapterOrderIndex' in chapter ? chapter.chapterOrderIndex : 0;
                const bookThumbnail = 'bookThumbnail' in chapter ? chapter.bookThumbnail : '';
                const bookLevel = 'bookLevel' in chapter ? chapter.bookLevel : '';

                return (
                  <List.Item
                    key={chapterId}
                    actions={[
                      <Tooltip key="favorite" title={favorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
                        <Button
                          type="text"
                          icon={favorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                          onClick={() => handleToggleFavorite(chapterId)}
                        />
                      </Tooltip>,
                      saved ? (
                        <Tooltip key="remove" title="Xóa khỏi thư viện">
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveChapter(chapterId, chapterTitle)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip key="save" title="Lưu vào thư viện">
                          <Button type="text" icon={<SaveOutlined />} onClick={() => handleSaveChapter(chapterId)} />
                        </Tooltip>
                      ),
                      <Button key="continue" type="primary" icon={<RightOutlined />} onClick={() => handleContinueLearning(chapter)}>
                        {completed ? 'Xem lại' : progressPercent > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                      </Button>,
                      <Button key="view" type="link" onClick={() => handleViewBook(bookId)}>
                        Xem sách
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={favorite ? <StarFilled style={{ color: '#faad14' }} /> : 0}>
                          <Avatar size={64} src={bookThumbnail} icon={!bookThumbnail && <BookOutlined />} shape="square" />
                        </Badge>
                      }
                      title={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Space>
                            <Text strong style={{ fontSize: '16px' }}>
                              Chapter {chapterOrderIndex}: {chapterTitle}
                            </Text>
                            {getStatusTag(chapter)}
                            {saved && (
                              <Tag icon={<SaveOutlined />} color="purple">
                                Đã lưu
                              </Tag>
                            )}
                          </Space>
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            <BookOutlined /> {bookTitle}
                            {bookLevel && (
                              <Tag color="blue" style={{ marginLeft: '8px' }}>
                                {bookLevel}
                              </Tag>
                            )}
                          </Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={8} style={{ width: '100%', marginTop: '8px' }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Tiến trình học:
                            </Text>
                            <Progress
                              percent={progressPercent}
                              strokeColor={getProgressColor(progressPercent)}
                              status={completed ? 'success' : 'active'}
                              style={{ marginTop: '4px' }}
                            />
                          </div>

                          {/* Notes display */}
                          {notes && (
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                📝 Ghi chú:
                              </Text>
                              <div
                                style={{
                                  background: '#f5f5f5',
                                  padding: '8px',
                                  borderRadius: '4px',
                                  marginTop: '4px',
                                  fontSize: '12px',
                                }}
                              >
                                {notes}
                              </div>
                              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenNotesModal(chapter)}>
                                Sửa ghi chú
                              </Button>
                            </div>
                          )}

                          {/* Add notes button if no notes */}
                          {!notes && saved && (
                            <Button type="dashed" size="small" icon={<EditOutlined />} onClick={() => handleOpenNotesModal(chapter)}>
                              Thêm ghi chú
                            </Button>
                          )}

                          {/* Tags display */}
                          {tags && (
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                🏷️ Tags:
                              </Text>
                              <div style={{ marginTop: '4px' }}>
                                {tags.split(',').map((tag, idx) => (
                                  <Tag key={idx} color="blue">
                                    {tag.trim()}
                                  </Tag>
                                ))}
                              </div>
                              <Button type="link" size="small" icon={<TagsOutlined />} onClick={() => handleOpenTagsModal(chapter)}>
                                Sửa tags
                              </Button>
                            </div>
                          )}

                          {/* Add tags button if no tags */}
                          {!tags && saved && (
                            <Button type="dashed" size="small" icon={<TagsOutlined />} onClick={() => handleOpenTagsModal(chapter)}>
                              Thêm tags
                            </Button>
                          )}

                          {lastAccessed && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ClockCircleOutlined /> Học lần cuối: {formatLastAccessed(lastAccessed)}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Spin>
      </Card>

      {/* Notes Modal */}
      <Modal
        title="Ghi chú Chapter"
        open={notesModalVisible}
        onOk={handleSaveNotes}
        onCancel={() => setNotesModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập ghi chú của bạn..."
          value={notesInput}
          onChange={e => setNotesInput(e.target.value)}
          maxLength={2000}
          showCount
        />
      </Modal>

      {/* Tags Modal */}
      <Modal
        title="Tags Chapter"
        open={tagsModalVisible}
        onOk={handleSaveTags}
        onCancel={() => setTagsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tags, phân cách bằng dấu phẩy (vd: quan trọng, ôn tập, khó)"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          maxLength={255}
        />
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
          Ví dụ: quan trọng, ngữ pháp, ôn tập
        </Text>
      </Modal>
    </div>
  );
};

export default MyChapters;
