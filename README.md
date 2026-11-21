# UniVibe

> **UniVibe** là phòng trưng bày số (*Showcase-Only*) giới thiệu các ý tưởng vật phẩm mang đậm bản sắc sinh viên đại học — thiết kế theo phong cách tối giản **Editorial Gallery ("GALERIE" / `uupm.cc/demo/nft-art-gallery`)** kết hợp khung viền mảnh thủ công và mockup sản phẩm studio thực tế.

---

## 1. Định vị & Phiên bản hiện tại (Pure Showcase Gallery — Chỉ trưng bày)

Trang web hiện tại hoạt động hoàn toàn ở chế độ **trưng bày tĩnh (*Showcase-Only*)**:

- **Bộ sưu tập 3 concept / 6 góc nhìn studio (`1400×1050`):**
  1. **Monolith 500 — Bình Giữ Nhiệt Inox** (`c-hcmut-bottle-01`, 2 góc nhìn).
  2. **Datum Grid 900 — Lót Chuột Deskpad** (`c-hcmut-pad-01`, 2 góc nhìn).
  3. **Die Shot 2026 — Móc Khóa Chip Bán Dẫn** (`c-hcmut-cs-keychain-v5`, 2 góc nhìn): Khối chip bán dẫn QFN-48 36×36mm vát 45° đen xước khắc laser biểu tượng 3 khối lập phương `BK TP.HCM` & mã `BKCS2026`, mặt sau đóng khung 48 chân đồng mạ vàng 24K bao quanh cửa sổ kính sapphire hiển thị vi mạch quang học *VLSI silicon die-shot* với 3 cuộn cảm xoắn ốc RF.
- **Ưu tiên Không gian ĐHQG-HCM:** Khu vực chuyển đổi trường học ưu tiên hiển thị 6 trường thành viên ĐHQG-HCM (HCMUT, UIT, HCMUS, USSH, HCMIU, UEL) với logo chính thức, cùng tùy chọn xem toàn bộ 9 trường đối tác.
- **Ghi nhận tác giả (*Attribution*):** Toàn bộ 3 tác phẩm được xuất bản công khai dưới danh nghĩa **by Ẩn danh** kèm trích dẫn **Nguồn: HCMUT** hoặc **HCMUT · CSE**, không chứa dữ liệu mẫu chính thức *by HCMUT*.
- **Chỉ trưng bày:** Nền tảng không xử lý thanh toán hay tương tác người dùng; giữ vai trò trưng bày, truyền cảm hứng thiết kế và chuẩn hóa nhận diện.

---

## 2. Trải nghiệm Trưng bày hiện có

1. **Không gian Trường (*Multi-Campus Hubs*):** Chuyển đổi nhanh giữa góc nhìn **Khám phá Chung liên trường** và không gian nhận diện riêng của từng trường đại học.
2. **Phòng Trưng Bày có Lọc & Tìm Kiếm:** Lọc theo danh mục (*Tất cả*, *Móc Khóa*, *Bình Giữ Nhiệt*, *Lót Chuột*), tìm kiếm từ khóa/mã HEX và sắp xếp theo đề xuất, thời gian, loại vật phẩm hoặc tên tác phẩm.
3. **Chi tiết Tác phẩm Studio 2 Góc Nhìn Đồng Bộ:** Mỗi tác phẩm gồm 2 góc nhìn chất lượng cao cùng câu chuyện thiết kế chi tiết, bảng mã màu HEX sao chép nhanh và thông số chất liệu dự kiến.
4. **Lưu mẫu yêu thích (*Bookmarks*):** Lưu lại các mẫu ưng ý vào ngăn *Personal Archive* trên trình duyệt (`localStorage`).

---

## 3. Hiện thực Giao diện & Triển khai GitHub Pages

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
