import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, Empty, Spin, Modal, message, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BookOpen, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import showConfirmModal from 'app/shared/components/ConfirmModal';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Search: SearchInput } = Input;

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  chapter?: {
    id: number;
    title: string;
  };
  book?: {
    id: number;
    title: string;
  };
  tags?: string[];
}

const NotesPage: React.FC = () => {
  const { t } = useTranslation(['notes', 'common']);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/chapter-notes/my');
      // setNotes(response.data);

      // Mock data for now
      setNotes([
        {
          id: 1,
          title: 'Important vocabulary',
          content: 'Remember to practice these words daily:\n- Vocabulary\n- Grammar\n- Pronunciation',
          createdAt: '2024-12-01T10:00:00',
          chapter: { id: 1, title: 'Chapter 1: Introduction' },
          book: { id: 1, title: 'English for Beginners' },
          tags: ['vocabulary', 'study'],
        },
        {
          id: 2,
          title: 'Grammar notes',
          content: "Key grammar points from today's lesson:\n1. Present simple tense\n2. Articles (a, an, the)",
          createdAt: '2024-12-02T14:30:00',
          chapter: { id: 2, title: 'Chapter 2: Basic Grammar' },
          book: { id: 1, title: 'English for Beginners' },
          tags: ['grammar'],
        },
      ]);
    } catch (error) {
      console.error('Error loading notes:', error);
      message.error(t('notes.messages.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', tags: '' });
    setShowModal(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = (noteId: number) => {
    showConfirmModal({
      title: t('notes.deleteNote'),
      content: t('notes.messages.deleteConfirm'),
      onConfirm() {
        try {
          // TODO: Replace with actual API call
          // await axios.delete(`/api/chapter-notes/${noteId}`);
          setNotes(notes.filter(n => n.id !== noteId));
          message.success(t('notes.messages.deleteSuccess'));
        } catch (error) {
          message.error(t('notes.messages.deleteFailed'));
        }
      },
      danger: true,
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      message.warning(t('notes.validation.titleRequired'));
      return;
    }

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      if (editingNote) {
        // Update existing note
        // TODO: Replace with actual API call
        // await axios.put(`/api/chapter-notes/${editingNote.id}`, {
        //   title: formData.title,
        //   content: formData.content,
        //   tags,
        // });

        setNotes(
          notes.map(n =>
            n.id === editingNote.id
              ? { ...n, title: formData.title, content: formData.content, tags, updatedAt: new Date().toISOString() }
              : n,
          ),
        );
        message.success(t('notes.messages.updateSuccess'));
      } else {
        // Create new note
        // TODO: Replace with actual API call
        // const response = await axios.post('/api/chapter-notes', {
        //   title: formData.title,
        //   content: formData.content,
        //   tags,
        // });

        const newNote: Note = {
          id: Date.now(),
          title: formData.title,
          content: formData.content,
          tags,
          createdAt: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        message.success(t('notes.messages.createSuccess'));
      }

      setShowModal(false);
      setFormData({ title: '', content: '', tags: '' });
    } catch (error) {
      message.error(editingNote ? t('notes.messages.updateFailed') : t('notes.messages.createFailed'));
    }
  };

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={32} color="#1890ff" />
          <Title level={2} style={{ margin: 0 }}>
            {t('notes.title')}
          </Title>
          <Text type="secondary">
            ({filteredNotes.length} {t('notes.stats.totalNotes')})
          </Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={handleCreate}>
          {t('notes.createNote')}
        </Button>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: '24px' }}>
        <SearchInput
          placeholder={t('notes.search.placeholder')}
          allowClear
          size="large"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          prefix={<Search size={20} />}
        />
      </Card>

      {/* Notes List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <Empty
            description={searchQuery ? t('notes.messages.noResults') : t('notes.noNotes')}
            image={<BookOpen size={64} color="#d9d9d9" />}
          >
            {!searchQuery && (
              <Button type="primary" icon={<Plus size={16} />} onClick={handleCreate}>
                {t('notes.createFirstNote')}
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredNotes.map(note => (
            <Col xs={24} md={12} lg={8} key={note.id}>
              <Card
                hoverable
                actions={[
                  <Button key="edit" type="text" icon={<Edit2 size={16} />} onClick={() => handleEdit(note)}>
                    {t('common.edit')}
                  </Button>,
                  <Button key="delete" type="text" danger icon={<Trash2 size={16} />} onClick={() => handleDelete(note.id)}>
                    {t('common.delete')}
                  </Button>,
                ]}
              >
                <Title level={4} ellipsis={{ rows: 1 }}>
                  {note.title}
                </Title>

                <Paragraph ellipsis={{ rows: 4 }} style={{ marginBottom: '12px', minHeight: '96px' }}>
                  {note.content}
                </Paragraph>

                {note.tags && note.tags.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    {note.tags.map((tag, idx) => (
                      <Tag key={idx} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}

                {note.chapter && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <BookOpen size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {note.book?.title} - {note.chapter.title}
                    </Text>
                  </div>
                )}

                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {note.updatedAt
                    ? t('notes.stats.lastUpdated', { time: dayjs(note.updatedAt).fromNow() })
                    : dayjs(note.createdAt).fromNow()}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingNote ? t('notes.editNote') : t('notes.createNote')}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSubmit}
        width={600}
        okText={editingNote ? t('common.save') : t('common.create')}
        cancelText={t('common.cancel')}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>{t('notes.form.titleLabel')}</Text>
            <Input
              placeholder={t('notes.form.titlePlaceholder')}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>{t('notes.form.contentLabel')}</Text>
            <TextArea
              rows={8}
              placeholder={t('notes.form.contentPlaceholder')}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              style={{ marginTop: '8px' }}
              showCount
              maxLength={2000}
            />
          </div>

          <div>
            <Text strong>{t('notes.form.tagsLabel')}</Text>
            <Input
              placeholder={t('notes.form.tagsPlaceholder')}
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              style={{ marginTop: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('notes.form.tagsHint')}
            </Text>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default NotesPage;
