# Phân Tích Hệ Thống & Đánh Giá Rủi Ro - Langleague

Với vai trò Senior Developer, đây là báo cáo đánh giá chuyên sâu về hệ thống, tập trung vào các bug tiềm ẩn và sự tương tác giữa Frontend-Backend.

---

## 1. Phân Tích Bug Tiềm Ẩn & Lỗ Hổng Bảo Mật

### 1.1. Lỗ hổng kiểm soát truy cập (IDOR - Insecure Direct Object Reference)

**Vấn đề:**
Đây là một trong những lỗ hổng phổ biến và nghiêm trọng nhất. Kẻ tấn công có thể truy cập hoặc chỉnh sửa dữ liệu của người dùng khác bằng cách thay đổi ID trên URL hoặc trong request body.

**Bug tiềm ẩn:**
- **API:** `GET /api/user-books/{id}`, `GET /api/chapter-progress/{id}`
- **Kịch bản:** Người dùng A (ID: 10) đang xem tiến độ một chương học qua URL `/api/chapter-progress/123`. Nếu người dùng A thay đổi URL thành `/api/chapter-progress/124` (là dữ liệu của người dùng B), liệu hệ thống có trả về dữ liệu của người dùng B không?
- **Phân tích code:** Các controller như `ChapterProgressResource.java` có thể chỉ kiểm tra `isAuthenticated()`. Tuy nhiên, tầng service (`ChapterProgressService.java`) **phải** có thêm một bước nữa: xác thực rằng chapter progress với ID `124` này có thực sự thuộc về người dùng đang đăng nhập hay không. File `OwnershipValidator.java` cho thấy ý tưởng này đã có, nhưng cần đảm bảo nó được áp dụng một cách nghiêm ngặt.

**Trạng thái:** **ĐÃ SỬA (FIXED)**
- **Hành động:** Đã cập nhật `ChapterProgressService.java`:
  - Thêm phương thức `validateOwnership(id)` để kiểm tra quyền sở hữu của `ChapterProgress` dựa trên người dùng đang đăng nhập.
  - Áp dụng phương thức này vào các hàm `update`, `partialUpdate`, `findOne`, và `delete` để chặn các truy cập trái phép.
  - Sửa lại phương thức `findAll(pageable)` để chỉ trả về các bản ghi thuộc về người dùng hiện tại, vá lỗ hổng rò rỉ dữ liệu.

### 1.2. Vấn đề Toàn vẹn Dữ liệu (Data Integrity)

**Vấn đề:**
Dữ liệu mồ côi (orphaned data) hoặc các hành vi xóa/cập nhật không nhất quán có thể gây ra lỗi ứng dụng và làm lãng phí không gian lưu trữ.

**Bug tiềm ẩn:**
- **API:** `DELETE /api/books/{id}`, `DELETE /api/users/:login`
- **Kịch bản:** Khi một `Book` bị xóa, điều gì sẽ xảy ra với các `Chapter`, `BookReview`, `UserBook` liên quan? Nếu không được xử lý đúng cách, việc xóa có thể bị chặn bởi foreign key constraint, hoặc tệ hơn là để lại một loạt các bản ghi "rác" trong database.
- **Phân tích code:** Các annotation `@OneToMany`, `@ManyToMany` trong folder `domain` cần được xem xét kỹ. Chúng có `CascadeType.REMOVE` hoặc `orphanRemoval = true` không? Nếu không, rủi ro là rất cao.

**Đề xuất:**
- **Action:** Định nghĩa một "chính sách xóa" rõ ràng cho từng entity. 
  - **Soft Delete:** Đối với các entity quan trọng như `User`, `Book`, nên cân nhắc sử dụng phương pháp "xóa mềm" (thêm một cột `deleted` hoặc `status`). Dữ liệu không bị xóa vật lý, tránh được các lỗi liên quan đến constraint.
  - **Cascade Deletes:** Đối với các dữ liệu phụ thuộc hoàn toàn (ví dụ `WordExample` phụ thuộc vào `Word`), có thể sử dụng `CascadeType.REMOVE` một cách cẩn thận.

### 1.3. Xử lý lỗi tải file (File Upload Handling)

**Vấn đề:**
Quy trình tải file thường bao gồm 2 bước: lưu file vào storage và lưu metadata vào database. Nếu một trong hai bước thất bại, hệ thống có thể rơi vào trạng thái không nhất quán.

**Bug tiềm ẩn:**
- **API:** `POST /api/book-uploads`
- **Kịch bản:** Người dùng tải lên một file sách. File được lưu thành công vào thư mục `uploads/`, nhưng vì một lý do nào đó (ví dụ: database connection timeout), việc tạo bản ghi `BookUpload` trong database thất bại. Kết quả là chúng ta có một file rác trên server.
- **Phân tích code:** `BookUploadService.java` cần có cơ chế `try-catch-finally` hoặc `@Transactional` để xử lý. Nếu có lỗi xảy ra sau khi file đã được lưu, cần có logic để xóa file đã được tạo ra.

**Đề xuất:**
- **Action:** Áp dụng **Saga Pattern** ở mức độ đơn giản. Gói toàn bộ logic upload vào trong một phương thức được đánh dấu `@Transactional`. Nếu có bất kỳ `RuntimeException` nào xảy ra, transaction sẽ rollback. Trong block `catch`, hãy thêm logic để xóa file vật lý đã được lưu.

---

## 2. Phân Tích Luồng Gọi API (Frontend vs. Backend)

### 2.1. Luồng Tải Danh sách (List-Loading Flow)

**Vấn đề:**
Việc tải toàn bộ danh sách dữ liệu lớn trong một lần gọi API sẽ làm chậm ứng dụng và lãng phí băng thông.

**Phân tích:**
- **FE:** Trong các trang như `BookLibrary.tsx` hoặc `MyCourses.tsx`, code có thể đang gọi một service như `bookService.getAll()` (trong `book.service.ts`).
- **BE:** API tương ứng `GET /api/books` trong `BookResource.java` hỗ trợ đầy đủ các tham số pagination (`page`, `size`, `sort`).
- **Đánh giá:** Rất có thể FE đang không tận dụng tính năng pagination của BE. Nếu `bookService.getAll()` không truyền các tham số `page`, `size`, thì BE sẽ trả về mặc định (ví dụ: 20 bản ghi đầu tiên) hoặc tệ hơn là toàn bộ dữ liệu. Đây là một **bug hiệu năng tiềm ẩn**.

**Đề xuất:**
- **Action:** Triển khai state quản lý pagination (trang hiện tại, kích thước trang) trên Redux hoặc state của component. Sửa lại các hàm service để chấp nhận và truyền tham số pagination tới BE. Tích hợp component phân trang vào UI.

### 2.2. Xử lý State sau khi gọi API

**Vấn đề:**
FE không cập nhật state một cách nhất quán sau các hành động `CREATE`, `UPDATE`, `DELETE`, khiến người dùng phải tự làm mới trang (F5) để thấy thay đổi.

**Phân tích:**
- **FE:** `BookUploadManager.tsx` (của staff) hoặc `MyProfile.tsx` (của user).
- **Kịch bản:** Sau khi Staff duyệt một cuốn sách, hoặc User cập nhật ảnh đại diện của mình, danh sách hoặc thông tin trên UI có tự động cập nhật không?
- **Đánh giá:** Điều này phụ thuộc vào cách reducer (`book.reducer.ts`, `auth.reducer.ts`) được viết. Cách làm tốt nhất là sau khi nhận được response thành công từ API, reducer sẽ tự cập nhật lại state trong store, hoặc component sẽ gọi lại API để lấy dữ liệu mới nhất.

**Đề xuất:**
- **Action:** Thiết lập một quy tắc chung: Sau mỗi lời gọi API `POST`, `PUT`, `DELETE` thành công, hãy dispatch một action khác để fetch lại dữ liệu liên quan hoặc cập nhật trực tiếp state trong Redux store để UI được đồng bộ ngay lập tức.

--- 

## 3. Kết Luận

Dự án Langleague có một nền tảng rất tốt. Tuy nhiên, để đảm bảo sự ổn định, bảo mật và khả năng mở rộng, đội ngũ nên ưu tiên xử lý các vấn đề sau:

1.  **Ưu tiên cao:** Vá lỗ hổng **IDOR**. **(ĐÃ HOÀN THÀNH)**
2.  **Ưu tiên cao:** Triển khai **Pagination** ở Frontend cho tất cả các danh sách để cải thiện hiệu năng.
3.  **Ưu tiên trung bình:** Rà soát lại **chính sách xóa** (soft-delete vs cascade-delete) và cơ chế xử lý lỗi khi **tải file** để đảm bảo toàn vẹn dữ liệu.

Việc khắc phục sớm những vấn đề này sẽ giúp hệ thống trở nên mạnh mẽ và đáng tin cậy hơn trong dài hạn.