import React, { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  Space,
  Tag,
  message,
  Row,
  Col,
  Popconfirm,
  Breadcrumb,
  Upload,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  SoundOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from 'app/config/store';
import { getChapter } from 'app/shared/services/chapter.service';
import { getWordsByChapter, createWord, updateWord, deleteWord } from 'app/shared/services/word.service';
import { getGrammarsByChapter, createGrammar, updateGrammar, deleteGrammar } from 'app/shared/services/grammar.service';
import {
  getListeningExercisesByChapter,
  getSpeakingExercisesByChapter,
  getReadingExercisesByChapter,
  getWritingExercisesByChapter,
  createListeningExercise,
  updateListeningExercise,
  deleteListeningExercise,
  createSpeakingExercise,
  updateSpeakingExercise,
  deleteSpeakingExercise,
  createReadingExercise,
  updateReadingExercise,
  deleteReadingExercise,
  createWritingExercise,
  updateWritingExercise,
  deleteWritingExercise,
} from 'app/shared/services/exercise.service';
import { uploadImage, uploadAudio } from 'app/shared/services/file-upload.service';
import { IChapter, IWord, IGrammar } from 'app/shared/model/models';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffContentEditor: React.FC = () => {
  const { t } = useTranslation('staff');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();

  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('words');

  // Words state
  const [words, setWords] = useState<IWord[]>([]);
  const [isWordModalVisible, setIsWordModalVisible] = useState(false);
  const [isEditWordMode, setIsEditWordMode] = useState(false);
  const [selectedWord, setSelectedWord] = useState<IWord | null>(null);
  const [wordForm] = Form.useForm();

  // Grammar state
  const [grammars, setGrammars] = useState<IGrammar[]>([]);
  const [isGrammarModalVisible, setIsGrammarModalVisible] = useState(false);
  const [isEditGrammarMode, setIsEditGrammarMode] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);
  const [grammarForm] = Form.useForm();

  // Exercise state
  const [exercises, setExercises] = useState<any[]>([]);
  const [exerciseType, setExerciseType] = useState<'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING'>('LISTENING');
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [isEditExerciseMode, setIsEditExerciseMode] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [exerciseForm] = Form.useForm();

  // File upload states
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fetch chapter data
  const fetchChapterData = async () => {
    if (!chapterId) return;

    setLoading(true);
    try {
      const chapterData = await dispatch(getChapter(parseInt(chapterId, 10))).unwrap();
      setChapter(chapterData);
    } catch (error: any) {
      message.error('Không thể tải thông tin chương');
      console.error('Error fetching chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [chapterId]);

  // Fetch words
  const fetchWords = async () => {
    if (!chapterId) return;
    setLoading(true);
    try {
      const data = await dispatch(getWordsByChapter(parseInt(chapterId, 10))).unwrap();
      setWords(Array.isArray(data) ? data : []);
    } catch (error: any) {
      message.error('Không thể tải danh sách từ vựng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch grammars
  const fetchGrammars = async () => {
    if (!chapterId) return;
    setLoading(true);
    try {
      const data = await dispatch(getGrammarsByChapter(parseInt(chapterId, 10))).unwrap();
      setGrammars(Array.isArray(data) ? data : []);
    } catch (error: any) {
      message.error('Không thể tải danh sách ngữ pháp');
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercises by type
  const fetchExercises = async (type: string) => {
    if (!chapterId) return;
    setLoading(true);
    try {
      let data: any[] = [];
      switch (type) {
        case 'LISTENING':
          data = await dispatch(getListeningExercisesByChapter(parseInt(chapterId, 10))).unwrap();
          break;
        case 'SPEAKING':
          data = await dispatch(getSpeakingExercisesByChapter(parseInt(chapterId, 10))).unwrap();
          break;
        case 'READING':
          data = await dispatch(getReadingExercisesByChapter(parseInt(chapterId, 10))).unwrap();
          break;
        case 'WRITING':
          data = await dispatch(getWritingExercisesByChapter(parseInt(chapterId, 10))).unwrap();
          break;
        default:
          data = [];
      }
      setExercises(Array.isArray(data) ? data : []);
    } catch (error: any) {
      message.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'words') {
      fetchWords();
    } else if (activeTab === 'grammar') {
      fetchGrammars();
    } else if (activeTab === 'exercises') {
      fetchExercises(exerciseType);
    }
  }, [activeTab, exerciseType, chapterId]);

  // ==================== Word Handlers ====================

  const showWordModal = (word?: IWord) => {
    if (word) {
      setIsEditWordMode(true);
      setSelectedWord(word);
      wordForm.setFieldsValue(word);
      setImageUrl(word.imageUrl || '');
    } else {
      setIsEditWordMode(false);
      setSelectedWord(null);
      wordForm.resetFields();
      const maxOrder = words.length > 0 ? Math.max(...words.map(w => w.orderIndex || 0)) : 0;
      wordForm.setFieldsValue({ orderIndex: maxOrder + 1 });
      setImageUrl('');
    }
    setIsWordModalVisible(true);
  };

  const handleWordSubmit = async () => {
    try {
      const values = await wordForm.validateFields();
      setLoading(true);

      const wordData: Partial<IWord> = {
        ...values,
        chapterId: parseInt(chapterId, 10),
        imageUrl: imageUrl || undefined,
      };

      if (isEditWordMode && selectedWord?.id) {
        await dispatch(updateWord({ id: selectedWord.id, word: { ...selectedWord, ...wordData } })).unwrap();
        message.success('Cập nhật từ vựng thành công');
      } else {
        await dispatch(createWord(wordData as IWord)).unwrap();
        message.success('Tạo từ vựng thành công');
      }

      setIsWordModalVisible(false);
      wordForm.resetFields();
      setImageUrl('');
      fetchWords();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWord = async (word: IWord) => {
    try {
      setLoading(true);
      await dispatch(deleteWord(word.id)).unwrap();
      message.success('Xóa từ vựng thành công');
      fetchWords();
    } catch (error: any) {
      message.error('Không thể xóa từ vựng');
    } finally {
      setLoading(false);
    }
  };

  // ==================== Grammar Handlers ====================

  const showGrammarModal = (grammar?: IGrammar) => {
    if (grammar) {
      setIsEditGrammarMode(true);
      setSelectedGrammar(grammar);
      grammarForm.setFieldsValue(grammar);
    } else {
      setIsEditGrammarMode(false);
      setSelectedGrammar(null);
      grammarForm.resetFields();
      const maxOrder = grammars.length > 0 ? Math.max(...grammars.map(g => g.orderIndex || 0)) : 0;
      grammarForm.setFieldsValue({ orderIndex: maxOrder + 1 });
    }
    setIsGrammarModalVisible(true);
  };

  const handleGrammarSubmit = async () => {
    try {
      const values = await grammarForm.validateFields();
      setLoading(true);

      const grammarData: Partial<IGrammar> = {
        ...values,
        chapterId: parseInt(chapterId, 10),
      };

      if (isEditGrammarMode && selectedGrammar?.id) {
        await dispatch(updateGrammar({ id: selectedGrammar.id, grammar: { ...selectedGrammar, ...grammarData } })).unwrap();
        message.success('Cập nhật ngữ pháp thành công');
      } else {
        await dispatch(createGrammar(grammarData as IGrammar)).unwrap();
        message.success('Tạo ngữ pháp thành công');
      }

      setIsGrammarModalVisible(false);
      grammarForm.resetFields();
      fetchGrammars();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrammar = async (grammar: IGrammar) => {
    try {
      setLoading(true);
      await dispatch(deleteGrammar(grammar.id)).unwrap();
      message.success('Xóa ngữ pháp thành công');
      fetchGrammars();
    } catch (error: any) {
      message.error('Không thể xóa ngữ pháp');
    } finally {
      setLoading(false);
    }
  };

  // ==================== Exercise Handlers ====================

  const showExerciseModal = (exercise?: any) => {
    if (exercise) {
      setIsEditExerciseMode(true);
      setSelectedExercise(exercise);
      exerciseForm.setFieldsValue(exercise);
      setAudioUrl(exercise.audioUrl || exercise.sampleAudio || '');
      setImageUrl(exercise.imageUrl || '');
    } else {
      setIsEditExerciseMode(false);
      setSelectedExercise(null);
      exerciseForm.resetFields();
      const maxOrder = exercises.length > 0 ? Math.max(...exercises.map(e => e.orderIndex || 0)) : 0;
      exerciseForm.setFieldsValue({ orderIndex: maxOrder + 1, skillType: exerciseType });
      setAudioUrl('');
      setImageUrl('');
    }
    setIsExerciseModalVisible(true);
  };

  const handleExerciseSubmit = async () => {
    try {
      const values = await exerciseForm.validateFields();
      setLoading(true);

      const baseData = {
        chapterId: parseInt(chapterId, 10),
        skillType: exerciseType,
        orderIndex: values.orderIndex,
      };

      let exerciseData: any = { ...baseData };

      switch (exerciseType) {
        case 'LISTENING':
          exerciseData = {
            ...exerciseData,
            audioUrl: audioUrl || values.audioUrl,
            imageUrl: imageUrl || values.imageUrl,
            question: values.question,
            correctAnswer: values.correctAnswer,
            maxScore: values.maxScore || 10,
          };
          break;
        case 'SPEAKING':
          exerciseData = {
            ...exerciseData,
            prompt: values.prompt,
            sampleAudio: audioUrl || values.sampleAudio,
            targetPhrase: values.targetPhrase,
            maxScore: values.maxScore || 15,
          };
          break;
        case 'READING':
          exerciseData = {
            ...exerciseData,
            passage: values.passage,
            question: values.question,
            correctAnswer: values.correctAnswer,
            maxScore: values.maxScore || 10,
          };
          break;
        case 'WRITING':
          exerciseData = {
            ...exerciseData,
            prompt: values.prompt,
            sampleAnswer: values.sampleAnswer,
            minWords: values.minWords,
            maxScore: values.maxScore || 20,
          };
          break;
        default:
          exerciseData = { ...baseData };
      }

      if (isEditExerciseMode && selectedExercise?.id) {
        // Update exercise
        switch (exerciseType) {
          case 'LISTENING':
            await dispatch(updateListeningExercise({ id: selectedExercise.id, exercise: exerciseData })).unwrap();
            break;
          case 'SPEAKING':
            await dispatch(updateSpeakingExercise({ id: selectedExercise.id, exercise: exerciseData })).unwrap();
            break;
          case 'READING':
            await dispatch(updateReadingExercise({ id: selectedExercise.id, exercise: exerciseData })).unwrap();
            break;
          case 'WRITING':
            await dispatch(updateWritingExercise({ id: selectedExercise.id, exercise: exerciseData })).unwrap();
            break;
          default:
            throw new Error('Invalid exercise type');
        }
        message.success('Cập nhật bài tập thành công');
      } else {
        // Create exercise
        switch (exerciseType) {
          case 'LISTENING':
            await dispatch(createListeningExercise(exerciseData)).unwrap();
            break;
          case 'SPEAKING':
            await dispatch(createSpeakingExercise(exerciseData)).unwrap();
            break;
          case 'READING':
            await dispatch(createReadingExercise(exerciseData)).unwrap();
            break;
          case 'WRITING':
            await dispatch(createWritingExercise(exerciseData)).unwrap();
            break;
          default:
            throw new Error('Invalid exercise type');
        }
        message.success('Tạo bài tập thành công');
      }

      setIsExerciseModalVisible(false);
      exerciseForm.resetFields();
      setAudioUrl('');
      setImageUrl('');
      fetchExercises(exerciseType);
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (exercise: any) => {
    try {
      setLoading(true);
      switch (exerciseType) {
        case 'LISTENING':
          await dispatch(deleteListeningExercise(exercise.id)).unwrap();
          break;
        case 'SPEAKING':
          await dispatch(deleteSpeakingExercise(exercise.id)).unwrap();
          break;
        case 'READING':
          await dispatch(deleteReadingExercise(exercise.id)).unwrap();
          break;
        case 'WRITING':
          await dispatch(deleteWritingExercise(exercise.id)).unwrap();
          break;
        default:
          throw new Error('Invalid exercise type');
      }
      message.success('Xóa bài tập thành công');
      fetchExercises(exerciseType);
    } catch (error: any) {
      message.error('Không thể xóa bài tập');
    } finally {
      setLoading(false);
    }
  };

  // ==================== File Upload Handlers ====================

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const url = result.fileUrl || result.fileName || '';
      setImageUrl(url);
      message.success('Tải ảnh thành công');
    } catch (error: any) {
      message.error(error?.message || 'Không thể tải ảnh');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
    return false;
  };

  const handleAudioUpload = async (file: File) => {
    setUploadingAudio(true);
    try {
      const result = await dispatch(uploadAudio(file)).unwrap();
      const url = result.fileUrl || result.fileName || '';
      setAudioUrl(url);
      message.success('Tải audio thành công');
    } catch (error: any) {
      message.error(error?.message || 'Không thể tải audio');
      console.error('Audio upload error:', error);
    } finally {
      setUploadingAudio(false);
    }
    return false;
  };

  // ==================== Table Columns ====================

  const wordColumns: ColumnsType<IWord> = [
    {
      title: 'STT',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 60,
      sorter: (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0),
    },
    {
      title: 'Từ',
      dataIndex: 'text',
      key: 'text',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Nghĩa',
      dataIndex: 'meaning',
      key: 'meaning',
    },
    {
      title: 'Phát âm',
      dataIndex: 'pronunciation',
      key: 'pronunciation',
      render: (text: string) => <Text type="secondary">{text || '-'}</Text>,
    },
    {
      title: 'Từ loại',
      dataIndex: 'partOfSpeech',
      key: 'partOfSpeech',
      render: (text: string) => <Tag>{text || '-'}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => showWordModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa từ này?" onConfirm={() => handleDeleteWord(record)}>
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const grammarColumns: ColumnsType<IGrammar> = [
    {
      title: 'STT',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 60,
      sorter: (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Mẫu câu',
      dataIndex: 'pattern',
      key: 'pattern',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Nghĩa',
      dataIndex: 'meaning',
      key: 'meaning',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => showGrammarModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa ngữ pháp này?" onConfirm={() => handleDeleteGrammar(record)}>
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const exerciseColumns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 60,
      sorter: (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0),
    },
    {
      title: 'Nội dung',
      key: 'content',
      render(_, record) {
        if (exerciseType === 'LISTENING') return record.question;
        if (exerciseType === 'SPEAKING' || exerciseType === 'WRITING') return record.prompt;
        if (exerciseType === 'READING') return record.question;
        return '-';
      },
      ellipsis: true,
    },
    {
      title: 'Điểm',
      dataIndex: 'maxScore',
      key: 'maxScore',
      width: 80,
      render: (score: number) => <Tag color="green">{score || 0}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => showExerciseModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa bài tập này?" onConfirm={() => handleDeleteExercise(record)}>
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==================== Render ====================

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/staff/books')}>Quản lý sách</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={() => navigate(-1)}>Quản lý chương</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{chapter?.title || 'Đang tải...'}</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 24 }} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Chỉnh sửa nội dung chương
              </Title>
              <Text type="secondary">{chapter?.title}</Text>
            </div>
          </Space>
        }
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'words',
              label: (
                <span>
                  <BookOutlined />
                  Từ vựng ({words.length})
                </span>
              ),
              children: (
                <div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => showWordModal()} style={{ marginBottom: 16 }}>
                    Thêm từ vựng
                  </Button>
                  <Table columns={wordColumns} dataSource={words} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
                </div>
              ),
            },
            {
              key: 'grammar',
              label: (
                <span>
                  <FileTextOutlined />
                  Ngữ pháp ({grammars.length})
                </span>
              ),
              children: (
                <div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => showGrammarModal()} style={{ marginBottom: 16 }}>
                    Thêm ngữ pháp
                  </Button>
                  <Table columns={grammarColumns} dataSource={grammars} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
                </div>
              ),
            },
            {
              key: 'exercises',
              label: (
                <span>
                  <FileTextOutlined />
                  Bài tập ({exercises.length})
                </span>
              ),
              children: (
                <div>
                  <Space style={{ marginBottom: 16 }}>
                    <Select value={exerciseType} onChange={value => setExerciseType(value)} style={{ width: 200 }}>
                      <Option value="LISTENING">Nghe</Option>
                      <Option value="SPEAKING">Nói</Option>
                      <Option value="READING">Đọc</Option>
                      <Option value="WRITING">Viết</Option>
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showExerciseModal()}>
                      Thêm bài tập{' '}
                      {exerciseType === 'LISTENING'
                        ? 'Nghe'
                        : exerciseType === 'SPEAKING'
                          ? 'Nói'
                          : exerciseType === 'READING'
                            ? 'Đọc'
                            : 'Viết'}
                    </Button>
                  </Space>
                  <Table columns={exerciseColumns} dataSource={exercises} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Word Modal */}
      <Modal
        title={isEditWordMode ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
        open={isWordModalVisible}
        onOk={handleWordSubmit}
        onCancel={() => {
          setIsWordModalVisible(false);
          wordForm.resetFields();
          setImageUrl('');
        }}
        width={700}
        confirmLoading={loading}
      >
        <Form form={wordForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Từ" name="text" rules={[{ required: true, message: 'Vui lòng nhập từ' }]}>
                <Input placeholder="Nhập từ vựng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thứ tự" name="orderIndex">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Nghĩa" name="meaning">
                <Input placeholder="Nghĩa tiếng Việt" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phát âm" name="pronunciation">
                <Input placeholder="Phiên âm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Từ loại" name="partOfSpeech">
                <Input placeholder="danh từ, động từ,..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh minh họa">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {imageUrl && <img src={imageUrl} alt="Word" style={{ maxWidth: 200, borderRadius: 8 }} />}
                  <Upload accept="image/*" beforeUpload={handleImageUpload} showUploadList={false} disabled={uploadingImage}>
                    <Button icon={<FileImageOutlined />} loading={uploadingImage}>
                      {imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                    </Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Grammar Modal */}
      <Modal
        title={isEditGrammarMode ? 'Chỉnh sửa ngữ pháp' : 'Thêm ngữ pháp mới'}
        open={isGrammarModalVisible}
        onOk={handleGrammarSubmit}
        onCancel={() => {
          setIsGrammarModalVisible(false);
          grammarForm.resetFields();
        }}
        width={700}
        confirmLoading={loading}
      >
        <Form form={grammarForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="VD: -았/었어요 (Thì quá khứ)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Thứ tự" name="orderIndex">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mẫu câu" name="pattern" rules={[{ required: true, message: 'Vui lòng nhập mẫu câu' }]}>
                <Input placeholder="VD: Động từ + 았/었어요" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nghĩa" name="meaning">
                <Input placeholder="Nghĩa của mẫu câu" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Giải thích" name="explanation">
                <TextArea rows={4} placeholder="Giải thích cách sử dụng" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Exercise Modal */}
      <Modal
        title={
          isEditExerciseMode
            ? `Chỉnh sửa bài tập ${exerciseType === 'LISTENING' ? 'Nghe' : exerciseType === 'SPEAKING' ? 'Nói' : exerciseType === 'READING' ? 'Đọc' : 'Viết'}`
            : `Thêm bài tập ${exerciseType === 'LISTENING' ? 'Nghe' : exerciseType === 'SPEAKING' ? 'Nói' : exerciseType === 'READING' ? 'Đọc' : 'Viết'} mới`
        }
        open={isExerciseModalVisible}
        onOk={handleExerciseSubmit}
        onCancel={() => {
          setIsExerciseModalVisible(false);
          exerciseForm.resetFields();
          setAudioUrl('');
          setImageUrl('');
        }}
        width={800}
        confirmLoading={loading}
      >
        <Form form={exerciseForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={18}>
              {/* Dynamic fields based on exercise type */}
              {exerciseType === 'LISTENING' && (
                <>
                  <Form.Item label="Câu hỏi" name="question" rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}>
                    <Input placeholder="Nhập câu hỏi" />
                  </Form.Item>
                  <Form.Item label="Audio">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {audioUrl && <Text type="secondary">{audioUrl}</Text>}
                      <Upload accept="audio/*" beforeUpload={handleAudioUpload} showUploadList={false} disabled={uploadingAudio}>
                        <Button icon={<SoundOutlined />} loading={uploadingAudio}>
                          {audioUrl ? 'Thay đổi audio' : 'Tải audio lên'}
                        </Button>
                      </Upload>
                    </Space>
                  </Form.Item>
                  <Form.Item label="Ảnh minh họa">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {imageUrl && <img src={imageUrl} alt="Exercise" style={{ maxWidth: 200, borderRadius: 8 }} />}
                      <Upload accept="image/*" beforeUpload={handleImageUpload} showUploadList={false} disabled={uploadingImage}>
                        <Button icon={<FileImageOutlined />} loading={uploadingImage}>
                          {imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                        </Button>
                      </Upload>
                    </Space>
                  </Form.Item>
                  <Form.Item label="Đáp án đúng" name="correctAnswer">
                    <Input placeholder="VD: A, B, C..." />
                  </Form.Item>
                </>
              )}

              {exerciseType === 'SPEAKING' && (
                <>
                  <Form.Item label="Yêu cầu" name="prompt" rules={[{ required: true, message: 'Vui lòng nhập yêu cầu' }]}>
                    <TextArea rows={3} placeholder="Mô tả yêu cầu bài tập" />
                  </Form.Item>
                  <Form.Item label="Cụm từ mục tiêu" name="targetPhrase">
                    <Input placeholder="Cụm từ học viên cần nói" />
                  </Form.Item>
                  <Form.Item label="Audio mẫu">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {audioUrl && <Text type="secondary">{audioUrl}</Text>}
                      <Upload accept="audio/*" beforeUpload={handleAudioUpload} showUploadList={false} disabled={uploadingAudio}>
                        <Button icon={<SoundOutlined />} loading={uploadingAudio}>
                          {audioUrl ? 'Thay đổi audio' : 'Tải audio mẫu lên'}
                        </Button>
                      </Upload>
                    </Space>
                  </Form.Item>
                </>
              )}

              {exerciseType === 'READING' && (
                <>
                  <Form.Item label="Đoạn văn" name="passage" rules={[{ required: true, message: 'Vui lòng nhập đoạn văn' }]}>
                    <TextArea rows={5} placeholder="Nhập đoạn văn" />
                  </Form.Item>
                  <Form.Item label="Câu hỏi" name="question" rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}>
                    <Input placeholder="Nhập câu hỏi" />
                  </Form.Item>
                  <Form.Item label="Đáp án đúng" name="correctAnswer">
                    <Input placeholder="VD: A, B, C..." />
                  </Form.Item>
                </>
              )}

              {exerciseType === 'WRITING' && (
                <>
                  <Form.Item label="Yêu cầu" name="prompt" rules={[{ required: true, message: 'Vui lòng nhập yêu cầu' }]}>
                    <TextArea rows={3} placeholder="Mô tả yêu cầu bài viết" />
                  </Form.Item>
                  <Form.Item label="Bài mẫu" name="sampleAnswer">
                    <TextArea rows={4} placeholder="Bài viết mẫu (tùy chọn)" />
                  </Form.Item>
                  <Form.Item label="Số từ tối thiểu" name="minWords">
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </>
              )}
            </Col>

            <Col span={6}>
              <Form.Item label="Thứ tự" name="orderIndex">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Điểm tối đa" name="maxScore">
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffContentEditor;
