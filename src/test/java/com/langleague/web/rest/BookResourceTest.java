package com.langleague.web.rest;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.langleague.domain.enumeration.Level;
import com.langleague.service.BookService;
import com.langleague.service.dto.BookDTO;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for {@link BookResource}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class BookResourceTest {

    private static final String ENTITY_API_URL = "/api/books";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private MockMvc restBookMockMvc;

    @MockBean
    private BookService bookService;

    private BookDTO bookDTO;

    @BeforeEach
    void setUp() {
        bookDTO = new BookDTO();
        bookDTO.setId(1L);
        bookDTO.setTitle("Test Korean Novel");
        bookDTO.setDescription("A great Korean learning book");
        bookDTO.setThumbnail("http://example.com/cover.jpg");
        bookDTO.setLevel(Level.BEGINNER);
    }

    @Test
    void testGetAllBooks() throws Exception {
        // Given
        List<BookDTO> books = Collections.singletonList(bookDTO);
        Page<BookDTO> page = new PageImpl<>(books);
        when(bookService.findAll(any(Pageable.class))).thenReturn(page);

        // When & Then
        restBookMockMvc
            .perform(get(ENTITY_API_URL + "?page=0&size=20"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookDTO.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem("Test Korean Novel")))
            .andExpect(jsonPath("$.[*].level").value(hasItem("BEGINNER")));
    }

    @Test
    void testGetBook() throws Exception {
        // Given
        when(bookService.findOne(1L)).thenReturn(Optional.of(bookDTO));

        // When & Then
        restBookMockMvc
            .perform(get(ENTITY_API_URL_ID, 1L))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.title").value("Test Korean Novel"))
            .andExpect(jsonPath("$.level").value("BEGINNER"));
    }

    @Test
    void testGetBookNotFound() throws Exception {
        // Given
        when(bookService.findOne(999L)).thenReturn(Optional.empty());

        // When & Then
        restBookMockMvc.perform(get(ENTITY_API_URL_ID, 999L)).andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testCreateBook() throws Exception {
        // Given
        BookDTO newBook = new BookDTO();
        newBook.setTitle("New Book");
        newBook.setDescription("A new book for learning");
        newBook.setLevel(Level.INTERMEDIATE);

        when(bookService.save(any(BookDTO.class))).thenReturn(newBook);

        // When & Then
        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newBook)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("New Book"))
            .andExpect(jsonPath("$.level").value("INTERMEDIATE"));
    }

    @Test
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testUpdateBook() throws Exception {
        // Given
        bookDTO.setTitle("Updated Title");
        when(bookService.update(any(BookDTO.class))).thenReturn(bookDTO);

        // When & Then
        restBookMockMvc
            .perform(put(ENTITY_API_URL_ID, 1L).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testPartialUpdateBook() throws Exception {
        // Given
        BookDTO partialBook = new BookDTO();
        partialBook.setId(1L);
        partialBook.setTitle("Partially Updated");

        when(bookService.partialUpdate(any(BookDTO.class))).thenReturn(Optional.of(partialBook));

        // When & Then
        restBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, 1L)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialBook))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Partially Updated"));
    }

    @Test
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testDeleteBook() throws Exception {
        // When & Then
        restBookMockMvc.perform(delete(ENTITY_API_URL_ID, 1L)).andExpect(status().isNoContent());
    }

    @Test
    void testSearchBooks() throws Exception {
        // Given
        List<BookDTO> books = Collections.singletonList(bookDTO);
        Page<BookDTO> page = new PageImpl<>(books);
        when(bookService.searchBooks(anyString(), any(Pageable.class))).thenReturn(page);

        // When & Then
        restBookMockMvc
            .perform(get(ENTITY_API_URL + "/search?keyword=Korean"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].title").value(hasItem(containsString("Korean"))));
    }

    @Test
    void testGetBooksByLevel() throws Exception {
        // Given
        when(bookService.findByLevel("BEGINNER")).thenReturn(Collections.singletonList(bookDTO));

        // When & Then
        restBookMockMvc
            .perform(get(ENTITY_API_URL + "/by-level/{level}", "BEGINNER"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].level").value(hasItem("BEGINNER")));
    }

    @Test
    @WithMockUser(authorities = { "ROLE_USER" })
    void testUnauthorizedCreateBook() throws Exception {
        // Given - User without ADMIN role
        BookDTO newBook = new BookDTO();
        newBook.setTitle("Unauthorized Book");

        // When & Then
        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newBook)))
            .andExpect(status().isForbidden());
    }

    @Test
    void testCreateBookWithInvalidData() throws Exception {
        // Given - Book without required fields
        BookDTO invalidBook = new BookDTO();
        // Missing title, author, etc.

        // When & Then
        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(invalidBook)))
            .andExpect(status().isBadRequest());
    }
}
