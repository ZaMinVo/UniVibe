# UniVibe

> **UniVibe** là phòng trưng bày số (*Showcase-Only*) giới thiệu các ý tưởng vật phẩm mang đậm bản sắc sinh viên đại học — thiết kế theo phong cách tối giản **Editorial Gallery ("GALERIE" / `uupm.cc/demo/nft-art-gallery`)** kết hợp khung viền mảnh thủ công và mockup sản phẩm studio thực tế.

---

## 1. Định vị & Phiên bản hiện tại (Showcase & Selection Lab)

Trang web kết hợp **Phòng trưng bày tuyển chọn** và **Phòng chọn lọc & đánh giá thiết kế cục bộ (`localStorage`)**:

- **Bộ sưu tập 6 concept / 12 góc nhìn studio (`1400×1050`):**
  1. **Monolith 500 — Bình Giữ Nhiệt Inox** (`c-hcmut-bottle-01`, 2 góc nhìn).
  2. **Datum Grid 900 — Lót Chuột Deskpad** (`c-hcmut-pad-01`, 2 góc nhìn).
  3. **Móc Khóa Ngành Khoa Học Máy Tính (HCMUT · CSE) — 4 Phiên Bản Đánh Giá (`V1–V4`):**
     - **V1 · Circuit 24K (`c-hcmut-cs-keychain-v1`):** Bo mạch FR-4 2.4mm đen lì, mạch đồng mạ vàng 24K ENIG, chip QFN-16 `BK-CS`, linh kiện SMD 0603, chân cắm vàng cạnh hông & khoen đồng mạ vàng.
     - **V2 · Lambda 6061 (`c-hcmut-cs-keychain-v2`):** Thẻ nhôm nguyên khối AL-6061 vát mép kim cương 45°, rãnh dây lót vòng `#1488DB`, khắc laser `HCMUT · CSE // COMPUTER SCIENCE · λ → O(log n)` kèm thước đo mm & móc khóa carabiner thép phay.
     - **V3 · Tactile 0xBK (`c-hcmut-cs-keychain-v3`):** Hộp switch CNC than chì `#23262C`, housing polycarbonate mờ, trục switch tactile `#1488DB` và keycap PBT gốm nhám in `CS`, `0xBK`, huy hiệu `BK` & cạnh trước `HCMUT // CSE`.
     - **V4 · Hexa Prism (`c-hcmut-cs-keychain-v4`):** Khối lục giác PMMA vát cạnh 8.2mm chiết suất quang học, lõi thép phay tráng men `BK · CSE · KHMT · 1957` treo nổi chính giữa và khoen xoay thép 304.
- **Ưu tiên Không gian ĐHQG-HCM:** Khu vực chuyển đổi trường học ưu tiên hiển thị 6 trường thành viên ĐHQG-HCM (HCMUT, UIT, HCMUS, USSH, HCMIU, UEL) với logo chính thức, cùng tùy chọn xem toàn bộ 9 trường đối tác.
- **Ghi nhận tác giả (*Attribution*):** Toàn bộ 6 tác phẩm được xuất bản công khai dưới danh nghĩa **by Ẩn danh** kèm trích dẫn **Nguồn: HCMUT** hoặc **HCMUT · CSE**, không chứa dữ liệu mẫu chính thức *by HCMUT*.
- **Không xử lý thanh toán:** Nền tảng giữ vai trò trưng bày, chuẩn hóa nhận diện và thu thập chọn lọc/đánh giá phiên bản.

---

## 2. Trải nghiệm Trưng bày, Chọn lọc & Đánh giá

1. **Không gian Trường (*Multi-Campus Hubs*):** Chuyển đổi nhanh giữa góc nhìn **Khám phá Chung liên trường** và không gian nhận diện riêng của từng trường đại học.
2. **Phòng Tuyển Chọn Móc Khóa KHMT (`#cs-keychain-lab`):** Đặt 4 phiên bản `V1–V4` cạnh nhau kèm bảng ma trận so sánh thông số (chất liệu, kích thước, ước tính chi phí, ưu/nhược điểm), nút **Chọn lọc**, chốt **Phương án #1**, bộ lọc (`Tất cả` / `Đã chọn lọc` / `Đã chấm điểm`) và xuất báo cáo văn bản nhanh vào clipboard.
3. **Chấm Điểm 3 Tiêu Chí & Ghi Chú Trong Modal:** Bên cạnh 2 góc nhìn studio độ phân giải cao, mỗi sản phẩm cho phép chấm 1–5 sao theo 3 tiêu chí (*Thẩm mỹ & Hoàn thiện*, *Tính nhận diện*, *Tính ứng dụng & Độ bền*) và lưu ghi chú phản biện cá nhân vào trình duyệt (`localStorage`).
4. **Phòng Trưng Bày có Lọc & Sắp Xếp:** Lọc theo danh mục (*Tất cả*, *Móc Khóa*, *Bình Giữ Nhiệt*, *Lót Chuột*), lọc riêng *Đã chọn lọc*, tìm kiếm từ khóa/mã HEX và sắp xếp theo đề xuất, mới cập nhật, điểm đánh giá cao nhất hoặc ưu tiên mẫu đã chọn.
5. **Lưu mẫu yêu thích (*Bookmarks*):** Lưu lại các mẫu ưng ý vào ngăn *Personal Archive*.

---

## 3. Feature Work (Định hướng mở rộng)

Các hạng mục máy chủ cộng đồng nhiều người dùng được tách thành **Feature Work**:

1. **Cổng đăng tải cộng đồng (*User Concept Submission*):**
   - Cho phép sinh viên tự đăng tải concept vật phẩm mới, chọn hệ màu trường và chế độ Ẩn danh hoặc định danh.
2. **Tổng hợp bình chọn & Đồng bộ Cloud (*Live Community Polling*):**
   - Gom kết quả chọn lọc & chấm điểm 3 tiêu chí từ nhiều sinh viên (thay cho lưu cục bộ trên trình duyệt hiện tại).
3. **Kết nối CLB / Đoàn-Hội (*Leaderboards & Production Bridge*):**
   - Xác thực email `.edu.vn`, xếp hạng tác phẩm đạt điểm cao và kết nối CLB đưa phiên bản được chọn lọc (`#1`) vào sản xuất thực tế.

---

## 4. Hiện thực Giao diện & Triển khai GitHub Pages

- **Phong cách Giao diện:** Bố cục phòng tranh tinh giản theo [uupm.cc/demo/nft-art-gallery](https://uupm.cc/demo/nft-art-gallery) (nền `#FAFAFA`, bảng màu mực `#1A1A1A` / `#666666`, hệ chữ **Playfair Display** + **Inter**, đường viền mảnh `1px` `#E5E5E5`, tác phẩm studio thực tế hiển thị trọn vẹn).
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
