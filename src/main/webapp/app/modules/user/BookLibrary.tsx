import React, { useState, useEffect } from 'react';
import { Pagination, Card, Row, Col, Typography, Input, Select, Tag, Space, Empty, Skeleton } from 'antd';
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/shared/reducers/book.reducer';
import { IBook } from 'app/shared/model/book.model';
import { useTranslation } from 'react-i18next';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import * as ds from 'app/shared/styles/design-system';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ITEMS_PER_PAGE = 12;

const BookLibrary: React.FC = () => {
  const { t } = useTranslation(['common', 'user']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const bookList = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const totalItems = useAppSelector(state => state.book.totalItems);

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams({ page: 1, size: ITEMS_PER_PAGE, sort: 'id,asc' })
  );

  useEffect(() => {
    dispatch(getEntities({ page: pagination.page - 1, size: pagination.size, sort: pagination.sort }));
  }, [pagination.page, pagination.size, pagination.sort]);

  const handlePagination = (page, pageSize) => setPagination({ ...pagination, page, size: pageSize });

  return (
    <div style={{ ...ds.pageContainerStyle, padding: ds.spacing.lg }}>
      <div style={{ textAlign: 'center', marginBottom: ds.spacing.xxl }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: ds.spacing.sm, color: ds.colors.primary.DEFAULT }} />
          {t('books.title')}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: ds.typography.fontSize.md }}>
          Khám phá và học tiếng Hàn với hàng trăm cuốn sách được AI phân tích.
        </Paragraph>
      </div>

      <Card style={{ ...ds.cardBaseStyle, background: 'var(--bg-tertiary)', marginBottom: ds.spacing.lg }}>
        <Row gutter={ds.layout.cardGutter.desktop}>
          <Col xs={24} md={16}>
            <Input size="large" placeholder={t('books.search')} prefix={<SearchOutlined />} style={ds.inputStyle} disabled />
          </Col>
          <Col xs={24} md={8}>
            <Select size="large" placeholder={t('books.level')} style={{ ...ds.inputStyle, width: '100%' }} disabled>
              <Option value="all">Tất cả mức độ</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Row gutter={[ds.layout.cardGutter.desktop, ds.layout.cardGutter.desktop]}>
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card style={{ ...ds.cardBaseStyle, overflow: 'hidden' }}>
                <Skeleton.Image active style={{ width: '100%', height: 280, marginBottom: ds.spacing.md }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : bookList.length === 0 ? (
        <Card style={ds.cardBaseStyle}><Empty description={t('common.noData')} /></Card>
      ) : (
        <Row gutter={[ds.layout.cardGutter.desktop, ds.layout.cardGutter.desktop]}>
          {bookList.map(book => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Card
                hoverable
                onClick={() => navigate(`/user/books/${book.id}`)}
                style={{ ...ds.cardBaseStyle, overflow: 'hidden', height: '100%' }}
                cover={
                  <div
                    style={{
                      height: 280,
                      backgroundImage: `url(${book.thumbnail || ''})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    {book.level && (
                      <Tag
                        color={ds.getLevelColor(book.level)}
                        style={{ position: 'absolute', top: ds.spacing.md, right: ds.spacing.md, borderRadius: ds.borderRadius.sm }}
                      >
                        {ds.getLevelText(book.level)}
                      </Tag>
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={<span style={{ color: ds.colors.text.primary }}>{book.title}</span>}
                  description={<span style={{ color: ds.colors.text.secondary }}>{book.author}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {totalItems > 0 && (
        <div style={{ textAlign: 'center', marginTop: ds.spacing.xl }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={totalItems}
            onChange={handlePagination}
            showSizeChanger
          />
        </div>
      )}
    </div>
  );
};

export default BookLibrary;
