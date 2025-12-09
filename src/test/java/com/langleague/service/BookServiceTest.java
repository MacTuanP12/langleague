package com.langleague.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.langleague.domain.Book;
import com.langleague.domain.enumeration.Level;
import com.langleague.repository.BookRepository;
import com.langleague.service.dto.BookDTO;
import com.langleague.service.mapper.BookMapper;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Unit tests for {@link BookService}.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookService bookService;

    private Book book;
    private BookDTO bookDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        book = new Book();
        book.setId(1L);
        book.setTitle("Test Book");
        book.setLevel(Level.BEGINNER);
        book.setDescription("Test Description");
        book.setThumbnail("http://example.com/thumbnail.jpg");

        bookDTO = new BookDTO();
        bookDTO.setId(1L);
        bookDTO.setTitle("Test Book");
        bookDTO.setLevel(Level.BEGINNER);
        bookDTO.setDescription("Test Description");
        bookDTO.setThumbnail("http://example.com/thumbnail.jpg");
    }

    @Test
    void testSaveBook() {
        // Given
        when(bookMapper.toEntity(bookDTO)).thenReturn(book);
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        BookDTO savedBook = bookService.save(bookDTO);

        // Then
        assertThat(savedBook).isNotNull();
        assertThat(savedBook.getId()).isEqualTo(1L);
        assertThat(savedBook.getTitle()).isEqualTo("Test Book");
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testUpdateBook() {
        // Given
        when(bookMapper.toEntity(bookDTO)).thenReturn(book);
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        BookDTO updatedBook = bookService.update(bookDTO);

        // Then
        assertThat(updatedBook).isNotNull();
        assertThat(updatedBook.getId()).isEqualTo(1L);
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testPartialUpdateBook() {
        // Given
        BookDTO partialBookDTO = new BookDTO();
        partialBookDTO.setId(1L);
        partialBookDTO.setTitle("Updated Title");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookRepository.save(book)).thenReturn(book);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Optional<BookDTO> result = bookService.partialUpdate(partialBookDTO);

        // Then
        assertThat(result).isPresent();
        verify(bookRepository, times(1)).findById(1L);
        verify(bookMapper, times(1)).partialUpdate(book, partialBookDTO);
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testPartialUpdateBookNotFound() {
        // Given
        BookDTO partialBookDTO = new BookDTO();
        partialBookDTO.setId(999L);

        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<BookDTO> result = bookService.partialUpdate(partialBookDTO);

        // Then
        assertThat(result).isEmpty();
        verify(bookRepository, times(1)).findById(999L);
        verify(bookRepository, never()).save(any());
    }

    @Test
    void testFindAllBooks() {
        // Given
        List<Book> books = List.of(book);
        Page<Book> bookPage = new PageImpl<>(books);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findAll(pageable)).thenReturn(bookPage);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Page<BookDTO> result = bookService.findAll(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getTitle()).isEqualTo("Test Book");
        verify(bookRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindOneBook() {
        // Given
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Optional<BookDTO> result = bookService.findOne(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getId()).isEqualTo(1L);
        assertThat(result.orElseThrow().getTitle()).isEqualTo("Test Book");
        verify(bookRepository, times(1)).findById(1L);
    }

    @Test
    void testFindOneBookNotFound() {
        // Given
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<BookDTO> result = bookService.findOne(999L);

        // Then
        assertThat(result).isEmpty();
        verify(bookRepository, times(1)).findById(999L);
    }

    @Test
    void testDeleteBook() {
        // Given
        Long bookId = 1L;

        // When
        bookService.delete(bookId);

        // Then
        verify(bookRepository, times(1)).deleteById(bookId);
    }

    @Test
    void testSearchBooks() {
        // Given
        String keyword = "Test";
        List<Book> books = List.of(book);
        Page<Book> bookPage = new PageImpl<>(books);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable)).thenReturn(
            bookPage
        );
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Page<BookDTO> result = bookService.searchBooks(keyword, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getTitle()).isEqualTo("Test Book");
        verify(bookRepository, times(1)).findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable);
    }

    @Test
    void testSearchBooksWithEmptyKeyword() {
        // Given
        String keyword = "";
        List<Book> books = List.of(book);
        Page<Book> bookPage = new PageImpl<>(books);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findAll(pageable)).thenReturn(bookPage);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Page<BookDTO> result = bookService.searchBooks(keyword, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(bookRepository, times(1)).findAll(pageable);
        verify(bookRepository, never()).findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(any(), any(), any());
    }

    @Test
    void testSearchBooksWithNullKeyword() {
        // Given
        String keyword = null;
        List<Book> books = List.of(book);
        Page<Book> bookPage = new PageImpl<>(books);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findAll(pageable)).thenReturn(bookPage);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        Page<BookDTO> result = bookService.searchBooks(keyword, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(bookRepository, times(1)).findAll(pageable);
        verify(bookRepository, never()).findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(any(), any(), any());
    }

    @Test
    void testFindByLevel() {
        // Given
        String level = "BEGINNER";
        List<Book> books = List.of(book);
        when(bookRepository.findByLevel(Level.BEGINNER)).thenReturn(books);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        List<BookDTO> result = bookService.findByLevel(level);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getLevel()).isEqualTo(Level.BEGINNER);
        verify(bookRepository, times(1)).findByLevel(Level.BEGINNER);
    }

    @Test
    void testFindByLevelWithInvalidLevel() {
        // Given
        String invalidLevel = "INVALID_LEVEL";

        // When
        List<BookDTO> result = bookService.findByLevel(invalidLevel);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
        verify(bookRepository, never()).findByLevel(any());
    }

    @Test
    void testFindByLevelCaseInsensitive() {
        // Given
        String level = "beginner"; // lowercase
        List<Book> books = List.of(book);
        when(bookRepository.findByLevel(Level.BEGINNER)).thenReturn(books);
        when(bookMapper.toDto(book)).thenReturn(bookDTO);

        // When
        List<BookDTO> result = bookService.findByLevel(level);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        verify(bookRepository, times(1)).findByLevel(Level.BEGINNER);
    }
}
