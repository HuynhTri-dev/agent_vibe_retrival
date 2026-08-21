# Mermaid Diagram Snippets cho SA Documentation

Dùng đúng loại diagram cho đúng mục đích. Đặt code block ```mermaid``` trong file .md, hầu hết renderer (GitHub, GitLab, VSCode preview...) hiển thị trực tiếp.

## 1. Use Case Diagram

Mermaid không có use case notation chuẩn UML, mô phỏng bằng `flowchart` với actor là node hình người (dùng subgraph để nhóm use case trong hệ thống):

```mermaid
flowchart LR
    Actor1((Khách hàng))
    Actor2((Admin))
    subgraph System[Hệ thống Đặt hàng]
        UC1([Xem sản phẩm])
        UC2([Đặt hàng])
        UC3([Quản lý kho])
    end
    Actor1 --> UC1
    Actor1 --> UC2
    Actor2 --> UC3
```

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend API
    participant DB as Database

    User->>FE: Nhấn "Đăng nhập"
    FE->>BE: POST /auth/login
    BE->>DB: Kiểm tra credential
    DB-->>BE: Kết quả
    alt Đăng nhập thành công
        BE-->>FE: 200 OK + JWT token
        FE-->>User: Chuyển tới Dashboard
    else Sai thông tin
        BE-->>FE: 401 Unauthorized
        FE-->>User: Hiển thị lỗi
    end
```

## 3. Activity Diagram (dùng flowchart)

```mermaid
flowchart TD
    Start([Bắt đầu]) --> A[Người dùng nhập thông tin]
    A --> B{Thông tin hợp lệ?}
    B -->|Có| C[Lưu vào hệ thống]
    B -->|Không| D[Hiển thị lỗi]
    D --> A
    C --> End([Kết thúc])
```

## 4. ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "included in"

    CUSTOMER {
        string customer_id PK
        string name
        string email
    }
    ORDER {
        string order_id PK
        string customer_id FK
        date order_date
        string status
    }
    PRODUCT {
        string product_id PK
        string name
        decimal price
    }
```

## 5. Wireframe (mô phỏng bằng block layout)

Mermaid không có wireframe engine thật — dùng `flowchart` với các box vuông đại diện vùng layout, ghi rõ đây là low-fidelity mockup, không phải UI thật. Nếu người dùng cần độ chi tiết cao hơn (màu sắc, spacing thật), đề xuất chuyển sang visualizer/HTML mockup thay vì Mermaid.

```mermaid
flowchart TD
    subgraph Screen["Màn hình: Trang chủ"]
        direction TB
        Header["Header: Logo | Menu | Avatar"]
        Banner["Banner quảng cáo"]
        subgraph Content["Nội dung chính"]
            direction LR
            Sidebar["Sidebar: Bộ lọc"]
            ProductList["Danh sách sản phẩm (grid)"]
        end
        Footer["Footer: Liên kết | Bản quyền"]
    end
    Header --> Banner --> Content --> Footer
```

## Nguyên tắc chọn diagram
| Mục đích | Diagram |
|---|---|
| Ai làm gì với hệ thống | Use Case |
| Luồng tương tác giữa các component theo thời gian | Sequence |
| Luồng xử lý nghiệp vụ / quyết định | Activity (hoặc BPMN-style flowchart) |
| Cấu trúc dữ liệu / quan hệ bảng | ERD |
| Bố cục màn hình mức thô | Block-layout flowchart (không thay thế được Figma) |