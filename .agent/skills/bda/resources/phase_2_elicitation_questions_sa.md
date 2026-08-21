# Ngân hàng câu hỏi — Giai đoạn 2 (Solution/System Analysis)

Chỉ bắt đầu sau khi đã có Vision & Scope. Hỏi theo module, không hỏi tất cả module cùng lúc. Đây là điểm khởi đầu — khi phát hiện business rule mơ hồ, NFR thiếu con số, hoặc actor/use case có khả năng xung đột quyền hạn, đào sâu ngay thay vì ghi nhận rồi đi tiếp. Chủ động đề xuất khía cạnh domain-specific (multi-tenancy, rate limiting, data residency...) phù hợp với loại hệ thống đang phân tích, không chỉ giới hạn trong các câu liệt kê dưới đây.

## Nhóm A — Chức năng theo module
- Trong module [X], các thao tác chính người dùng thực hiện là gì? (liệt kê theo hành động, VD: tạo, sửa, xóa, tìm kiếm, export...)
- Ai (role nào) được phép thực hiện thao tác này?
- Có bước xác thực/phê duyệt nào trước khi thao tác hoàn tất không?

## Nhóm B — Business rules
- Có điều kiện/ràng buộc logic nào áp dụng cho chức năng này không? (VD: giới hạn số lượng, điều kiện giảm giá, validation đặc biệt)
- Có trường hợp ngoại lệ nào cần xử lý riêng không?

## Nhóm C — Non-functional requirements
- Hệ thống cần xử lý bao nhiêu người dùng đồng thời / bao nhiêu request mỗi giây?
- Có yêu cầu thời gian phản hồi cụ thể không (VD: < 2s)?
- Dữ liệu nhạy cảm nào cần mã hóa/kiểm soát truy cập đặc biệt?
- Yêu cầu uptime/SLA là bao nhiêu?
- Hệ thống cần chạy trên thiết bị/trình duyệt nào?

## Nhóm D — Cấu trúc dữ liệu
- Các entity chính trong hệ thống là gì (VD: User, Order, Product)?
- Quan hệ giữa các entity đó như thế nào (1-1, 1-nhiều, nhiều-nhiều)?
- Có dữ liệu nào cần đồng bộ với hệ thống bên ngoài không?

## Nhóm E — Actor & Use case
- Có bao nhiêu loại actor (người dùng/hệ thống ngoài) tương tác với hệ thống?
- Với mỗi actor, họ cần thực hiện những use case chính nào?
- Có luồng nào actor này tương tác gián tiếp qua actor khác không (VD: Admin duyệt yêu cầu của User)?