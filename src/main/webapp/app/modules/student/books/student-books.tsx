import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button, Badge, Row, Col } from 'reactstrap';
import { useBooks, useEnrollments } from 'app/shared/reducers/hooks';
import './student-books.scss';

export const StudentBooks = () => {
  const { books, loading: booksLoading, loadBooks } = useBooks();
  const { enrollments, loadMyEnrollments } = useEnrollments();

  useEffect(() => {
    loadBooks();
    loadMyEnrollments();
  }, [loadBooks, loadMyEnrollments]);

  const isEnrolled = (bookId: number) => {
    return enrollments.some(e => e.book?.id === bookId);
  };

  if (booksLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="student-books-container">
      <div className="page-header mb-4">
        <h2>📚 Khám phá khóa học</h2>
        <p className="text-muted">Chọn khóa học bạn muốn học</p>
      </div>

      <Row>
        {books
          .filter(book => book.isPublic)
          .map(book => (
            <Col key={book.id} md={6} lg={4} className="mb-4">
              <Card className="book-card h-100">
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="card-img-top book-cover"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5">{book.title}</CardTitle>
                  <CardText className="flex-grow-1">{book.description}</CardText>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    {isEnrolled(book.id) ? (
                      <>
                        <Badge color="success">Đã đăng ký</Badge>
                        <Link to={`/student/books/${book.id}/learn`}>
                          <Button color="primary" size="sm">
                            Học ngay
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link to={`/student/books/${book.id}`} className="w-100">
                        <Button color="outline-primary" className="w-100">
                          Xem chi tiết
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
      </Row>

      {(books || []).filter(book => book.isPublic).length === 0 && (
        <div className="text-center p-5">
          <p className="text-muted">Chưa có khóa học nào</p>
        </div>
      )}
    </div>
  );
};

export default StudentBooks;
