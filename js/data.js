/* ==========================================================================
   UniVibe — Multi-Campus Hubs, Anonymous Author & Real Concept Dataset
   ========================================================================== */

(function (global) {
  'use strict';

  const CAMPUSES = [
    {
      id: 'hcmut',
      name: 'ĐH Bách Khoa — ĐHQG TP.HCM',
      shortName: 'HCMUT',
      city: 'TP.HCM',
      color: '#030391',
      secondaryColor: '#1488DB',
      motto: 'Chuẩn nhận diện Lục giác Tổ ong · Xanh #1488DB & Xanh đậm #030391',
      memberCount: 1,
    },
    {
      id: 'ueh',
      name: 'Đại học Kinh tế TP.HCM',
      shortName: 'UEH',
      city: 'TP.HCM',
      color: '#0F766E',
      secondaryColor: '#F59E0B',
      motto: 'Không gian sáng tạo mở dành cho sinh viên UEH',
      memberCount: 0,
    },
    {
      id: 'uah',
      name: 'ĐH Kiến trúc TP.HCM',
      shortName: 'UAH',
      city: 'TP.HCM',
      color: '#B91C1C',
      secondaryColor: '#FDE68A',
      motto: 'Không gian sáng tạo mở dành cho sinh viên Kiến trúc',
      memberCount: 0,
    },
    {
      id: 'fptu',
      name: 'Đại học FPT',
      shortName: 'FPTU',
      city: 'Toàn quốc',
      color: '#EA580C',
      secondaryColor: '#FED7AA',
      motto: 'Không gian sáng tạo mở dành cho sinh viên FPTU',
      memberCount: 0,
    },
    {
      id: 'hcmus',
      name: 'ĐH Khoa học Tự nhiên',
      shortName: 'HCMUS',
      city: 'TP.HCM',
      color: '#2563EB',
      secondaryColor: '#E0F2FE',
      motto: 'Không gian sáng tạo mở dành cho sinh viên Tự nhiên',
      memberCount: 0,
    },
    {
      id: 'hcmussh',
      name: 'ĐH KHXH & Nhân văn',
      shortName: 'USSH',
      city: 'TP.HCM',
      color: '#7C2D12',
      secondaryColor: '#FBCFE8',
      motto: 'Không gian sáng tạo mở dành cho sinh viên Nhân văn',
      memberCount: 0,
    },
  ];

  const CATEGORIES = [
    { id: 'all', label: 'Tất cả vật phẩm' },
    { id: 'tee', label: 'Áo thun' },
    { id: 'mousepad', label: 'Lót chuột (Deskpad)' },
    { id: 'jacket', label: 'Áo khoác' },
    { id: 'tote', label: 'Túi Tote' },
    { id: 'lanyard', label: 'Dây đeo thẻ' },
    { id: 'mascot', label: 'Linh vật Mascot' },
  ];

  const CREATORS = [
    {
      id: 'cr-anonymous',
      name: 'Ẩn danh',
      handle: '@anonymous',
      campusId: 'hcmut',
      faculty: 'Đóng góp ẩn danh · ĐH Bách Khoa TP.HCM',
      verifiedEdu: false,
      avatarBg: '#E2E8F0',
      initials: 'AD',
      bio: 'Các thiết kế vật phẩm được chia sẻ dưới danh nghĩa Ẩn danh theo bộ nhận diện thương hiệu chuẩn của Trường Đại học Bách khoa – ĐHQG TP.HCM (HCMUT) để cộng đồng tự do đánh giá và sử dụng tham khảo.',
      skills: ['Minimalist Merch', 'HCMUT Brand Identity', 'Apparel & Deskpad'],
      badges: ['Ẩn danh', 'Chuẩn HCMUT'],
      contacts: {},
    },
  ];

  const INITIAL_CONCEPTS = [
    {
      id: 'c-hcmut-tee-01',
      title: 'Áo Thun HCMUT — Bản Trắng Tối Giản (Standard White Edition)',
      campusId: 'hcmut',
      campusShort: 'HCMUT',
      category: 'tee',
      designVariant: 'tee-white',
      creatorId: 'cr-anonymous',
      createdAt: '2026-11-15',
      timeframe: 'week',
      featured: true,
      palette: ['#1488DB', '#030391', '#FFFFFF', '#E2E8F0'],
      tags: ['HCMUT', 'Minimalist', 'Cotton 250gsm', 'Logo Chuẩn'],
      story:
        'Tuân thủ tuyệt đối bộ nhận diện thương hiệu HCMUT trên nền trắng chuẩn: logo khối 3 chiều lục giác tổ ong với hai sắc độ xanh #1488DB và #030391 đặt gọn gàng ở ngực trái kèm font chữ Arial Bold. Bổ sung chi tiết tối giản gồm tem dệt 2 màu ở gấu áo trái, viền cổ dệt chỉ xanh bên trong và tọa độ cơ sở Lý Thường Kiệt ở góc dưới.',
      specs:
        'Cotton Combed 100% định lượng 250gsm form Boxy Unisex, cổ bo dày 2.5cm không bai giãn, logo in nổi silicone/thêu vi tính sắc nét, tem dệt 2 màu #1488DB × #030391 ở gấu áo.',
      ratings: {
        creativity: 4.8,
        identity: 5.0,
        practicality: 4.9,
        count: 1,
      },
      comments: [],
    },
    {
      id: 'c-hcmut-pad-01',
      title: 'Lót Chuột Deskpad HCMUT — Bản Đêm Kỹ Thuật (#030391 × #1488DB)',
      campusId: 'hcmut',
      campusShort: 'HCMUT',
      category: 'mousepad',
      designVariant: 'pad-dark',
      creatorId: 'cr-anonymous',
      createdAt: '2026-11-15',
      timeframe: 'week',
      featured: false,
      palette: ['#030391', '#1488DB', '#FFFFFF', '#050C2E'],
      tags: ['Lót chuột', 'Deskpad 900x400', 'Minimalist', 'Viền trắng'],
      story:
        'Thiết kế dành cho góc học tập, làm đồ án và code đêm của sinh viên Bách Khoa. Trên nền xanh đậm #030391, mẫu áp dụng đúng quy chuẩn logo HCMUT phiên bản viền trắng tại góc trên phải, kết hợp họa tiết lưới lục giác tổ ong mảnh bằng màu #1488DB ở cánh phải và dòng chữ tối giản phía góc trái.',
      specs:
        'Kích thước 900 × 400 × 4mm (XL Full Desk), bề mặt vải dệt Jacquard trượt chuột mượt và chống thấm nhẹ, bo viền chỉ chìm màu #1488DB chống tưa mép, đế cao su tự nhiên chống trượt.',
      ratings: {
        creativity: 4.9,
        identity: 5.0,
        practicality: 5.0,
        count: 1,
      },
      comments: [],
    },
    {
      id: 'c-hcmut-tee-02',
      title: 'Áo Thun HCMUT — Bản Xanh Đậm Viền Trắng (#030391 Navy)',
      campusId: 'hcmut',
      campusShort: 'HCMUT',
      category: 'tee',
      designVariant: 'tee-navy',
      creatorId: 'cr-anonymous',
      createdAt: '2026-11-15',
      timeframe: 'month',
      featured: false,
      palette: ['#030391', '#1488DB', '#FFFFFF', '#02026B'],
      tags: ['HCMUT', 'Xanh đậm #030391', 'Logo viền trắng', 'Tối giản'],
      story:
        'Sử dụng trực tiếp sắc độ xanh đậm #030391 làm nền áo chủ đạo, kết hợp logo HCMUT phiên bản có viền trắng theo đúng quy định đặt logo trên nền màu của trường. Đường viền mảnh màu xanh sáng #1488DB ở mép tay áo và mặt lưng in tọa độ 268 Lý Thường Kiệt tạo điểm nhấn kỹ thuật tinh tế.',
      specs:
        'Vải cotton 2 chiều 250gsm nhuộm cầm màu chuẩn #030391, logo trước ngực dùng phiên bản viền trắng sắc nét, đường may kép vai và gấu áo.',
      ratings: {
        creativity: 4.7,
        identity: 5.0,
        practicality: 4.8,
        count: 1,
      },
      comments: [],
    },
    {
      id: 'c-hcmut-pad-02',
      title: 'Lót Chuột Deskpad HCMUT — Bản Sáng Tối Giản (Platinum White)',
      campusId: 'hcmut',
      campusShort: 'HCMUT',
      category: 'mousepad',
      designVariant: 'pad-light',
      creatorId: 'cr-anonymous',
      createdAt: '2026-11-15',
      timeframe: 'month',
      featured: false,
      palette: ['#FFFFFF', '#1488DB', '#030391', '#E2E8F0'],
      tags: ['Lót chuột', 'Deskpad 800x350', 'Tối giản', 'Setup trắng'],
      story:
        'Phiên bản lót chuột sáng dành cho bàn học tối giản với gam trắng xám dịu mắt. Cạnh trái tạo điểm nhấn bằng hai dải màu nhận diện song song (#030391 và #1488DB) cùng logo chuẩn HCMUT trên nền trắng; mép dưới bổ sung vạch chia tỉ lệ kỹ thuật thanh mảnh.',
      specs:
        'Kích thước 800 × 350 × 4mm gọn gàng cho bàn ký túc xá hoặc thư viện, bề mặt microfiber mịn dễ vệ sinh, bo viền chỉ mảnh đồng màu.',
      ratings: {
        creativity: 4.8,
        identity: 4.9,
        practicality: 4.9,
        count: 1,
      },
      comments: [],
    },
  ];

  global.UniVibeData = {
    CAMPUSES,
    CATEGORIES,
    CREATORS,
    INITIAL_CONCEPTS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
