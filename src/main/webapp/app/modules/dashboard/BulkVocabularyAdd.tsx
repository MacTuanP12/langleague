import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Spin, Empty, Space, Checkbox, Row, Col, Statistic, Tag, Input, Divider } from 'antd';
import { BookOutlined, FileTextOutlined, CheckOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;

interface Book {
  id: number;
  title: string;
  level?: string;
  totalChapters?: number;
}

interface Chapter {
  id: number;
  title: string;
  orderIndex: number;
  totalWords?: number;
}

interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface BulkVocabularyAddProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BulkVocabularyAdd: React.FC<BulkVocabularyAddProps> = ({ visible, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>([]);
  const [bookChapters, setBookChapters] = useState<Map<number, Chapter[]>>(new Map());
  const [chapterWords, setChapterWords] = useState<Map<number, Word[]>>(new Map());
  const [selectAllBooks, setSelectAllBooks] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (visible) {
      loadBooks();
    }
  }, [visible]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any>('/api/books/active', {
        params: { page: 0, size: 100 },
      });
      const booksData = Array.isArray(response.data) ? response.data : response.data.content || [];
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
      message.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const loadBookChapters = async (bookId: number) => {
    if (bookChapters.has(bookId)) return;

    try {
      const response = await axios.get<Chapter[]>(`/api/books/${bookId}/chapters`);
      setBookChapters(prev => new Map(prev).set(bookId, response.data));
    } catch (error) {
      console.error(`Error loading chapters for book ${bookId}:`, error);
    }
  };

  const loadChapterWords = async (chapterId: number) => {
    if (chapterWords.has(chapterId)) return;

    try {
      const response = await axios.get<Word[]>(`/api/words/chapter/${chapterId}`);
      setChapterWords(prev => new Map(prev).set(chapterId, response.data));
    } catch (error) {
      console.error(`Error loading words for chapter ${chapterId}:`, error);
    }
  };

  const handleSelectBook = async (bookId: number, checked: boolean) => {
    if (checked) {
      setSelectedBookIds(prev => [...prev, bookId]);
      await loadBookChapters(bookId);
    } else {
      setSelectedBookIds(prev => prev.filter(id => id !== bookId));
      // Also deselect all chapters of this book
      const chapters = bookChapters.get(bookId) || [];
      const chapterIds = chapters.map(c => c.id);
      setSelectedChapterIds(prev => prev.filter(id => !chapterIds.includes(id)));
    }
  };

  const handleSelectChapter = async (chapterId: number, checked: boolean) => {
    if (checked) {
      setSelectedChapterIds(prev => [...prev, chapterId]);
      await loadChapterWords(chapterId);
    } else {
      setSelectedChapterIds(prev => prev.filter(id => id !== chapterId));
    }
  };

  const handleSelectAllBooks = async (checked: boolean) => {
    setSelectAllBooks(checked);
    if (checked) {
      const allBookIds = books.map(b => b.id);
      setSelectedBookIds(allBookIds);

      // Load all chapters for all books
      await Promise.all(allBookIds.map(id => loadBookChapters(id)));

      // Auto-select all chapters from all books
      const allChapterIds: number[] = [];
      for (const bookId of allBookIds) {
        const chapters = bookChapters.get(bookId) || [];
        allChapterIds.push(...chapters.map(c => c.id));
      }
      setSelectedChapterIds(allChapterIds);

      // Load words for all chapters
      await Promise.all(allChapterIds.map(id => loadChapterWords(id)));
    } else {
      setSelectedBookIds([]);
      setSelectedChapterIds([]);
    }
  };

  const handleBulkAdd = async () => {
    setLoading(true);
    try {
      // Collect all word IDs from selected chapters
      const wordIds: number[] = [];

      for (const chapterId of selectedChapterIds) {
        const words = chapterWords.get(chapterId) || [];
        wordIds.push(...words.map(w => w.id));
      }

      // Remove duplicates
      const uniqueWordIds = Array.from(new Set(wordIds));

      if (uniqueWordIds.length === 0) {
        message.warning('Vui lòng chọn ít nhất một chương để thêm từ vựng');
        return;
      }

      // Call batch save API
      await axios.post('/api/user-vocabularies/batch-save', uniqueWordIds);

      message.success(`Đã thêm ${uniqueWordIds.length} từ vựng vào flashcard!`);
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error adding vocabulary:', error);
      message.error(error.response?.data?.message || 'Không thể thêm từ vựng');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBookIds([]);
    setSelectedChapterIds([]);
    setSelectAllBooks(false);
    setSearchText('');
    onClose();
  };

  const getTotalWords = () => {
    let total = 0;
    for (const chapterId of selectedChapterIds) {
      const words = chapterWords.get(chapterId) || [];
      total += words.length;
    }
    return total;
  };

  const filteredBooks = books.filter(book => !searchText || book.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          Thêm từ vựng hàng loạt
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleBulkAdd} icon={<CheckOutlined />}>
          Thêm {getTotalWords()} từ vựng
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic title="Sách đã chọn" value={selectedBookIds.length} prefix={<BookOutlined />} />
          </Col>
          <Col span={8}>
            <Statistic title="Chương đã chọn" value={selectedChapterIds.length} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={8}>
            <Statistic title="Tổng từ vựng" value={getTotalWords()} prefix={<CheckOutlined />} valueStyle={{ color: '#3f8600' }} />
          </Col>
        </Row>

        <Divider />

        {/* Unified book and chapter selection */}
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Checkbox checked={selectAllBooks} onChange={e => handleSelectAllBooks(e.target.checked)}>
            <strong>Chọn tất cả các sách ({books.length} sách) - Tự động chọn tất cả từ vựng</strong>
          </Checkbox>

          <Search
            placeholder="Tìm kiếm sách..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />

          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {filteredBooks.length === 0 ? (
              <Empty description="Không tìm thấy sách" />
            ) : (
              filteredBooks.map(book => (
                <div key={book.id} style={{ marginBottom: 16, border: '1px solid #f0f0f0', padding: 12, borderRadius: 8 }}>
                  <Checkbox checked={selectedBookIds.includes(book.id)} onChange={e => handleSelectBook(book.id, e.target.checked)}>
                    <Space>
                      <BookOutlined />
                      <strong>{book.title}</strong>
                      {book.level && <Tag color="blue">{book.level}</Tag>}
                      {book.totalChapters && <Tag>{book.totalChapters} chương</Tag>}
                    </Space>
                  </Checkbox>
                  <div style={{ fontSize: 12, color: '#999', marginLeft: 24, marginTop: 4 }}>
                    Chọn sách sẽ tự động thêm tất cả từ vựng từ các chương của sách
                  </div>

                  {/* Show chapters if book is selected */}
                  {selectedBookIds.includes(book.id) && (
                    <div style={{ marginTop: 12, marginLeft: 24, background: '#fafafa', padding: 12, borderRadius: 4 }}>
                      <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#666' }}>Các chương (tất cả đã được chọn):</div>
                      {bookChapters.get(book.id)?.map(chapter => (
                        <div key={chapter.id} style={{ marginBottom: 8 }}>
                          <Checkbox
                            checked={selectedChapterIds.includes(chapter.id)}
                            onChange={e => handleSelectChapter(chapter.id, e.target.checked)}
                          >
                            <Space size="small">
                              <FileTextOutlined style={{ fontSize: 12 }} />
                              Chapter {chapter.orderIndex}: {chapter.title}
                              {chapter.totalWords && <Tag color="green">{chapter.totalWords} từ</Tag>}
                            </Space>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Space>
      </Spin>
    </Modal>
  );
};

export default BulkVocabularyAdd;
