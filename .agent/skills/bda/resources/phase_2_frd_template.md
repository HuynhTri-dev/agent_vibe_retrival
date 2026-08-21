# Functional Requirements Document (FRD)

> Tập trung vào: hệ thống PHẢI LÀM GÌ (không phải làm như thế nào ở tầng UI). Mỗi FR có ID, mô tả input/output rõ, và business rule liên quan.

## 1. Danh sách Functional Requirements

### Module: [Tên module]

| FR ID | Mô tả yêu cầu | Input | Output | Business Rule liên quan | Độ ưu tiên |
|---|---|---|---|---|---|
| FR-001 | | | | BR-001 | Must-have |

## 2. Business Rules

| BR ID | Mô tả quy tắc | Áp dụng cho FR |
|---|---|---|
| BR-001 | | FR-001 |

> Business rule là điều kiện logic bất biến (VD: "Đơn hàng > 500.000đ được miễn phí ship"), khác với functional requirement là hành vi hệ thống (VD: "Hệ thống tính phí ship tự động khi checkout").

## 3. Cấu trúc dữ liệu (Data Structure)

Mô tả entity chính liên quan tới module, dùng như input cho ERD ở phần Mermaid diagrams:

### Entity: [Tên entity]
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| | | | |

## 4. Điều kiện đầu vào / đầu ra (Pre/Post-conditions)

### FR-001
- **Pre-condition:** trạng thái hệ thống phải như thế nào trước khi hành động này xảy ra
- **Post-condition:** trạng thái hệ thống sau khi hành động thành công
- **Exception/Error case:** các trường hợp lỗi cần xử lý và hành vi tương ứng