# User Stories & Acceptance Criteria

> Tham chiếu: Agile Alliance. Mỗi User Story phải đạt tiêu chí **INVEST**: Independent, Negotiable, Valuable, Estimable, Small, Testable. Acceptance Criteria viết dạng Gherkin (Given/When/Then) để dễ chuyển thành test case.

## Format chuẩn

```
US-XXX: [Tên ngắn gọn]

Là [vai trò người dùng],
Tôi muốn [hành động/tính năng],
Để [giá trị/lợi ích đạt được].

Liên kết: FR-XXX, BR-XXX

Acceptance Criteria:
  AC1:
    Given [điều kiện ban đầu]
    When [hành động xảy ra]
    Then [kết quả mong đợi]

  AC2:
    Given ...
    When ...
    Then ...

Độ ưu tiên: Must-have / Should-have / Could-have (MoSCoW)
Story Points: (nếu team dùng estimation)
```

## Ví dụ minh họa

```
US-012: Đăng nhập bằng email và mật khẩu

Là người dùng đã đăng ký tài khoản,
Tôi muốn đăng nhập bằng email và mật khẩu,
Để truy cập vào các tính năng cá nhân hóa của hệ thống.

Liên kết: FR-008, BR-003

Acceptance Criteria:
  AC1:
    Given người dùng đã có tài khoản hợp lệ
    When họ nhập đúng email và mật khẩu rồi nhấn "Đăng nhập"
    Then hệ thống chuyển hướng vào trang Dashboard trong vòng 2 giây

  AC2:
    Given người dùng nhập sai mật khẩu quá 5 lần liên tiếp
    When họ thử đăng nhập lần thứ 6
    Then hệ thống khóa tài khoản tạm thời 15 phút và hiển thị thông báo tương ứng

Độ ưu tiên: Must-have
```

## Checklist tự kiểm khi viết xong 1 story (INVEST)
- [ ] Independent — không phụ thuộc cứng vào story khác để có thể triển khai/test riêng
- [ ] Negotiable — mô tả giá trị, không khóa cứng cách implement
- [ ] Valuable — mang lại giá trị rõ ràng cho người dùng/business
- [ ] Estimable — đủ rõ để team ước lượng effort
- [ ] Small — làm được trong 1 sprint, nếu không phải tách nhỏ
- [ ] Testable — Acceptance Criteria đủ cụ thể để viết test case trực tiếp