import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Input, Row, Col, Tag, Typography, Space, Modal, Form, Select, Upload, message, Popconfirm, Image } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  UserOutlined,
  EyeOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from 'app/config/store';
import { getBooks, createBook, updateBook, deleteBook } from 'app/shared/services/book.service';
import { uploadImage } from 'app/shared/services/file-upload.service';
import { IBook } from 'app/shared/model/models';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CourseManagement: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [form] = Form.useForm();

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const result = await dispatch(getBooks({ page: 0, size: 100 })).unwrap();
      setBooks(Array.isArray(result) ? result : []);
    } catch (error: any) {
      message.error(t('error.loadFailed') || 'Failed to load books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Show modal for create/edit
  const showModal = (book?: IBook) => {
    if (book) {
      setIsEditMode(true);
      setSelectedBook(book);
      setThumbnailUrl(book.thumbnail || '');
      form.setFieldsValue({
        title: book.title,
        level: book.level,
        description: book.description,
        author: book.author,
        publisher: book.publisher,
        publishYear: book.publishYear,
      });
    } else {
      setIsEditMode(false);
      setSelectedBook(null);
      setThumbnailUrl('');
      form.resetFields();
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
      message.success(t('common.upload') + ' ' + (t('common.success') || 'successful'));
      return false;
    } catch (error: any) {
      message.error(t('common.upload') + ' ' + (t('common.error') || 'failed'));
      return false;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const bookData: Partial<IBook> = {
        title: values.title,
        level: values.level,
        description: values.description,
        author: values.author,
        publisher: values.publisher,
        publishYear: values.publishYear,
        thumbnail: thumbnailUrl || undefined,
      };

      if (isEditMode && selectedBook?.id) {
        await dispatch(updateBook({ id: selectedBook.id, book: { ...selectedBook, ...bookData } })).unwrap();
        message.success(t('admin.courseManagement.updateSuccess') || 'Updated successfully');
      } else {
        await dispatch(createBook(bookData as IBook)).unwrap();
        message.success(t('admin.courseManagement.createSuccess') || 'Created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setThumbnailUrl('');
      fetchBooks();
    } catch (error: any) {
      message.error(error.message || t('common.error') || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (book: IBook) => {
    try {
      setLoading(true);
      await dispatch(deleteBook(book.id)).unwrap();
      message.success(t('admin.courseManagement.deleteSuccess') || 'Deleted successfully');
      fetchBooks();
    } catch (error: any) {
      message.error(t('admin.courseManagement.deleteError') || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to book details
  const handleViewDetails = (book: IBook) => {
    navigate(`/staff/books/${book.id}/chapters`);
  };

  // Filter books
  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Get level tag
  const getLevelTag = (level?: string) => {
    const levelMap: Record<string, { color: string; text: string }> = {
      BEGINNER: { color: 'green', text: 'Sơ cấp' },
      INTERMEDIATE: { color: 'blue', text: 'Trung cấp' },
      ADVANCED: { color: 'red', text: 'Cao cấp' },
    };
    const l = levelMap[level || 'BEGINNER'];
    return <Tag color={l.color}>{l.text}</Tag>;
  };

  return (
    <div style={{ padding: '32px', background: '#f5f5f7', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          marginBottom: 24,
          border: 'none',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
              {t('admin.courseManagement.greeting')}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>{t('admin.courseManagement.subtitle')}</Text>
          </Col>
          <Col>
            <img
              src="https://img.freepik.com/free-vector/business-team-discussing-ideas-startup_74855-4380.jpg"
              alt="Admin"
              style={{ height: 120, objectFit: 'contain' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
          {t('admin.courseManagement.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {t('admin.courseManagement.totalCourses', { count: books.length })}
        </Text>
      </div>

      {/* Search and Add Button */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Input
            placeholder={t('admin.courseManagement.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300, borderRadius: 8 }}
            size="large"
          />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large" style={{ borderRadius: 8 }}>
            {t('admin.courseManagement.addNewCourse')}
          </Button>
        </Col>
      </Row>

      {/* Course Cards Grid */}
      <Row gutter={[24, 24]}>
        {filteredBooks.map(book => (
          <Col key={book.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              loading={loading}
              cover={
                <div style={{ position: 'relative', height: 200, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  {book.thumbnail ? (
                    <img alt={book.title} src={book.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                      }}
                    >
                      <BookOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(book)} style={{ borderRadius: 6 }} />
                    <Button icon={<EditOutlined />} onClick={() => showModal(book)} style={{ borderRadius: 6 }} />
                    <Popconfirm
                      title={t('admin.courseManagement.confirmDelete')}
                      description={t('admin.courseManagement.deleteConfirmMessage')}
                      onConfirm={() => handleDelete(book)}
                      okText={t('common.delete')}
                      cancelText={t('common.cancel')}
                    >
                      <Button danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
                    </Popconfirm>
                  </div>
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>{getLevelTag(book.level)}</div>
                </div>
              }
              style={{ borderRadius: 12, overflow: 'hidden' }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} style={{ marginBottom: 8, minHeight: 48 }} ellipsis={{ rows: 2 }}>
                {book.title}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }} ellipsis>
                {book.author || t('admin.courseManagement.noAuthor')}
              </Text>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space size={4}>
                    <BookOutlined style={{ color: '#667eea' }} />
                    <Text type="secondary">
                      {book.totalChapters || 0} {t('admin.courseManagement.chapters')}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <UserOutlined style={{ color: '#667eea' }} />
                    <Text type="secondary">0 {t('admin.courseManagement.students')}</Text>
                  </Space>
                </Space>
                <Button type="primary" block style={{ borderRadius: 8, marginTop: 8 }} onClick={() => handleViewDetails(book)}>
                  {t('admin.courseManagement.viewDetails')} →
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Course Modal */}
      <Modal
        title={isEditMode ? t('admin.courseManagement.form.editTitle') : t('admin.courseManagement.form.createTitle')}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setThumbnailUrl('');
        }}
        width={700}
        okText={isEditMode ? t('common.update') : t('common.create')}
        cancelText={t('common.cancel')}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          {/* Thumbnail upload */}
          <Form.Item label={t('admin.courseManagement.form.courseImage')}>
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
                  {thumbnailUrl ? t('admin.courseManagement.form.changeCourseImage') : t('admin.courseManagement.form.uploadCourseImage')}
                </Button>
              </Upload>
            </Space>
          </Form.Item>

          <Form.Item
            label={t('admin.courseManagement.form.courseName')}
            name="title"
            rules={[
              {
                required: true,
                message: t('admin.courseManagement.form.courseName') + ' ' + t('admin.courseManagement.validation.required'),
              },
            ]}
          >
            <Input placeholder={t('admin.courseManagement.form.courseName')} size="large" />
          </Form.Item>

          <Form.Item
            label={t('admin.courseManagement.form.level')}
            name="level"
            rules={[
              { required: true, message: t('admin.courseManagement.form.level') + ' ' + t('admin.courseManagement.validation.required') },
            ]}
          >
            <Select placeholder={t('admin.courseManagement.form.level')} size="large">
              <Option value="BEGINNER">{t('admin.courseManagement.form.beginner')}</Option>
              <Option value="INTERMEDIATE">{t('admin.courseManagement.form.intermediate')}</Option>
              <Option value="ADVANCED">{t('admin.courseManagement.form.advanced')}</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('admin.courseManagement.form.author')} name="author">
                <Input placeholder={t('admin.courseManagement.form.author')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('admin.courseManagement.form.publisher')} name="publisher">
                <Input placeholder={t('admin.courseManagement.form.publisher')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={t('admin.courseManagement.form.publishYear')} name="publishYear">
            <Input type="number" placeholder="2025" />
          </Form.Item>

          <Form.Item label={t('admin.courseManagement.form.description')} name="description">
            <TextArea rows={4} placeholder={t('admin.courseManagement.form.description')} maxLength={5000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
