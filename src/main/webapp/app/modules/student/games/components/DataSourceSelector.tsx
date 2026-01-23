import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Spinner, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import axios from 'axios';
import { IEnrollment } from 'app/shared/model/enrollment.model';

interface DataSourceSelectorProps {
  isOpen: boolean;
  toggle: () => void;
  onStartGame: (unitIds: number[]) => void;
}

interface Book {
  id: number;
  title: string;
  imageUrl?: string;
}

interface Unit {
  id: number;
  title: string;
  bookId: number;
}

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({ isOpen, toggle, onStartGame }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [unitsByBook, setUnitsByBook] = useState<Record<number, Unit[]>>({});
  const [expandedBooks, setExpandedBooks] = useState<Set<number>>(new Set());
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<number>>(new Set());
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState<Record<number, boolean>>({});

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const response = await axios.get<IEnrollment[]>('/api/enrollments?filter=my-books');
      if (!isMountedRef.current) return;

      const booksData = response.data
        .map(enrollment => enrollment.book)
        .filter((book): book is Book => !!book)
        .map(book => ({
          id: book.id || 0,
          title: book.title || '',
          imageUrl: book.imageUrl || undefined,
        }));
      setBooks(booksData);
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingBooks(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void fetchBooks();
    }
  }, [isOpen, fetchBooks]);

  const fetchUnits = useCallback(
    async (bookId: number) => {
      if (unitsByBook[bookId]) return;

      setLoadingUnits(prev => ({ ...prev, [bookId]: true }));
      try {
        const response = await axios.get(`/api/units/by-book/${bookId}`);
        if (isMountedRef.current) {
          setUnitsByBook(prev => ({ ...prev, [bookId]: response.data }));
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error(`Error fetching units for book ${bookId}:`, error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingUnits(prev => ({ ...prev, [bookId]: false }));
        }
      }
    },
    [unitsByBook],
  );

  const toggleBook = useCallback(
    (bookId: number) => {
      const newExpanded = new Set(expandedBooks);
      if (newExpanded.has(bookId)) {
        newExpanded.delete(bookId);
      } else {
        newExpanded.add(bookId);
        void fetchUnits(bookId);
      }
      setExpandedBooks(newExpanded);
    },
    [expandedBooks, fetchUnits],
  );

  const toggleUnit = useCallback(
    (unitId: number) => {
      const newSelected = new Set(selectedUnitIds);
      if (newSelected.has(unitId)) {
        newSelected.delete(unitId);
      } else {
        newSelected.add(unitId);
      }
      setSelectedUnitIds(newSelected);
    },
    [selectedUnitIds],
  );

  const toggleAllUnitsInBook = useCallback(
    (units: Unit[]) => {
      const newSelected = new Set(selectedUnitIds);
      const allSelected = units.every(u => newSelected.has(u.id));

      if (allSelected) {
        units.forEach(u => newSelected.delete(u.id));
      } else {
        units.forEach(u => newSelected.add(u.id));
      }
      setSelectedUnitIds(newSelected);
    },
    [selectedUnitIds],
  );

  const handleStart = useCallback(() => {
    onStartGame(Array.from(selectedUnitIds));
    toggle();
  }, [onStartGame, selectedUnitIds, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <Translate contentKey="langleague.student.games.dataSource.title">Select Learning Material</Translate>
      </ModalHeader>
      <ModalBody>
        <p className="text-muted mb-3">
          <Translate contentKey="langleague.student.games.dataSource.description">Choose the units you want to practice with.</Translate>
        </p>

        {loadingBooks ? (
          <div className="text-center py-4">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="book-list">
            {books.map(book => (
              <div key={book.id} className="mb-3 border rounded p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => toggleBook(book.id)}>
                    <FontAwesomeIcon icon={expandedBooks.has(book.id) ? 'chevron-down' : 'chevron-right'} className="me-2 text-muted" />
                    <h5 className="mb-0">{book.title}</h5>
                  </div>

                  {unitsByBook[book.id] && unitsByBook[book.id].length > 0 && (
                    <div className="form-check ms-3" title={translate('langleague.student.games.dataSource.selectAll')}>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        checked={unitsByBook[book.id].every(u => selectedUnitIds.has(u.id))}
                        onChange={() => toggleAllUnitsInBook(unitsByBook[book.id])}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>

                <Collapse isOpen={expandedBooks.has(book.id)}>
                  <div className="mt-3 ps-4">
                    {loadingUnits[book.id] ? (
                      <Spinner size="sm" color="secondary" />
                    ) : (
                      unitsByBook[book.id]?.map(unit => (
                        <div key={unit.id} className="form-check mb-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id={`unit-${unit.id}`}
                            checked={selectedUnitIds.has(unit.id)}
                            onChange={() => toggleUnit(unit.id)}
                          />
                          <Label className="form-check-label" for={`unit-${unit.id}`}>
                            {unit.title}
                          </Label>
                        </div>
                      ))
                    )}
                    {unitsByBook[book.id] && unitsByBook[book.id].length === 0 && (
                      <div className="text-muted fst-italic">
                        <Translate contentKey="langleague.student.books.detail.units.empty">No units available yet</Translate>
                      </div>
                    )}
                  </div>
                </Collapse>
              </div>
            ))}
            {books.length === 0 && (
              <div className="text-center py-4 text-muted">
                <Translate contentKey="langleague.student.books.noBooks">No books found</Translate>
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <span className="text-muted">
            <Translate contentKey="langleague.student.games.dataSource.unitsSelected" interpolate={{ count: selectedUnitIds.size }}>
              {`${selectedUnitIds.size} units selected`}
            </Translate>
          </span>
          <div>
            <Button color="secondary" onClick={toggle} className="me-2">
              <Translate contentKey="langleague.student.games.dataSource.cancel">Cancel</Translate>
            </Button>
            <Button color="primary" onClick={handleStart} disabled={selectedUnitIds.size === 0}>
              <Translate contentKey="langleague.student.games.dataSource.startGame">Start Game</Translate>
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};
