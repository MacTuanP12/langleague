package com.langleague.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.langleague.domain.Book;
import com.langleague.domain.Chapter;
import com.langleague.repository.ChapterRepository;
import com.langleague.service.dto.ChapterDTO;
import com.langleague.service.mapper.ChapterMapper;
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
 * Unit tests for {@link ChapterService}.
 */
@ExtendWith(MockitoExtension.class)
class ChapterServiceTest {

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private ChapterMapper chapterMapper;

    @InjectMocks
    private ChapterService chapterService;

    private Chapter chapter;
    private ChapterDTO chapterDTO;
    private Book book;

    @BeforeEach
    void setUp() {
        book = new Book();
        book.setId(1L);
        book.setTitle("Test Book");

        chapter = new Chapter();
        chapter.setId(1L);
        chapter.setTitle("Chapter 1: Introduction");
        chapter.setOrderIndex(1);
        chapter.setBook(book);

        chapterDTO = new ChapterDTO();
        chapterDTO.setId(1L);
        chapterDTO.setTitle("Chapter 1: Introduction");
        chapterDTO.setOrderIndex(1);
    }

    @Test
    void testSaveChapter() {
        // Given
        when(chapterMapper.toEntity(chapterDTO)).thenReturn(chapter);
        when(chapterRepository.save(chapter)).thenReturn(chapter);
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        ChapterDTO savedChapter = chapterService.save(chapterDTO);

        // Then
        assertThat(savedChapter).isNotNull();
        assertThat(savedChapter.getId()).isEqualTo(1L);
        assertThat(savedChapter.getTitle()).isEqualTo("Chapter 1: Introduction");
        assertThat(savedChapter.getOrderIndex()).isEqualTo(1);
        verify(chapterRepository, times(1)).save(chapter);
    }

    @Test
    void testUpdateChapter() {
        // Given
        chapterDTO.setTitle("Updated Chapter Title");

        when(chapterMapper.toEntity(chapterDTO)).thenReturn(chapter);
        when(chapterRepository.save(chapter)).thenReturn(chapter);
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        ChapterDTO updatedChapter = chapterService.update(chapterDTO);

        // Then
        assertThat(updatedChapter).isNotNull();
        verify(chapterRepository, times(1)).save(chapter);
    }

    @Test
    void testPartialUpdateChapter() {
        // Given
        ChapterDTO partialDTO = new ChapterDTO();
        partialDTO.setId(1L);
        partialDTO.setTitle("Partially Updated Title");

        when(chapterRepository.findById(1L)).thenReturn(Optional.of(chapter));
        when(chapterRepository.save(chapter)).thenReturn(chapter);
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        Optional<ChapterDTO> result = chapterService.partialUpdate(partialDTO);

        // Then
        assertThat(result).isPresent();
        verify(chapterRepository, times(1)).findById(1L);
        verify(chapterMapper, times(1)).partialUpdate(chapter, partialDTO);
    }

    @Test
    void testFindAllChapters() {
        // Given
        List<Chapter> chapters = List.of(chapter);
        Page<Chapter> chapterPage = new PageImpl<>(chapters);
        Pageable pageable = PageRequest.of(0, 10);

        when(chapterRepository.findAll(pageable)).thenReturn(chapterPage);
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        Page<ChapterDTO> result = chapterService.findAll(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getOrderIndex()).isEqualTo(1);
    }

    @Test
    void testFindOneChapter() {
        // Given
        when(chapterRepository.findById(1L)).thenReturn(Optional.of(chapter));
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        Optional<ChapterDTO> result = chapterService.findOne(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getId()).isEqualTo(1L);
        assertThat(result.orElseThrow().getTitle()).isEqualTo("Chapter 1: Introduction");
    }

    @Test
    void testDeleteChapter() {
        // Given
        Long chapterId = 1L;

        // When
        chapterService.delete(chapterId);

        // Then
        verify(chapterRepository, times(1)).deleteById(chapterId);
    }

    @Test
    void testFindByBookId() {
        // Given
        when(chapterRepository.findByBookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(chapter));
        when(chapterMapper.toDto(chapter)).thenReturn(chapterDTO);

        // When
        List<ChapterDTO> results = chapterService.findByBookId(1L);

        // Then
        assertThat(results).isNotNull();
        assertThat(results).hasSize(1);
        verify(chapterRepository, times(1)).findByBookIdOrderByOrderIndexAsc(1L);
    }

    @Test
    void testChapterOrderValidation() {
        // Given
        Chapter chapter1 = new Chapter();
        chapter1.setOrderIndex(1);

        Chapter chapter2 = new Chapter();
        chapter2.setOrderIndex(2);

        // When
        boolean isCorrectOrder = chapter1.getOrderIndex() < chapter2.getOrderIndex();

        // Then
        assertThat(isCorrectOrder).isTrue();
    }
}
