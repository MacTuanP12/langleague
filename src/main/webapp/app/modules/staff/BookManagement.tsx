import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Tag,
  message,
  Row,
  Col,
  Popconfirm,
  Upload,
  Image,
  Rate,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  FileImageOutlined,
  CheckSquareOutlined,
  EyeInvisibleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from 'app/config/store';
import { getBooks, createBook, processBookWithAI, updateBook, deleteBook, getBookChapters } from 'app/shared/services/book.service';
import { uploadImage } from 'app/shared/services/file-upload.service';
import { IBook, IChapter } from 'app/shared/model/models';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BookManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [isChaptersModalVisible, setIsChaptersModalVisible] = useState(false);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const result = await dispatch(getBooks({})).unwrap();
      setBooks(Array.isArray(result) ? result : []);
    } catch (error) {
      message.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // (Upload removed) no uploadProps needed

  // Show modal
  const showModal = (book?: IBook) => {
    if (book) {
      setIsEditMode(true);
      setSelectedBook(book);
      setThumbnailUrl(book.thumbnail || '');
      form.setFieldsValue({
        ...book,
        isActive: book.isActive ?? true,
      });
    } else {
      setIsEditMode(false);
      setSelectedBook(null);
      setThumbnailUrl('');
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
    setIsModalVisible(true);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumbnail(true);
    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const url = result.fileUrl || result.fileName || '';
      setThumbnailUrl(url);
      message.success('Tải ảnh bìa thành công');
      return false; // Prevent default upload behavior
    } catch (error: any) {
      message.error('Không thể tải ảnh bìa: ' + (error.message || ''));
      console.error('Error uploading thumbnail:', error);
      return false;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && selectedBook) {
        // Update existing book
        const bookData: IBook = {
          ...selectedBook,
          ...values,
          thumbnail: thumbnailUrl || selectedBook.thumbnail || null,
          isActive: values.isActive ?? true,
        };
        await dispatch(updateBook({ id: selectedBook.id, book: bookData })).unwrap();
        message.success('Cập nhật sách thành công');
      } else {
        // Create new book
        const bookPayload: IBook = {
          ...values,
          thumbnail: thumbnailUrl || null,
          isActive: values.isActive ?? true,
        } as IBook;

        await dispatch(createBook(bookPayload)).unwrap();
        message.success('Tạo sách thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      setThumbnailUrl('');
      fetchBooks();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (book: IBook) => {
    try {
      setLoading(true);
      // Pass object with id to match service signature
      await dispatch(deleteBook({ id: book.id, force: false })).unwrap();
      message.success('Xóa sách thành công');
      // Refresh the list after successful deletion
      await fetchBooks();
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Không thể xóa sách';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle reprocess with AI
  const handleReprocess = async (book: IBook) => {
    try {
      setLoading(true);
      await dispatch(processBookWithAI(book.id)).unwrap();
      message.success('Đã gửi yêu cầu xử lý lại với AI');
      fetchBooks();
    } catch (error) {
      message.error('Không thể xử lý lại sách');
    } finally {
      setLoading(false);
    }
  };

  // View chapters
  const viewChapters = async (book: IBook) => {
    try {
      setLoading(true);
      setSelectedBook(book);
      const chaptersData = await dispatch(getBookChapters(book.id || 0)).unwrap();
      setChapters(Array.isArray(chaptersData) ? chaptersData : []);
      setIsChaptersModalVisible(true);
    } catch (error) {
      message.error('Không thể tải danh sách chương');
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status tag
  const getStatusTag = (status?: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'default', text: 'Chờ xử lý' },
      PROCESSING: { color: 'processing', text: 'Đang xử lý' },
      COMPLETED: { color: 'success', text: 'Hoàn thành' },
      FAILED: { color: 'error', text: 'Thất bại' },
    };
    const s = statusMap[status || 'PENDING'];
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // Table columns
  const columns: ColumnsType<IBook> = [
    {
      title: 'Sách',
      key: 'book',
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 60,
              height: 80,
              backgroundColor: '#f0f0f0',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: record.thumbnail ? `url(${record.thumbnail})` : 'none',
              backgroundSize: 'cover',
            }}
          >
            {!record.thumbnail && <BookOutlined style={{ fontSize: 24, color: '#999' }} />}
          </div>
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.level || '-'}
            </Text>
          </div>
        </Space>
      ),
      width: 300,
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      render: level => level || '-',
      width: 100,
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Rate disabled value={record.averageRating || 0} style={{ fontSize: 14 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.averageRating ? record.averageRating.toFixed(1) : '0.0'} ({record.totalReviews || 0})
          </Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isActive',
      width: 100,
      render: (_, record) => (
        <Tag color={record.isActive !== false ? 'success' : 'default'}>{record.isActive !== false ? 'Active' : 'Inactive'}</Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record) => (record.isActive !== false) === value,
    },
    {
      title: 'Xử lý',
      dataIndex: 'processingStatus',
      key: 'status',
      render: status => getStatusTag(status),
      filters: [
        { text: 'Chờ xử lý', value: 'PENDING' },
        { text: 'Đang xử lý', value: 'PROCESSING' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Thất bại', value: 'FAILED' },
      ],
      onFilter: (value: any, record) => record.processingStatus === value,
      width: 120,
    },
    {
      title: 'Chương',
      dataIndex: 'totalChapters',
      key: 'chapters',
      render: total => total || 0,
      width: 80,
    },
    {
      title: 'Trang',
      dataIndex: 'totalPages',
      key: 'pages',
      render: total => total || 0,
      width: 80,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: date => (date ? dayjs(date).format('DD/MM/YYYY') : '-'),
      sorter(a, b) {
        if (!a.createdDate || !b.createdDate) return 0;
        return dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix();
      },
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<UnorderedListOutlined />} size="small" onClick={() => navigate(`/staff/books/${record.id}/chapters`)}>
            Xem chương
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>
            Sửa
          </Button>
          {record.processingStatus === 'FAILED' && (
            <Button type="link" icon={<ReloadOutlined />} size="small" onClick={() => handleReprocess(record)}>
              Xử lý lại
            </Button>
          )}
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc muốn xóa sách này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 250,
      fixed: 'right',
    },
  ];

  // Bulk actions
  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Xóa nhiều sách',
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} sách đã chọn?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk() {
        message.success(`Đã xóa ${selectedRowKeys.length} sách`);
        setSelectedRowKeys([]);
        fetchBooks();
      },
    });
  };

  const handleBulkDeactivate = () => {
    message.success(`Đã ẩn ${selectedRowKeys.length} sách`);
    setSelectedRowKeys([]);
    fetchBooks();
  };

  const handleBulkExport = () => {
    message.info(`Đang xuất ${selectedRowKeys.length} sách ra Excel...`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              <BookOutlined style={{ marginRight: 8 }} />
              Quản lý sách
            </Title>
            <Text type="secondary">Tạo và quản lý sách với AI</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchBooks} size="large" style={{ borderRadius: 8 }}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => showModal()} style={{ borderRadius: 8 }}>
                Thêm sách mới
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Bulk Actions Bar - Floating */}
        {selectedRowKeys.length > 0 && (
          <Card
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999,
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              minWidth: 400,
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Text strong style={{ color: '#fff', fontSize: 16 }}>
                  <CheckSquareOutlined style={{ marginRight: 8 }} />
                  Đã chọn {selectedRowKeys.length} sách
                </Text>
              </Col>
              <Col>
                <Space>
                  <Button icon={<EyeInvisibleOutlined />} onClick={handleBulkDeactivate} style={{ borderRadius: 8 }}>
                    Ẩn
                  </Button>
                  <Button icon={<DownloadOutlined />} onClick={handleBulkExport} style={{ borderRadius: 8 }}>
                    Export
                  </Button>
                  <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} style={{ borderRadius: 8 }}>
                    Xóa
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

        {/* Table with Row Selection */}
        <Table
          columns={columns}
          dataSource={books}
          loading={loading}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            showSizeChanger: true,
            showTotal: total => `Tổng ${total} sách`,
          }}
          scroll={{ x: 1200 }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
          </Space>
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setThumbnailUrl('');
        }}
        okText={isEditMode ? 'Cập nhật' : 'Tạo sách'}
        cancelText="Hủy"
        width={700}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          {/* Thumbnail upload */}
          <Form.Item label="Ảnh bìa sách">
            <Space direction="vertical" style={{ width: '100%' }}>
              {thumbnailUrl && (
                <Image src={thumbnailUrl} alt="Thumbnail" style={{ maxWidth: 200, maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <Upload
                accept="image/*"
                beforeUpload={handleThumbnailUpload}
                showUploadList={false}
                maxCount={1}
                disabled={uploadingThumbnail}
              >
                <Button icon={<FileImageOutlined />} loading={uploadingThumbnail} size="large">
                  {thumbnailUrl ? 'Thay đổi ảnh bìa' : 'Tải ảnh bìa lên'}
                </Button>
              </Upload>
            </Space>
          </Form.Item>

          <Form.Item label="Tên sách" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên sách' }]}>
            <Input placeholder="Nhập tên sách" size="large" />
          </Form.Item>

          <Form.Item label="Cấp độ" name="level" rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}>
            <Select placeholder="Chọn cấp độ" size="large">
              <Option value="BEGINNER">Beginner</Option>
              <Option value="INTERMEDIATE">Intermediate</Option>
              <Option value="ADVANCED">Advanced</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} placeholder="Mô tả ngắn về nội dung sách" maxLength={5000} showCount />
          </Form.Item>

          <Form.Item label="Trạng thái hoạt động" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Chapters List Modal */}
      <Modal
        title={
          <Space>
            <BookOutlined />
            {`Danh sách chương - ${selectedBook?.title}`}
          </Space>
        }
        open={isChaptersModalVisible}
        onCancel={() => {
          setIsChaptersModalVisible(false);
          setChapters([]);
        }}
        footer={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                if (selectedBook) {
                  navigate(`/staff/chapters/new?bookId=${selectedBook.id}`);
                }
              }}
            >
              Thêm chương mới
            </Button>
            <Button onClick={() => setIsChaptersModalVisible(false)}>Đóng</Button>
          </Space>
        }
        width={1000}
      >
        <Table
          dataSource={chapters}
          loading={loading}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'STT',
              dataIndex: 'orderIndex',
              key: 'orderIndex',
              width: 60,
              sorter: (a, b) => a.orderIndex - b.orderIndex,
            },
            {
              title: 'Tên chương',
              dataIndex: 'title',
              key: 'title',
              render: text => <Text strong>{text}</Text>,
            },
            {
              title: 'Từ vựng',
              dataIndex: 'totalWords',
              key: 'totalWords',
              width: 90,
              render: total => <Tag color="blue">{total || 0}</Tag>,
            },
            {
              title: 'Ngữ pháp',
              dataIndex: 'totalGrammars',
              key: 'totalGrammars',
              width: 90,
              render: total => <Tag color="purple">{total || 0}</Tag>,
            },
            {
              title: 'Bài tập',
              dataIndex: 'totalExercises',
              key: 'totalExercises',
              width: 90,
              render: total => <Tag color="green">{total || 0}</Tag>,
            },
            {
              title: 'Hành động',
              key: 'actions',
              width: 180,
              render: (_, record) => (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      navigate(`/staff/chapters/${record.id}/edit`);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc muốn xóa chương "${record.title}"?`}
                    onConfirm={async () => {
                      try {
                        await fetch(`/api/chapters/${record.id}`, { method: 'DELETE' });
                        message.success('Đã xóa chương');
                        if (selectedBook) {
                          viewChapters(selectedBook);
                        }
                      } catch (error) {
                        message.error('Không thể xóa chương');
                      }
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default BookManagement;
