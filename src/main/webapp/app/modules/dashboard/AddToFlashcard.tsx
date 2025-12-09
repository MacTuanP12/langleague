import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Table, Checkbox, message, Space, Tag, Select, Spin, Empty } from 'antd';
import { BookOutlined, FileTextOutlined, PlusOutlined, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface Word {
  id: number;
  word: string;
  pronunciation?: string;
  meaning: string;
  wordExamples?: Array<{
    exampleText: string;
    translation: string;
  }>;
}

interface Grammar {
  id: number;
  title: string;
  structure?: string;
  explanation: string;
  example?: string;
}

interface Book {
  id: number;
  title: string;
}

interface Chapter {
  id: number;
  title: string;
  orderIndex: number;
  bookId: number;
}

const AddToFlashcard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar'>('vocabulary');
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const [vocabularyList, setVocabularyList] = useState<Word[]>([]);
  const [grammarList, setGrammarList] = useState<Grammar[]>([]);
  const [selectedVocabIds, setSelectedVocabIds] = useState<number[]>([]);
  const [selectedGrammarIds, setSelectedGrammarIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      loadChapters(selectedBook);
      setSelectedChapter(null);
      setVocabularyList([]);
      setGrammarList([]);
    }
  }, [selectedBook]);

  useEffect(() => {
    if (selectedChapter) {
      if (activeTab === 'vocabulary') {
        loadVocabulary(selectedChapter);
      } else {
        loadGrammar(selectedChapter);
      }
    }
  }, [selectedChapter, activeTab]);

  const loadBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error loading books:', error);
      message.error('Failed to load books');
    }
  };

  const loadChapters = async (bookId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/chapters/book/${bookId}`);
      setChapters(response.data);
    } catch (error) {
      console.error('Error loading chapters:', error);
      message.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const loadVocabulary = async (chapterId: number) => {
    try {
      setLoading(true);
      const response = await axios.get<Word[]>(`/api/words/chapter/${chapterId}`);
      setVocabularyList(response.data);
      setSelectedVocabIds([]);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      message.error('Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const loadGrammar = async (chapterId: number) => {
    try {
      setLoading(true);
      const response = await axios.get<Grammar[]>(`/api/grammars/chapter/${chapterId}`);
      setGrammarList(response.data);
      setSelectedGrammarIds([]);
    } catch (error) {
      console.error('Error loading grammar:', error);
      message.error('Failed to load grammar');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllVocab = (e: any) => {
    if (e.target.checked) {
      setSelectedVocabIds(vocabularyList.map(word => word.id));
    } else {
      setSelectedVocabIds([]);
    }
  };

  const handleSelectAllGrammar = (e: any) => {
    if (e.target.checked) {
      setSelectedGrammarIds(grammarList.map(grammar => grammar.id));
    } else {
      setSelectedGrammarIds([]);
    }
  };

  const handleVocabSelection = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedVocabIds([...selectedVocabIds, id]);
    } else {
      setSelectedVocabIds(selectedVocabIds.filter(vocabId => vocabId !== id));
    }
  };

  const handleGrammarSelection = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedGrammarIds([...selectedGrammarIds, id]);
    } else {
      setSelectedGrammarIds(selectedGrammarIds.filter(grammarId => grammarId !== id));
    }
  };

  const handleAddToFlashcard = async () => {
    if (activeTab === 'vocabulary') {
      if (selectedVocabIds.length === 0) {
        message.warning('Please select at least one vocabulary word');
        return;
      }

      setSaving(true);
      let successCount = 0;
      let failCount = 0;

      for (const wordId of selectedVocabIds) {
        try {
          await axios.post(`/api/user-vocabularies/save/${wordId}`);
          successCount++;
        } catch (error: any) {
          console.error(`Error saving word ${wordId}:`, error);
          if (error.response?.status !== 409) {
            // Ignore if already exists
            failCount++;
          } else {
            successCount++; // Count as success if already saved
          }
        }
      }

      setSaving(false);
      if (successCount > 0) {
        message.success(`Successfully added ${successCount} word(s) to flashcard!`);
        setSelectedVocabIds([]);
      }
      if (failCount > 0) {
        message.error(`Failed to add ${failCount} word(s)`);
      }
    } else {
      if (selectedGrammarIds.length === 0) {
        message.warning('Please select at least one grammar point');
        return;
      }

      setSaving(true);
      let successCount = 0;
      let failCount = 0;

      for (const grammarId of selectedGrammarIds) {
        try {
          await axios.post(`/api/user-grammars/save/${grammarId}`);
          successCount++;
        } catch (error: any) {
          console.error(`Error saving grammar ${grammarId}:`, error);
          if (error.response?.status !== 409) {
            failCount++;
          } else {
            successCount++;
          }
        }
      }

      setSaving(false);
      if (successCount > 0) {
        message.success(`Successfully added ${successCount} grammar point(s) to flashcard!`);
        setSelectedGrammarIds([]);
      }
      if (failCount > 0) {
        message.error(`Failed to add ${failCount} grammar point(s)`);
      }
    }
  };

  const vocabularyColumns: ColumnsType<Word> = [
    {
      title: (
        <Checkbox
          checked={selectedVocabIds.length === vocabularyList.length && vocabularyList.length > 0}
          indeterminate={selectedVocabIds.length > 0 && selectedVocabIds.length < vocabularyList.length}
          onChange={handleSelectAllVocab}
        >
          Select All
        </Checkbox>
      ),
      key: 'select',
      width: 120,
      render: (_, record) => (
        <Checkbox checked={selectedVocabIds.includes(record.id)} onChange={e => handleVocabSelection(record.id, e.target.checked)} />
      ),
    },
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          {record.pronunciation && <div style={{ color: '#888', fontSize: '12px' }}>[{record.pronunciation}]</div>}
        </div>
      ),
    },
    {
      title: 'Meaning',
      dataIndex: 'meaning',
      key: 'meaning',
    },
    {
      title: 'Examples',
      key: 'examples',
      render: (_, record) => <span>{record.wordExamples?.length || 0} example(s)</span>,
    },
  ];

  const grammarColumns: ColumnsType<Grammar> = [
    {
      title: (
        <Checkbox
          checked={selectedGrammarIds.length === grammarList.length && grammarList.length > 0}
          indeterminate={selectedGrammarIds.length > 0 && selectedGrammarIds.length < grammarList.length}
          onChange={handleSelectAllGrammar}
        >
          Select All
        </Checkbox>
      ),
      key: 'select',
      width: 120,
      render: (_, record) => (
        <Checkbox checked={selectedGrammarIds.includes(record.id)} onChange={e => handleGrammarSelection(record.id, e.target.checked)} />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Structure',
      dataIndex: 'structure',
      key: 'structure',
      ellipsis: true,
    },
    {
      title: 'Explanation',
      dataIndex: 'explanation',
      key: 'explanation',
      ellipsis: true,
    },
  ];

  return (
    <div className="add-to-flashcard-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/flashcard')} style={{ marginRight: '16px' }}>
          Back to Flashcard
        </Button>
        <h1 style={{ margin: 0 }}>
          <PlusOutlined /> Add to Flashcard
        </h1>
      </div>

      {/* Book and Chapter Selection */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Book:</label>
            <Select
              style={{ width: '100%', maxWidth: '400px' }}
              placeholder="Choose a book"
              value={selectedBook}
              onChange={setSelectedBook}
              options={books.map(book => ({ label: book.title, value: book.id }))}
            />
          </div>

          {selectedBook && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Chapter:</label>
              <Select
                style={{ width: '100%', maxWidth: '400px' }}
                placeholder="Choose a chapter"
                value={selectedChapter}
                onChange={setSelectedChapter}
                options={chapters.map(chapter => ({
                  label: `Chapter ${chapter.orderIndex}: ${chapter.title}`,
                  value: chapter.id,
                }))}
              />
            </div>
          )}
        </Space>
      </Card>

      {/* Tabs for Vocabulary and Grammar */}
      {selectedChapter && (
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={key => setActiveTab(key as 'vocabulary' | 'grammar')}
            items={[
              {
                key: 'vocabulary',
                label: (
                  <span>
                    <BookOutlined />
                    Vocabulary
                    {selectedVocabIds.length > 0 && (
                      <Tag color="blue" style={{ marginLeft: '8px' }}>
                        {selectedVocabIds.length} selected
                      </Tag>
                    )}
                  </span>
                ),
                children: (
                  <div>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                      </div>
                    ) : vocabularyList.length > 0 ? (
                      <>
                        <Table columns={vocabularyColumns} dataSource={vocabularyList} rowKey="id" pagination={{ pageSize: 10 }} />
                        <div style={{ marginTop: '16px', textAlign: 'right' }}>
                          <Button
                            type="primary"
                            size="large"
                            icon={<CheckOutlined />}
                            onClick={handleAddToFlashcard}
                            loading={saving}
                            disabled={selectedVocabIds.length === 0}
                          >
                            Add Selected to Flashcard ({selectedVocabIds.length})
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Empty description="No vocabulary found in this chapter" />
                    )}
                  </div>
                ),
              },
              {
                key: 'grammar',
                label: (
                  <span>
                    <FileTextOutlined />
                    Grammar
                    {selectedGrammarIds.length > 0 && (
                      <Tag color="green" style={{ marginLeft: '8px' }}>
                        {selectedGrammarIds.length} selected
                      </Tag>
                    )}
                  </span>
                ),
                children: (
                  <div>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                      </div>
                    ) : grammarList.length > 0 ? (
                      <>
                        <Table columns={grammarColumns} dataSource={grammarList} rowKey="id" pagination={{ pageSize: 10 }} />
                        <div style={{ marginTop: '16px', textAlign: 'right' }}>
                          <Button
                            type="primary"
                            size="large"
                            icon={<CheckOutlined />}
                            onClick={handleAddToFlashcard}
                            loading={saving}
                            disabled={selectedGrammarIds.length === 0}
                          >
                            Add Selected to Flashcard ({selectedGrammarIds.length})
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Empty description="No grammar found in this chapter" />
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default AddToFlashcard;
