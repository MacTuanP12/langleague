import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { createBookReview, BookReviewDTO } from 'app/shared/services/book-review.service';
import StarRating from 'app/shared/components/StarRating';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface ReviewFormProps {
  bookId: number;
  bookTitle?: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, bookTitle, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['book-reviews', 'common']);
  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    if (rating === 0) {
      message.warning(t('bookReviews.validation.ratingRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const review: BookReviewDTO = {
        bookId,
        rating,
        title: values.title,
        content: values.content,
      };

      await dispatch(createBookReview(review)).unwrap();
      message.success(t('bookReviews.messages.submitSuccess'));
      form.resetFields();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      message.error(t('bookReviews.messages.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title={t('bookReviews.form.title')} bordered={false}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t('bookReviews.form.ratingLabel')} required>
          <StarRating value={rating} onChange={setRating} size="large" />
        </Form.Item>

        <Form.Item
          label={t('bookReviews.form.titleLabel')}
          name="title"
          rules={[
            { required: true, message: t('bookReviews.validation.titleRequired') },
            { max: 100, message: t('bookReviews.validation.titleMaxLength') },
          ]}
        >
          <Input placeholder={t('bookReviews.form.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('bookReviews.form.contentLabel')}
          name="content"
          rules={[
            { required: true, message: t('bookReviews.validation.commentRequired') },
            { min: 20, message: t('bookReviews.validation.commentMinLength') },
            { max: 2000, message: t('bookReviews.validation.commentMaxLength') },
          ]}
        >
          <TextArea rows={6} placeholder={t('bookReviews.form.commentPlaceholder')} showCount maxLength={2000} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} size="large">
            {t('bookReviews.form.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReviewForm;
