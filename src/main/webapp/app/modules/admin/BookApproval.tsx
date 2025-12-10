import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal, Typography, Image, Descriptions, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined, ReloadOutlined, BookOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { IBook } from 'app/shared/model/models';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const BookApproval: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchInactiveBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/books/inactive');
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error(t('admin:bookApproval.errorLoadBooks') || 'Không thể tải danh sách sách chờ duyệt');
      console.error('Error fetching inactive books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveBooks();
  }, []);

  const handleApprove = async (bookId: number) => {
    setActionLoading(bookId);
    try {
      await axios.put(`/api/books/${bookId}/approve`);
      message.success(t('admin:bookApproval.approveSuccess') || 'Đã duyệt sách thành công!');
      fetchInactiveBooks();
    } catch (error) {
      message.error(t('admin:bookApproval.errorApprove') || 'Không thể duyệt sách');
      console.error('Error approving book:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookId: number) => {
    setActionLoading(bookId);
    try {
      await axios.put(`/api/books/${bookId}/reject`);
      message.success(t('admin:bookApproval.rejectSuccess') || 'Đã từ chối sách');
      fetchInactiveBooks();
    } catch (error) {
      message.error(t('admin:bookApproval.errorReject') || 'Không thể từ chối sách');
      console.error('Error rejecting book:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleHardDelete = async (bookId: number) => {
    setActionLoading(bookId);
    try {
      await axios.delete(`/api/books/${bookId}/hard?force=true`);
      message.success(t('admin:bookApproval.deleteSuccess') || 'Đã xóa vĩnh viễn sách');
      fetchInactiveBooks();
    } catch (error) {
      message.error(t('admin:bookApproval.errorDelete') || 'Không thể xóa sách');
      console.error('Error deleting book:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const showBookDetail = (book: IBook) => {
    setSelectedBook(book);
    setIsDetailModalVisible(true);
  };

  const columns: ColumnsType<IBook> = [
    {
      title: t('admin:bookApproval.thumbnail'),
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail: string) =>
        thumbnail ? (
          <Image src={thumbnail} alt="Book" width={60} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div
            style={{
              width: 60,
              height: 80,
              background: '#f0f0f0',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOutlined style={{ fontSize: 24, color: '#999' }} />
          </div>
        ),
    },
    {
      title: t('admin:bookApproval.title_column'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title: string, record: IBook) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <Tag color={record.level === 'BEGINNER' ? 'green' : record.level === 'INTERMEDIATE' ? 'blue' : 'orange'}>{record.level}</Tag>
        </div>
      ),
    },
    {
      title: t('admin:bookApproval.description_column'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {description?.substring(0, 100)}
          {description?.length > 100 ? '...' : ''}
        </Text>
      ),
    },
    {
      title: t('admin:bookApproval.status_column'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? t('admin:bookApproval.approved_status') : t('admin:bookApproval.pending_status')}
        </Tag>
      ),
    },
    {
      title: t('admin:bookApproval.actions'),
      key: 'actions',
      width: 250,
      align: 'center',
      render: (_: any, record: IBook) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showBookDetail(record)} size="small">
            {t('admin:bookApproval.viewDetails')}
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            loading={actionLoading === record.id}
            size="small"
          >
            {t('admin:bookApproval.approve')}
          </Button>
          <Popconfirm
            title={t('admin:bookApproval.confirmDelete')}
            description={t('admin:bookApproval.confirmDeleteMessage')}
            onConfirm={() => handleHardDelete(record.id)}
            okText={t('admin:bookApproval.delete')}
            cancelText={t('common:cancel')}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} loading={actionLoading === record.id} size="small">
              {t('admin:bookApproval.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            {t('admin:bookApproval.title')}
          </Title>
          <Button icon={<ReloadOutlined />} onClick={fetchInactiveBooks} loading={loading}>
            {t('admin:bookApproval.refresh')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={books}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total => t('admin:bookApproval.totalBooks', { count: total }),
          }}
          locale={{
            emptyText: t('admin:bookApproval.noBooksToApprove'),
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {t('admin:bookApproval.bookDetails')}
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            {t('admin:bookApproval.close')}
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => {
              if (selectedBook?.id) {
                handleApprove(selectedBook.id);
                setIsDetailModalVisible(false);
              }
            }}
          >
            {t('admin:bookApproval.approveBook')}
          </Button>,
        ]}
        width={800}
      >
        {selectedBook && (
          <div>
            {selectedBook.thumbnail && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Image
                  src={selectedBook.thumbnail}
                  alt={selectedBook.title}
                  style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              </div>
            )}
            <Descriptions column={2} bordered>
              <Descriptions.Item label={t('admin:bookApproval.title_column')} span={2}>
                <Text strong style={{ fontSize: 16 }}>
                  {selectedBook.title}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('admin:bookApproval.level')}>
                <Tag color={selectedBook.level === 'BEGINNER' ? 'green' : selectedBook.level === 'INTERMEDIATE' ? 'blue' : 'orange'}>
                  {selectedBook.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('admin:bookApproval.status_column')}>
                <Tag color={selectedBook.isActive ? 'success' : 'error'}>
                  {selectedBook.isActive ? t('admin:bookApproval.activated') : t('admin:bookApproval.notActivated')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('admin:bookApproval.averageRating')}>
                {selectedBook.averageRating?.toFixed(1)} ⭐ ({selectedBook.totalReviews} {t('common:reviews')})
              </Descriptions.Item>
              <Descriptions.Item label={t('admin:bookApproval.id')}>#{selectedBook.id}</Descriptions.Item>
              <Descriptions.Item label={t('admin:bookApproval.description')} span={2}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{selectedBook.description || t('common:noDescription')}</div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookApproval;
