# Validation Checklists

Dùng để tự kiểm tài liệu trước khi chốt, hoặc để review tài liệu do người dùng cung cấp. Khi review, chỉ ra CỤ THỂ câu/mục nào vi phạm tiêu chí, không nhận xét chung chung.

## 1. BRD / Vision & Scope (theo BABOK v3)
- [ ] Problem Statement mô tả VẤN ĐỀ, không lẫn giải pháp
- [ ] Mỗi mục tiêu kinh doanh có thể đo lường được (hoặc ít nhất có tiêu chí thành công rõ ràng)
- [ ] Stakeholder list không thiếu người có quyền phê duyệt cuối cùng
- [ ] In-scope và Out-of-scope không có mục nào mơ hồ kiểu "hỗ trợ đầy đủ" / "mọi trường hợp" — phải liệt kê cụ thể
- [ ] Không có mục nào xuất hiện ở cả In-scope lẫn Out-of-scope (mâu thuẫn)
- [ ] Ràng buộc/giả định được tách riêng, không lẫn vào scope

## 2. SRS / FRD (theo IEEE 830-1998 — 8 thuộc tính chất lượng)
Mỗi requirement cần đạt các thuộc tính sau, kiểm từng FR/NFR một:
- [ ] **Correct** — phản ánh đúng nhu cầu đã xác nhận với người dùng
- [ ] **Unambiguous** — chỉ hiểu theo một nghĩa duy nhất (tránh "nhanh", "dễ dùng", "linh hoạt" không định lượng)
- [ ] **Complete** — đủ input/output/exception case, không để trống phần nào
- [ ] **Consistent** — không mâu thuẫn với requirement khác trong cùng tài liệu
- [ ] **Verifiable** — có thể viết test case để kiểm chứng (nếu không viết được test case → câu này chưa đạt)
- [ ] **Ranked** — có độ ưu tiên (must/should/could)
- [ ] **Traceable** — có ID và xuất hiện trong RTM
- [ ] **Modifiable** — cấu trúc rõ ràng, không lặp lại nội dung ở nhiều nơi gây khó sửa

Riêng NFR: mỗi mục PHẢI có ngưỡng số cụ thể (VD: "< 2s", "99.9% uptime") — nếu không có số, coi như chưa đạt "Verifiable".

## 3. User Story & Acceptance Criteria (theo Agile Alliance / INVEST)
- [ ] Đúng format "Là... Tôi muốn... Để..." và nêu rõ giá trị (phần "Để...")
- [ ] Independent — không bị khóa cứng vào thứ tự với story khác
- [ ] Negotiable — không mô tả chi tiết implementation (đó là việc của dev/design)
- [ ] Valuable — giá trị dành cho người dùng cuối, không phải giá trị kỹ thuật nội bộ
- [ ] Estimable — đủ thông tin để ước lượng effort
- [ ] Small — làm được trong 1 sprint (nếu không, gợi ý tách nhỏ)
- [ ] Testable — Acceptance Criteria dạng Given/When/Then, không mơ hồ
- [ ] Có ít nhất 1 AC cho happy path và 1 AC cho edge case/lỗi

## 4. RTM
- [ ] Không có Business Requirement nào không map tới FR nào (orphan requirement)
- [ ] Không có FR nào không map tới User Story hoặc Test Case
- [ ] Không có Test Case nào không truy ngược được về requirement gốc
- [ ] ID sử dụng nhất quán với ID trong BRD/SRS/FRD/User Story (không đổi định dạng ID giữa các tài liệu)

## 5. Diagram (Mermaid)
- [ ] Use Case Diagram: mỗi actor có ít nhất 1 use case, không có use case "mồ côi" (không thuộc actor nào)
- [ ] Sequence Diagram: có xử lý alternate flow (lỗi/exception), không chỉ vẽ happy path
- [ ] ERD: mỗi entity có ít nhất 1 khóa chính (PK), quan hệ có ghi rõ cardinality (1-1, 1-n, n-n)
- [ ] Wireframe: chỉ dùng để thống nhất luồng/bố cục, không dùng thay thế cho spec UI chi tiết — nếu người dùng cần pixel-level, khuyến nghị công cụ thiết kế thật (Figma...)