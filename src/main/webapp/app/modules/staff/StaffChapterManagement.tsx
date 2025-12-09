import React, { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import {
  Card,
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
} from 'antd';
import { PlusOutlined, BookOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from 'app/config/store';
import { getChaptersByBookId, createChapter, updateChapter, deleteChapter } from 'app/shared/services/chapter.service';
import { getBook } from 'app/shared/services/book.service';
import { IChapter, IBook } from 'app/shared/model/models';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const StaffChapterManagement: React.FC = () => {
  const { t } = useTranslation('staff');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);
  const [form] = Form.useForm();

  // Fetch book và chapters
  const fetchData = async () => {
    if (!bookId) return;

    setLoading(true);
    try {
      const [bookData, chaptersData] = await Promise.all([
        dispatch(getBook(parseInt(bookId, 10))).unwrap(),
        dispatch(getChaptersByBookId(parseInt(bookId, 10))).unwrap(),
      ]);
      setBook(bookData);
      setChapters(Array.isArray(chaptersData) ? chaptersData : []);
    } catch (error: any) {
      message.error(t('error.loadFailed') || 'Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  // Show modal for create/edit
  const showModal = (chapter?: IChapter) => {
    if (chapter) {
      setIsEditMode(true);
      setSelectedChapter(chapter);
      form.setFieldsValue({
        title: chapter.title,
        orderIndex: chapter.orderIndex,
        description: chapter.description,
        pageStart: chapter.pageStart,
        pageEnd: chapter.pageEnd,
      });
    } else {
      setIsEditMode(false);
      setSelectedChapter(null);
      // Auto-increment orderIndex
      const maxOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.orderIndex)) : 0;
      form.setFieldsValue({
        orderIndex: maxOrder + 1,
      });
    }
    setIsModalVisible(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const chapterData: Partial<IChapter> = {
        title: values.title,
        orderIndex: values.orderIndex,
        description: values.description,
        pageStart: values.pageStart,
        pageEnd: values.pageEnd,
        bookId: parseInt(bookId, 10),
      };

      if (isEditMode && selectedChapter?.id) {
        // Update existing chapter
        await dispatch(updateChapter({ id: selectedChapter.id, chapter: { ...selectedChapter, ...chapterData } as IChapter })).unwrap();
        message.success(t('chapter.updateSuccess') || 'Cập nhật chương thành công');
      } else {
        // Create new chapter
        await dispatch(createChapter(chapterData as IChapter)).unwrap();
        message.success(t('chapter.createSuccess') || 'Tạo chương thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.message || t('error.saveFailed') || 'Có lỗi xảy ra');
      console.error('Error saving chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (chapter: IChapter) => {
    try {
      setLoading(true);
      await dispatch(deleteChapter(chapter.id)).unwrap();
      message.success(t('chapter.deleteSuccess') || 'Xóa chương thành công');
      fetchData();
    } catch (error: any) {
      message.error(t('error.deleteFailed') || 'Không thể xóa chương');
      console.error('Error deleting chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to content editor
  const handleEditContent = (chapter: IChapter) => {
    navigate(`/staff/chapters/${chapter.id}/content`);
  };

  // Table columns
  const columns: ColumnsType<IChapter> = [
    {
      title: 'STT',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
      sorter: (a, b) => a.orderIndex - b.orderIndex,
      render: (orderIndex: number) => <Tag color="blue">{orderIndex}</Tag>,
    },
    {
      title: 'Tên chương',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => <Text type="secondary">{desc || '-'}</Text>,
    },
    {
      title: 'Trang',
      key: 'pages',
      width: 120,
      render(_, record) {
        if (record.pageStart && record.pageEnd) {
          return `${record.pageStart} - ${record.pageEnd}`;
        }
        return '-';
      },
    },
    {
      title: 'Từ vựng',
      dataIndex: 'totalWords',
      key: 'totalWords',
      width: 100,
      render: (total: number) => <Tag color="cyan">{total || 0}</Tag>,
    },
    {
      title: 'Ngữ pháp',
      dataIndex: 'totalGrammars',
      key: 'totalGrammars',
      width: 100,
      render: (total: number) => <Tag color="purple">{total || 0}</Tag>,
    },
    {
      title: 'Bài tập',
      dataIndex: 'totalExercises',
      key: 'totalExercises',
      width: 100,
      render: (total: number) => <Tag color="green">{total || 0}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => handleEditContent(record)}>
            Nội dung
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa chương này?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/staff/books')}>Quản lý sách</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{book?.title || 'Đang tải...'}</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <Space>
            <BookOutlined style={{ fontSize: 24 }} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Quản lý Chương
              </Title>
              <Text type="secondary">{book?.title}</Text>
            </div>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/staff/books')}>
              Quay lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Thêm chương mới
            </Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={chapters} rowKey="id" loading={loading} scroll={{ x: 1000 }} pagination={{ pageSize: 20 }} />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={700}
        okText={isEditMode ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Tên chương" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên chương' }]}>
                <Input placeholder="Nhập tên chương" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Thứ tự" name="orderIndex" rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}>
                <InputNumber min={1} placeholder="Thứ tự" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Trang bắt đầu" name="pageStart">
                <InputNumber min={1} placeholder="Trang bắt đầu" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Trang kết thúc" name="pageEnd">
                <InputNumber min={1} placeholder="Trang kết thúc" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} placeholder="Nhập mô tả chương" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffChapterManagement;
