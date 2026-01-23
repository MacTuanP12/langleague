-- =====================================================
-- LANGLEAGUE DATABASE INITIALIZATION SCRIPT (Cleaned for Liquibase)
-- =====================================================

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Authority table (roles)
CREATE TABLE IF NOT EXISTS jhi_authority (
    name VARCHAR(50) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User table
CREATE TABLE IF NOT EXISTS jhi_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(191) UNIQUE,
    image_url TEXT,
    activated BIT NOT NULL DEFAULT 1,
    lang_key VARCHAR(10) DEFAULT 'vi',
    activation_key VARCHAR(20),
    reset_key VARCHAR(20),
    created_by VARCHAR(50) NOT NULL DEFAULT 'system',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_date TIMESTAMP NULL,
    last_modified_by VARCHAR(50),
    last_modified_date TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User-Authority relationship
CREATE TABLE IF NOT EXISTS jhi_user_authority (
    user_id BIGINT NOT NULL,
    authority_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, authority_name),
    FOREIGN KEY (user_id) REFERENCES jhi_user(id) ON DELETE CASCADE,
    FOREIGN KEY (authority_name) REFERENCES jhi_authority(name) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- APPLICATION TABLES
-- =====================================================

-- User Profile
CREATE TABLE IF NOT EXISTS user_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    streak_count INT DEFAULT 0,
    last_learning_date DATETIME(6),
    bio TEXT,
    theme VARCHAR(20) DEFAULT 'SYSTEM',
    user_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES jhi_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Book
CREATE TABLE IF NOT EXISTS book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    is_public BIT NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL,
    teacher_profile_id BIGINT NOT NULL,
    FOREIGN KEY (teacher_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enrollment
CREATE TABLE IF NOT EXISTS enrollment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrolled_at DATETIME(6) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    user_profile_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    UNIQUE KEY uk_enrollment (user_profile_id, book_id),
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unit
CREATE TABLE IF NOT EXISTS unit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    summary TEXT,
    book_id BIGINT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vocabulary
CREATE TABLE IF NOT EXISTS vocabulary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(200) NOT NULL,
    phonetic VARCHAR(200),
    meaning TEXT NOT NULL,
    example TEXT,
    image_url VARCHAR(500),
    order_index INT NOT NULL DEFAULT 0,
    unit_id BIGINT NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES unit(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grammar
CREATE TABLE IF NOT EXISTS grammar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content_markdown TEXT NOT NULL,
    example_usage TEXT,
    order_index INT NOT NULL DEFAULT 0,
    unit_id BIGINT NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES unit(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exercise
CREATE TABLE IF NOT EXISTS exercise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exercise_text TEXT NOT NULL,
    exercise_type VARCHAR(50) NOT NULL,
    correct_answer_raw TEXT,
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    order_index INT NOT NULL DEFAULT 0,
    unit_id BIGINT NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES unit(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exercise Option
CREATE TABLE IF NOT EXISTS exercise_option (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    option_text TEXT NOT NULL,
    is_correct BIT NOT NULL DEFAULT 0,
    order_index INT DEFAULT 0,
    exercise_id BIGINT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercise(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progress
CREATE TABLE IF NOT EXISTS progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    is_completed BIT NOT NULL DEFAULT 0,
    updated_at DATETIME(6) NOT NULL,
    is_bookmarked BIT DEFAULT 0,
    score INT,
    last_accessed_at DATETIME(6),
    completion_percentage INT DEFAULT 0,
    is_vocabulary_finished BIT DEFAULT 0,
    is_grammar_finished BIT DEFAULT 0,
    is_exercise_finished BIT DEFAULT 0,
    user_profile_id BIGINT NOT NULL,
    unit_id BIGINT NOT NULL,
    UNIQUE KEY uk_progress (user_profile_id, unit_id),
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES unit(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note
CREATE TABLE IF NOT EXISTS note (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    user_profile_id BIGINT NOT NULL,
    unit_id BIGINT NOT NULL,
    UNIQUE KEY uk_note (user_profile_id, unit_id),
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES unit(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT AUTHORITIES (ROLES)
-- =====================================================
INSERT INTO jhi_authority (name) VALUES
('ROLE_ADMIN'),
('ROLE_TEACHER'),
('ROLE_STUDENT');

-- =====================================================
-- INSERT USERS
-- Password: 123456 (BCrypt encoded)
-- =====================================================
INSERT INTO jhi_user (id, login, password_hash, first_name, last_name, email, activated, lang_key, created_by) VALUES
-- Admin user
(1, 'admin', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Admin', 'System', 'admin@langleague.com', 1, 'vi', 'system'),
-- Teacher users
(2, 'teacher1', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Nguyen', 'Van A', 'teacher1@langleague.com', 1, 'vi', 'system'),
(3, 'teacher2', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Tran', 'Thi B', 'teacher2@langleague.com', 1, 'vi', 'system'),
-- Student users
(4, 'student1', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Le', 'Van C', 'student1@langleague.com', 1, 'vi', 'system'),
(5, 'student2', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Pham', 'Thi D', 'student2@langleague.com', 1, 'vi', 'system'),
(6, 'student3', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Hoang', 'Van E', 'student3@langleague.com', 1, 'vi', 'system'),
(7, 'student4', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Vu', 'Thi F', 'student4@langleague.com', 1, 'vi', 'system'),
(8, 'student5', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'Dang', 'Van G', 'student5@langleague.com', 1, 'vi', 'system');

-- =====================================================
-- ASSIGN ROLES TO USERS
-- =====================================================
INSERT INTO jhi_user_authority (user_id, authority_name) VALUES
-- Admin has all roles
(1, 'ROLE_ADMIN'),
(1, 'ROLE_TEACHER'),
(1, 'ROLE_STUDENT'),
-- Teachers
(2, 'ROLE_TEACHER'),
(3, 'ROLE_TEACHER'),
-- Students
(4, 'ROLE_STUDENT'),
(5, 'ROLE_STUDENT'),
(6, 'ROLE_STUDENT'),
(7, 'ROLE_STUDENT'),
(8, 'ROLE_STUDENT');

-- =====================================================
-- INSERT USER PROFILES
-- =====================================================
INSERT INTO user_profile (id, streak_count, last_learning_date, bio, theme, user_id) VALUES
(1, 0, NULL, 'System Administrator', 'SYSTEM', 1),
(2, 15, NOW(), 'Giáo viên tiếng Anh với 10 năm kinh nghiệm', 'LIGHT', 2),
(3, 8, NOW(), 'Giáo viên tiếng Anh chuyên IELTS/TOEIC', 'DARK', 3),
(4, 25, NOW(), 'Học sinh đam mê tiếng Anh', 'SYSTEM', 4),
(5, 12, NOW(), 'Đang chuẩn bị thi IELTS', 'LIGHT', 5),
(6, 5, NOW(), 'Học tiếng Anh giao tiếp', 'DARK', 6),
(7, 18, NOW(), 'Yêu thích văn hóa Anh-Mỹ', 'SYSTEM', 7),
(8, 3, NOW(), 'Mới bắt đầu học tiếng Anh', 'LIGHT', 8);

-- =====================================================
-- INSERT BOOKS (by Teachers)
-- =====================================================
INSERT INTO book (id, title, description, cover_image_url, is_public, created_at, teacher_profile_id) VALUES
-- Books by Teacher 1 (user_profile_id = 2)
(1, 'English for Beginners', 'Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu. Bao gồm từ vựng, ngữ pháp và bài tập thực hành.', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400', 1, NOW(), 2),
(2, 'IELTS Speaking Mastery', 'Luyện kỹ năng Speaking IELTS từ band 5.0 đến 7.0+. Các chủ đề phổ biến và mẹo trả lời.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 1, NOW(), 2),
(3, 'Business English Essentials', 'Tiếng Anh thương mại cho dân văn phòng. Email, họp, thuyết trình chuyên nghiệp.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 1, NOW(), 2),
(7, 'Advanced English Vocabulary', 'Mở rộng vốn từ vựng tiếng Anh nâng cao cho các kỳ thi IELTS, TOEFL.', 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400', 1, NOW(), 2),
(8, 'Travel English Guide', 'Hướng dẫn tiếng Anh du lịch toàn diện: đặt phòng, hỏi đường, và giao tiếp tại sân bay.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', 1, NOW(), 2),

-- Books by Teacher 2 (user_profile_id = 3)
(4, 'TOEIC 600+ Preparation', 'Luyện thi TOEIC từ cơ bản đến nâng cao. Đạt 600+ điểm trong 3 tháng.', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', 1, NOW(), 3),
(5, 'English Grammar Complete', 'Ngữ pháp tiếng Anh toàn diện từ A-Z. 12 thì, câu điều kiện, mệnh đề quan hệ...', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 1, NOW(), 3),
(6, 'Daily English Conversations', 'Hội thoại tiếng Anh hàng ngày. 100+ tình huống giao tiếp thực tế.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', 1, NOW(), 3);

-- =====================================================
-- INSERT UNITS
-- =====================================================
INSERT INTO unit (id, title, order_index, summary, book_id) VALUES
-- Units for Book 1: English for Beginners
(1, 'Greetings & Introductions', 0, 'Học cách chào hỏi và giới thiệu bản thân bằng tiếng Anh', 1),
(2, 'Numbers & Counting', 1, 'Số đếm từ 1-1000 và cách sử dụng trong giao tiếp', 1),
(3, 'Family Members', 2, 'Từ vựng về các thành viên trong gia đình', 1),
(4, 'Daily Routines', 3, 'Mô tả các hoạt động hàng ngày', 1),

-- Units for Book 2: IELTS Speaking
(5, 'Part 1: Introduction', 0, 'Cách trả lời câu hỏi giới thiệu trong IELTS Speaking Part 1', 2),
(6, 'Part 2: Cue Card Topics', 1, 'Các chủ đề thường gặp trong Part 2 và cách triển khai ý', 2),
(7, 'Part 3: Discussion', 2, 'Thảo luận chuyên sâu và đưa ra quan điểm cá nhân', 2),

-- Units for Book 3: Business English
(8, 'Email Writing', 0, 'Cách viết email chuyên nghiệp trong môi trường công sở', 3),
(9, 'Meeting Vocabulary', 1, 'Từ vựng và cụm từ dùng trong cuộc họp', 3),
(10, 'Presentation Skills', 2, 'Kỹ năng thuyết trình bằng tiếng Anh', 3),

-- Units for Book 4: TOEIC 600+
(11, 'Listening Part 1-2', 0, 'Chiến thuật làm bài nghe Part 1 và Part 2', 4),
(12, 'Listening Part 3-4', 1, 'Chiến thuật làm bài nghe Part 3 và Part 4', 4),
(13, 'Reading Part 5', 2, 'Ngữ pháp và từ vựng cho Part 5', 4),
(14, 'Reading Part 6-7', 3, 'Đọc hiểu văn bản trong Part 6 và Part 7', 4),

-- Units for Book 5: English Grammar
(15, 'Present Tenses', 0, 'Các thì hiện tại: Simple, Continuous, Perfect', 5),
(16, 'Past Tenses', 1, 'Các thì quá khứ: Simple, Continuous, Perfect', 5),
(17, 'Future Tenses', 2, 'Các cách diễn đạt tương lai', 5),
(18, 'Conditionals', 3, 'Câu điều kiện loại 0, 1, 2, 3', 5),

-- Units for Book 6: Daily Conversations
(19, 'At the Restaurant', 0, 'Gọi món và giao tiếp tại nhà hàng', 6),
(20, 'Shopping', 1, 'Mua sắm và mặc cả', 6),
(21, 'Asking Directions', 2, 'Hỏi đường và chỉ đường', 6),
(22, 'At the Hotel', 3, 'Đặt phòng và các dịch vụ khách sạn', 6),

-- Units for Book 7: Advanced English Vocabulary
(23, 'Academic Words List 1', 0, 'Danh sách từ vựng học thuật nhóm 1 - Định nghĩa và ví dụ.', 7),
(24, 'Phrasal Verbs in Context', 1, 'Cụm động từ thông dụng trong ngữ cảnh thực tế.', 7),

-- Units for Book 8: Travel English Guide
(25, 'At the Airport', 0, 'Từ vựng và mẫu câu khi làm thủ tục tại sân bay.', 8),
(26, 'Hotel Check-in', 1, 'Giao tiếp khi nhận phòng và yêu cầu dịch vụ khách sạn.', 8),
(27, 'Asking for Directions', 2, 'Cách hỏi và chỉ đường khi đi du lịch.', 8);

-- =====================================================
-- INSERT VOCABULARIES
-- =====================================================
INSERT INTO vocabulary (id, word, phonetic, meaning, example, image_url, order_index, unit_id) VALUES
-- Unit 1: Greetings
(1, 'Hello', '/həˈloʊ/', 'Xin chào', 'Hello! How are you today?', NULL, 0, 1),
(2, 'Good morning', '/ɡʊd ˈmɔːrnɪŋ/', 'Chào buổi sáng', 'Good morning, everyone!', NULL, 1, 1),
(3, 'Good afternoon', '/ɡʊd ˌæftərˈnuːn/', 'Chào buổi chiều', 'Good afternoon, Mr. Smith.', NULL, 2, 1),
(4, 'Good evening', '/ɡʊd ˈiːvnɪŋ/', 'Chào buổi tối', 'Good evening, ladies and gentlemen.', NULL, 3, 1),
(5, 'Goodbye', '/ˌɡʊdˈbaɪ/', 'Tạm biệt', 'Goodbye! See you tomorrow.', NULL, 4, 1),
(6, 'Nice to meet you', '/naɪs tuː miːt juː/', 'Rất vui được gặp bạn', 'Nice to meet you. I am John.', NULL, 5, 1),
(7, 'How are you?', '/haʊ ɑːr juː/', 'Bạn khỏe không?', 'How are you doing today?', NULL, 6, 1),
(8, 'Thank you', '/θæŋk juː/', 'Cảm ơn', 'Thank you very much for your help.', NULL, 7, 1),

-- Unit 2: Numbers
(9, 'One', '/wʌn/', 'Một', 'I have one apple.', NULL, 0, 2),
(10, 'Two', '/tuː/', 'Hai', 'There are two cats.', NULL, 1, 2),
(11, 'Three', '/θriː/', 'Ba', 'I need three books.', NULL, 2, 2),
(12, 'Ten', '/ten/', 'Mười', 'She is ten years old.', NULL, 3, 2),
(13, 'Hundred', '/ˈhʌndrəd/', 'Trăm', 'One hundred students passed.', NULL, 4, 2),
(14, 'Thousand', '/ˈθaʊznd/', 'Nghìn', 'It costs two thousand dollars.', NULL, 5, 2),

-- Unit 3: Family
(15, 'Father', '/ˈfɑːðər/', 'Bố, cha', 'My father is a doctor.', NULL, 0, 3),
(16, 'Mother', '/ˈmʌðər/', 'Mẹ', 'My mother cooks delicious food.', NULL, 1, 3),
(17, 'Brother', '/ˈbrʌðər/', 'Anh/em trai', 'I have two brothers.', NULL, 2, 3),
(18, 'Sister', '/ˈsɪstər/', 'Chị/em gái', 'My sister is a teacher.', NULL, 3, 3),
(19, 'Grandparent', '/ˈɡrænpeərənt/', 'Ông bà', 'My grandparents live in the countryside.', NULL, 4, 3),

-- Unit 8: Email Writing (Business English)
(20, 'Dear', '/dɪr/', 'Kính gửi, Thân gửi', 'Dear Mr. Johnson,', NULL, 0, 8),
(21, 'Sincerely', '/sɪnˈsɪrli/', 'Trân trọng', 'Sincerely yours, John Smith', NULL, 1, 8),
(22, 'Attachment', '/əˈtætʃmənt/', 'Tệp đính kèm', 'Please find the attachment below.', NULL, 2, 8),
(23, 'Regarding', '/rɪˈɡɑːrdɪŋ/', 'Về việc, liên quan đến', 'Regarding your inquiry about the product...', NULL, 3, 8),
(24, 'Deadline', '/ˈdedlaɪn/', 'Hạn chót', 'The deadline for submission is Friday.', NULL, 4, 8),

-- Unit 15: Present Tenses (Grammar)
(25, 'Always', '/ˈɔːlweɪz/', 'Luôn luôn', 'She always arrives on time.', NULL, 0, 15),
(26, 'Usually', '/ˈjuːʒuəli/', 'Thường xuyên', 'I usually have breakfast at 7 AM.', NULL, 1, 15),
(27, 'Sometimes', '/ˈsʌmtaɪmz/', 'Thỉnh thoảng', 'Sometimes I go jogging in the morning.', NULL, 2, 15),
(28, 'Currently', '/ˈkɜːrəntli/', 'Hiện tại', 'I am currently working on a new project.', NULL, 3, 15),

-- Unit 19: At the Restaurant
(29, 'Menu', '/ˈmenjuː/', 'Thực đơn', 'Can I see the menu, please?', NULL, 0, 19),
(30, 'Order', '/ˈɔːrdər/', 'Gọi món, đặt hàng', 'Are you ready to order?', NULL, 1, 19),
(31, 'Bill', '/bɪl/', 'Hóa đơn', 'Can I have the bill, please?', NULL, 2, 19),
(32, 'Tip', '/tɪp/', 'Tiền boa', 'The service was great, I left a big tip.', NULL, 3, 19),
(33, 'Reservation', '/ˌrezərˈveɪʃn/', 'Đặt chỗ trước', 'I have a reservation for two at 7 PM.', NULL, 4, 19);

-- =====================================================
-- INSERT GRAMMARS
-- =====================================================
INSERT INTO grammar (id, title, content_markdown, example_usage, order_index, unit_id) VALUES
-- Unit 1: Greetings
(1, 'Basic Sentence Structure', '# Cấu trúc câu cơ bản\n\n## Subject + Verb + Object\n\nTrong tiếng Anh, câu cơ bản thường theo cấu trúc:\n- **Subject (Chủ ngữ)**: Người/vật thực hiện hành động\n- **Verb (Động từ)**: Hành động\n- **Object (Tân ngữ)**: Người/vật nhận hành động\n\n### Ví dụ:\n- I (S) + am (V) + happy (Adj)\n- She (S) + speaks (V) + English (O)', 'I am a student.\nShe speaks English fluently.\nThey love Vietnamese food.', 0, 1),

-- Unit 15: Present Tenses
(2, 'Present Simple Tense', '# Thì Hiện Tại Đơn\n\n## Công thức:\n- **Khẳng định**: S + V(s/es)\n- **Phủ định**: S + do/does + not + V\n- **Nghi vấn**: Do/Does + S + V?\n\n## Cách dùng:\n1. Diễn tả thói quen, sự việc lặp đi lặp lại\n2. Sự thật hiển nhiên, chân lý\n3. Lịch trình, thời gian biểu cố định\n\n## Dấu hiệu nhận biết:\nalways, usually, often, sometimes, rarely, never, every day/week/month...', 'I go to school every day.\nThe sun rises in the east.\nThe train leaves at 8 AM.', 0, 15),

(3, 'Present Continuous Tense', '# Thì Hiện Tại Tiếp Diễn\n\n## Công thức:\n- **Khẳng định**: S + am/is/are + V-ing\n- **Phủ định**: S + am/is/are + not + V-ing\n- **Nghi vấn**: Am/Is/Are + S + V-ing?\n\n## Cách dùng:\n1. Hành động đang xảy ra tại thời điểm nói\n2. Hành động tạm thời\n3. Kế hoạch đã được sắp xếp trong tương lai gần\n\n## Dấu hiệu nhận biết:\nnow, at the moment, at present, currently, Look!, Listen!', 'I am studying English now.\nShe is working from home this week.\nWe are meeting the client tomorrow.', 1, 15),

(4, 'Present Perfect Tense', '# Thì Hiện Tại Hoàn Thành\n\n## Công thức:\n- **Khẳng định**: S + have/has + V3/ed\n- **Phủ định**: S + have/has + not + V3/ed\n- **Nghi vấn**: Have/Has + S + V3/ed?\n\n## Cách dùng:\n1. Hành động đã xảy ra trong quá khứ, không rõ thời gian\n2. Hành động bắt đầu trong quá khứ, kéo dài đến hiện tại\n3. Kinh nghiệm, trải nghiệm\n\n## Dấu hiệu nhận biết:\njust, already, yet, ever, never, recently, since, for', 'I have lived here for 5 years.\nShe has just finished her homework.\nHave you ever been to Japan?', 2, 15),

-- Unit 16: Past Tenses
(5, 'Past Simple Tense', '# Thì Quá Khứ Đơn\n\n## Công thức:\n- **Khẳng định**: S + V2/ed\n- **Phủ định**: S + did not + V\n- **Nghi vấn**: Did + S + V?\n\n## Cách dùng:\n1. Hành động đã xảy ra và kết thúc trong quá khứ\n2. Chuỗi hành động trong quá khứ\n3. Thói quen trong quá khứ (không còn nữa)\n\n## Dấu hiệu nhận biết:\nyesterday, last week/month/year, ago, in 2020, when I was young...', 'I visited my grandmother yesterday.\nShe graduated from university in 2019.\nWhen I was young, I played football every day.', 0, 16),

-- Unit 18: Conditionals
(6, 'Conditional Type 0 & 1', '# Câu Điều Kiện Loại 0 và 1\n\n## Loại 0 (Zero Conditional)\n**Công thức**: If + S + V(s/es), S + V(s/es)\n**Dùng khi**: Sự thật hiển nhiên, quy luật tự nhiên\n\n## Loại 1 (First Conditional)\n**Công thức**: If + S + V(s/es), S + will + V\n**Dùng khi**: Điều kiện có thể xảy ra ở hiện tại/tương lai', 'Type 0: If you heat water, it boils.\nType 1: If it rains tomorrow, I will stay home.', 0, 18),

(7, 'Conditional Type 2 & 3', '# Câu Điều Kiện Loại 2 và 3\n\n## Loại 2 (Second Conditional)\n**Công thức**: If + S + V2/ed, S + would + V\n**Dùng khi**: Điều kiện không có thật ở hiện tại, giả định\n\n## Loại 3 (Third Conditional)\n**Công thức**: If + S + had + V3/ed, S + would have + V3/ed\n**Dùng khi**: Điều kiện không có thật trong quá khứ', 'Type 2: If I were rich, I would travel the world.\nType 3: If I had studied harder, I would have passed the exam.', 1, 18);

-- =====================================================
-- INSERT EXERCISES
-- =====================================================
INSERT INTO exercise (id, exercise_text, exercise_type, correct_answer_raw, audio_url, image_url, order_index, unit_id) VALUES
-- Unit 1: Greetings
(1, 'Choose the correct greeting for morning:', 'SINGLE_CHOICE', NULL, NULL, NULL, 0, 1),
(2, 'How do you say "Tạm biệt" in English?', 'SINGLE_CHOICE', NULL, NULL, NULL, 1, 1),
(3, 'Fill in the blank: "Nice to ____ you!"', 'FILL_IN_BLANK', 'meet', NULL, NULL, 2, 1),

-- Unit 2: Numbers
(4, 'What is "một trăm" in English?', 'SINGLE_CHOICE', NULL, NULL, NULL, 0, 2),
(5, 'Fill in the blank: "I have ____ (2) brothers."', 'FILL_IN_BLANK', 'two', NULL, NULL, 1, 2),

-- Unit 15: Present Tenses
(6, 'Choose the correct form: "She ____ to school every day."', 'SINGLE_CHOICE', NULL, NULL, NULL, 0, 15),
(7, 'Which sentence is Present Continuous?', 'SINGLE_CHOICE', NULL, NULL, NULL, 1, 15),
(8, 'Select all sentences using Present Perfect correctly:', 'MULTI_CHOICE', NULL, NULL, NULL, 2, 15),
(9, 'Fill in the blank: "I ____ (study) English for 5 years."', 'FILL_IN_BLANK', 'have studied', NULL, NULL, 3, 15),

-- Unit 18: Conditionals
(10, 'Complete the Type 1 conditional: "If it rains, I ____ (stay) home."', 'FILL_IN_BLANK', 'will stay', NULL, NULL, 0, 18),
(11, 'Which conditional type expresses an unreal situation in the present?', 'SINGLE_CHOICE', NULL, NULL, NULL, 1, 18),

-- Unit 19: Restaurant
(12, 'How do you ask for the bill at a restaurant?', 'SINGLE_CHOICE', NULL, NULL, NULL, 0, 19),
(13, 'Fill in: "I have a ____ for two at 7 PM."', 'FILL_IN_BLANK', 'reservation', NULL, NULL, 1, 19);

-- =====================================================
-- INSERT EXERCISE OPTIONS
-- =====================================================
INSERT INTO exercise_option (id, option_text, is_correct, order_index, exercise_id) VALUES
-- Exercise 1: Morning greeting
(1, 'Good morning', 1, 0, 1),
(2, 'Good evening', 0, 1, 1),
(3, 'Good night', 0, 2, 1),
(4, 'Good afternoon', 0, 3, 1),

-- Exercise 2: Goodbye
(5, 'Hello', 0, 0, 2),
(6, 'Goodbye', 1, 1, 2),
(7, 'Thank you', 0, 2, 2),
(8, 'Sorry', 0, 3, 2),

-- Exercise 4: One hundred
(9, 'One thousand', 0, 0, 4),
(10, 'One hundred', 1, 1, 4),
(11, 'Ten', 0, 2, 4),
(12, 'One million', 0, 3, 4),

-- Exercise 6: Present Simple
(13, 'go', 0, 0, 6),
(14, 'goes', 1, 1, 6),
(15, 'going', 0, 2, 6),
(16, 'is going', 0, 3, 6),

-- Exercise 7: Present Continuous
(17, 'I go to school every day.', 0, 0, 7),
(18, 'She is reading a book now.', 1, 1, 7),
(19, 'They have finished their work.', 0, 2, 7),
(20, 'He went to the cinema yesterday.', 0, 3, 7),

-- Exercise 8: Present Perfect (Multi-choice)
(21, 'I have visited Paris twice.', 1, 0, 8),
(22, 'She has just arrived.', 1, 1, 8),
(23, 'They went to Japan last year.', 0, 2, 8),
(24, 'We have known each other for 10 years.', 1, 3, 8),

-- Exercise 11: Conditional Type 2
(25, 'Type 0', 0, 0, 11),
(26, 'Type 1', 0, 1, 11),
(27, 'Type 2', 1, 2, 11),
(28, 'Type 3', 0, 3, 11),

-- Exercise 12: Ask for bill
(29, 'Can I see the menu?', 0, 0, 12),
(30, 'Can I have the bill, please?', 1, 1, 12),
(31, 'I have a reservation.', 0, 2, 12),
(32, 'Is this table free?', 0, 3, 12);

-- =====================================================
-- INSERT ENROLLMENTS (Students enrolled in Books)
-- =====================================================
INSERT INTO enrollment (id, enrolled_at, status, user_profile_id, book_id) VALUES
-- Student 1 (user_profile_id = 4) enrolled in 3 books
(1, DATE_SUB(NOW(), INTERVAL 30 DAY), 'ACTIVE', 4, 1),
(2, DATE_SUB(NOW(), INTERVAL 20 DAY), 'ACTIVE', 4, 2),
(3, DATE_SUB(NOW(), INTERVAL 10 DAY), 'ACTIVE', 4, 5),

-- Student 2 (user_profile_id = 5) enrolled in 2 books
(4, DATE_SUB(NOW(), INTERVAL 25 DAY), 'ACTIVE', 5, 2),
(5, DATE_SUB(NOW(), INTERVAL 15 DAY), 'ACTIVE', 5, 4),

-- Student 3 (user_profile_id = 6) enrolled in 2 books
(6, DATE_SUB(NOW(), INTERVAL 20 DAY), 'ACTIVE', 6, 1),
(7, DATE_SUB(NOW(), INTERVAL 5 DAY), 'ACTIVE', 6, 6),

-- Student 4 (user_profile_id = 7) enrolled in 3 books
(8, DATE_SUB(NOW(), INTERVAL 45 DAY), 'COMPLETED', 7, 1),
(9, DATE_SUB(NOW(), INTERVAL 30 DAY), 'ACTIVE', 7, 3),
(10, DATE_SUB(NOW(), INTERVAL 15 DAY), 'ACTIVE', 7, 5),

-- Student 5 (user_profile_id = 8) enrolled in 1 book
(11, DATE_SUB(NOW(), INTERVAL 7 DAY), 'ACTIVE', 8, 1);

-- =====================================================
-- INSERT PROGRESS (Learning progress)
-- =====================================================
INSERT INTO progress (id, is_completed, updated_at, is_bookmarked, score, last_accessed_at, completion_percentage, is_vocabulary_finished, is_grammar_finished, is_exercise_finished, user_profile_id, unit_id) VALUES
-- Student 1 progress on Book 1 units
(1, 1, NOW(), 0, 95, NOW(), 100, 1, 1, 1, 4, 1),
(2, 1, NOW(), 1, 88, NOW(), 100, 1, 1, 1, 4, 2),
(3, 0, NOW(), 0, 60, NOW(), 66, 1, 1, 0, 4, 3),
(4, 0, NOW(), 0, NULL, NOW(), 33, 1, 0, 0, 4, 4),

-- Student 1 progress on Book 2 units
(5, 1, NOW(), 1, 92, NOW(), 100, 1, 1, 1, 4, 5),
(6, 0, NOW(), 0, 75, NOW(), 66, 1, 0, 1, 4, 6),

-- Student 2 progress on IELTS book
(7, 1, NOW(), 0, 85, NOW(), 100, 1, 1, 1, 5, 5),
(8, 1, NOW(), 1, 90, NOW(), 100, 1, 1, 1, 5, 6),
(9, 0, NOW(), 0, 70, NOW(), 66, 1, 1, 0, 5, 7),

-- Student 3 progress
(10, 1, NOW(), 0, 100, NOW(), 100, 1, 1, 1, 6, 1),
(11, 0, NOW(), 0, NULL, NOW(), 33, 1, 0, 0, 6, 2),

-- Student 4 progress (completed Book 1)
(12, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), 0, 92, DATE_SUB(NOW(), INTERVAL 15 DAY), 100, 1, 1, 1, 7, 1),
(13, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), 0, 88, DATE_SUB(NOW(), INTERVAL 15 DAY), 100, 1, 1, 1, 7, 2),
(14, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), 0, 95, DATE_SUB(NOW(), INTERVAL 15 DAY), 100, 1, 1, 1, 7, 3),
(15, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), 0, 90, DATE_SUB(NOW(), INTERVAL 15 DAY), 100, 1, 1, 1, 7, 4);

-- =====================================================
-- INSERT NOTES (Student notes on units)
-- =====================================================
INSERT INTO note (id, content, created_at, updated_at, user_profile_id, unit_id) VALUES
(1, 'Cần nhớ phân biệt Good morning/afternoon/evening theo thời gian trong ngày. Morning: 0h-12h, Afternoon: 12h-18h, Evening: 18h-24h.', NOW(), NULL, 4, 1),
(2, 'Số đếm tiếng Anh: chú ý cách phát âm th trong three, thirteen, thirty. Luyện tập nhiều để không nhầm lẫn.', NOW(), NULL, 4, 2),
(3, 'Present Perfect dùng với since + mốc thời gian, for + khoảng thời gian. VD: since 2020, for 5 years.', NOW(), NULL, 5, 6),
(4, 'Câu điều kiện loại 2: dùng were cho tất cả các ngôi (If I were, If he were...) chứ không dùng was.', NOW(), NULL, 7, 18);
