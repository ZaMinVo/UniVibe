# UniVibe

> **UniVibe** là phòng trưng bày số (*Showcase-Only*) giới thiệu các ý tưởng vật phẩm mang đậm bản sắc sinh viên đại học — kết hợp giao diện web phong cách **Hand-Drawn Sketchbook** với các mockup sản phẩm thực tế tối giản.

---

## 1. Định vị & Phiên bản hiện tại (Pure Showcase Gallery — Chỉ trưng bày)

Trang web hiện tại hoạt động hoàn toàn ở chế độ **trưng bày tĩnh (*Showcase-Only*)**:

- **Không gian trưng bày tinh gọn:** Giới thiệu **6 concept** vật phẩm thực tế tối giản (**Túi Tote Canvas, Nón lưỡi trai, Áo thun & Lót chuột Deskpad**) đồng bộ theo hệ thống Wordmark hình học & ấn phẩm thương hiệu mới của **Trường ĐH Bách Khoa — ĐHQG-HCM (HCMUT)** (`#030391`, `#1488DB`, `#FFFFFF`, nét sọc dọc bậc thang & tam giác xanh, ghi rõ **Nguồn: HCMUT**).
- **Ưu tiên Không gian ĐHQG-HCM:** Khu vực chuyển đổi trường học ưu tiên hiển thị 6 trường thành viên ĐHQG-HCM (HCMUT, UIT, HCMUS, USSH, HCMIU, UEL) với logo chính thức, cùng tùy chọn xem toàn bộ 9 trường đối tác.
- **Đăng tải ẩn danh (*Ẩn danh*):** Toàn bộ mẫu trưng bày hiện tại được xuất bản công khai dưới danh nghĩa **Ẩn danh** kèm trích dẫn **Nguồn: HCMUT** để sinh viên và các CLB tự do tham khảo, không chứa dữ liệu demo cũ.
- **Không ôm đồm thương mại điện tử:** Nền tảng không xử lý thanh toán hay nhận đặt hàng trực tiếp, giữ trọn vai trò truyền cảm hứng thiết kế và chuẩn hóa nhận diện.

---

## 2. Trải nghiệm Trưng bày hiện có

1. **Không gian Trường (*Multi-Campus Hubs*):** Chuyển đổi nhanh giữa góc nhìn **Khám phá Chung liên trường** và không gian nhận diện riêng của từng trường đại học.
2. **Phòng Trưng Bày có Lọc & Tìm kiếm:** Lọc theo loại vật phẩm (*Túi Tote*, *Nón (Baseball Cap)*, *Áo thun*, *Lót chuột*, *Áo khoác*, *Dây đeo thẻ*, *Mascot*), tìm kiếm theo từ khóa/tag/nguồn và sắp xếp theo thứ tự trưng bày, thời gian hoặc tên mẫu.
3. **Chi tiết Tác phẩm 3 Góc nhìn Studio:**
   - **Mockup Mặt Trước**
   - **Mặt Sau & Chi Tiết**
   - **Thông Số Nhận Diện**
4. **Bảng mã màu & Chất liệu:** Xem *Câu chuyện bản sắc (The Vibe Story)*, sao chép nhanh mã màu HEX chuẩn nhận diện và tham khảo thông số chất liệu dự kiến.
5. **Lưu mẫu yêu thích (*Bookmarks*):** Lưu lại các mẫu ưng ý vào bộ sưu tập cá nhân trên trình duyệt (`localStorage`).

---

## 3. Feature Work (Định hướng phát triển tính năng cho người dùng)

Các tính năng tương tác cộng đồng và cho phép người dùng tự đóng góp thiết kế được tách thành lộ trình **Feature Work**:

1. **Cho phép người dùng thêm thiết kế (*User Concept Submission*):**
   - Mở cổng để sinh viên tự đăng tải concept vật phẩm mới, chọn không gian trường, tùy chỉnh bảng màu 4 mã HEX, gắn ảnh mockup và lựa chọn đăng **Ẩn danh** hoặc định danh cá nhân.
2. **Công cụ tạo Prompt Mockup Studio (*AI Mockup Studio*):**
   - Tự động sinh công thức prompt chụp sản phẩm thực tế trong studio khớp với màu sắc, chất liệu và logo nhận diện của từng trường đại học.
3. **Bình chọn đa tiêu chí & Phản biện (*3-Criteria Rating & Critique*):**
   - Đánh giá 1–5 sao theo 3 tiêu chí (*Độ sáng tạo & Thẩm mỹ*, *Bản sắc trường*, *Tính ứng dụng thực tế*) kèm bình luận góp ý tinh chỉnh chi tiết.
4. **Bảng xếp hạng Định kỳ & Hồ sơ Tác giả (*Leaderboards & Creator Bridge*):**
   - Vinh danh Top Thiết kế / Tác giả theo Tuần/Tháng/Năm, xác thực email `.edu.vn`, xuất thẻ chia sẻ *Vibe Card* và cầu nối giúp CLB/Đoàn-Hội liên hệ tác giả hợp tác sản xuất.

---

## 4. Hiện thực Giao diện & Triển khai GitHub Pages

- **Phong cách Giao diện:** Web UI giữ nguyên chất **Hand-Drawn Sketchbook**, trong khi phần tác phẩm trưng bày sử dụng SVG **Realistic Studio Product Mockups** trên nền studio sáng sạch (`#F4F6F9`).
- **Kiến trúc Static Zero-Build:** Chạy thuần bằng HTML5, Tailwind CSS CDN, CSS tùy biến ([css/styles.css](css/styles.css)) và Vanilla JavaScript ([js/illustrations.js](js/illustrations.js), [js/data.js](js/data.js), [js/app.js](js/app.js)).
- **Chạy thử tại máy (Local):**
  ```bash
  python3 -m http.server 8123
  # Mở http://localhost:8123
  ```
- **Deploy tự động lên GitHub Pages:**
  1. Đẩy mã nguồn lên nhánh `main` của repository (`https://github.com/ZaMinVo/UniVibe`).
  2. Trên GitHub, vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.
  3. Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) sẽ tự động build và xuất bản trang web lên GitHub Pages (`https://zaminvo.github.io/UniVibe/`).
