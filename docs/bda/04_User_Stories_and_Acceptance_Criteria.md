<!--
name: 04_User_Stories_and_Acceptance_Criteria.md
description: User Stories with Gherkin Acceptance Criteria, QC Test Matrix, and Quality Evaluation Checklist for Banking CSKH & Debt Collection Voicebot/Chatbot.
-->

# User Stories & Gherkin Acceptance Criteria (US & AC)
## Bộ Tiêu Chí Đánh Giá & Kiểm Thử Chất Lượng (Quality Assessment Matrix)

---

## 1. Danh Sách User Stories (Agile INVEST Standard)

### Epic 1: Nền Tảng Kỹ Thuật Voice AI Thời Gian Thực (Voice Platform)

#### US-VOICE-01: Phản hồi giọng nói độ trễ thấp (Streaming Low Latency)
- **Là một:** Khách hàng gọi điện vào tổng đài,
- **Tôi muốn:** Nhận được phản hồi bằng giọng nói tự nhiên, liền mạch trong vòng dưới 1.2 giây sau khi tôi dứt lời,
- **Để:** Trải nghiệm hội thoại diễn ra mượt mà như đang nói chuyện với tổng đài viên thực tế.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Người dùng dứt lời và nhận phản hồi âm thanh trong ngưỡng cho phép
  Given Khách hàng đang kết nối cuộc gọi thoại SIP Trunk với Voicebot
  When Khách hàng kết thúc phát biểu một câu hỏi hoàn chỉnh
  Then VAD phát hiện dứt lời (Silence > 400ms)
  And Byte âm thanh đầu tiên (First Audio Byte) từ ElevenLabs TTS được phát đến tai khách hàng trong vòng <= 1.200ms
  And Âm điệu phát âm tiếng Việt tự nhiên, rõ ràng, không bị ngắt quãng giữa câu.
```

---

#### US-VOICE-02: Xử lý ngắt lời lập tức (Barge-in / Interruption)
- **Là một:** Khách hàng đang nghe bot trả lời dài,
- **Tôi muốn:** Có thể nói xen ngang để đổi ý hoặc yêu cầu tác vụ khác,
- **Để:** Tiết kiệm thời gian và không phải chờ bot đọc hết toàn bộ nội dung.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Khách hàng nói xen ngang khi bot đang phát giọng nói
  Given Voicebot đang phát âm thanh trả lời về thông tin lãi suất
  When Khách hàng cất lời nói: "Khóa thẻ khẩn cấp giúp tôi"
  Then Media Server phát hiện giọng nói người dùng trong vòng > 120ms
  And Hệ thống lập tức dừng phát âm thanh TTS ra loa trong vòng <= 100ms
  And Hủy toàn bộ hàng đợi audio TTS còn lại
  And Chuyển ngay văn bản STT mới "Khóa thẻ khẩn cấp giúp tôi" vào LLM để xử lý luồng khóa thẻ.
```

---

### Epic 2: Nghiệp Vụ CSKH Ngân Hàng (Banking Inbound CSKH)

#### US-CSKH-01: Báo mất & Khóa thẻ tín dụng khẩn cấp (Fast-Track Emergency Lock)
- **Là một:** Chủ thẻ ngân hàng bị rơi mất ví hoặc nghi ngờ lộ thông tin thẻ,
- **Tôi muốn:** Khóa thẻ tức thì thông qua quy trình định danh nhanh nhất,
- **Để:** Ngăn chặn kịp thời các giao dịch gian lận tài chính.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Khóa thẻ thành công với định danh rút gọn
  Given Khách hàng gọi từ số điện thoại đã đăng ký với ngân hàng và yêu cầu "Khóa thẻ gấp"
  When Bot yêu cầu và khách hàng đọc đúng 4 số cuối CCCD
  Then Hệ thống xác thực danh tính thành công
  And Gọi API Core Banking `POST /api/v1/cards/lock` với mã thẻ tương ứng
  And Core Banking phản hồi `status: LOCKED` trong vòng <= 2.000ms
  And Bot thông báo bằng giọng nói xác nhận thẻ đã khóa an toàn
  And Hệ thống tự động gửi 1 tin nhắn SMS xác nhận khóa thẻ đến số điện thoại của khách hàng trong vòng <= 5 giây.

Scenario: Core Banking API bị timeout khi khóa thẻ
  Given Khách hàng đã xác thực đúng 4 số cuối CCCD và yêu cầu khóa thẻ
  When Gọi API Core Banking bị timeout > 3.000ms hoặc lỗi 500
  Then Bot thông báo chuyển tiếp khẩn cấp đến tổng đài viên trực 24/7
  And Thực hiện SIP Transfer chuyển cuộc gọi sang nhánh ưu tiên 1 kèm mã lỗi hệ thống.
```

---

#### US-CSKH-02: Tra cứu số dư và sao kê giao dịch gần nhất
- **Là một:** Khách hàng cá nhân của ngân hàng,
- **Tôi muốn:** Hỏi bot để biết số dư khả dụng và 3 giao dịch mới nhất,
- **Để:** Nắm bắt biến động tài chính mà không cần mở ứng dụng ngân hàng.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Tra cứu số dư thành công và đọc đúng định dạng tiền tệ
  Given Khách hàng đã hoàn thành bước định danh thông tin
  When Khách hàng hỏi: "Kiểm tra cho tôi xem còn bao nhiêu tiền?"
  Then LLM gọi function `getBalance(accountId)`
  And TTS đọc đúng số tiền tiếng Việt (Ví dụ: 15.500.000 VNĐ đọc là "Mười lăm triệu năm trăm nghìn đồng")
  And Tuyệt đối không đọc thành từng chữ số rời rạc "Một năm năm không không...".
```

---

### Epic 3: Nghiệp Vụ Thu Hồi Nợ (Debt Collection Outbound)

#### US-DEBT-01: Định danh người vay và chốt ngày hẹn thanh toán (PTP Extraction)
- **Là một:** Hệ thống quản lý thu hồi nợ tự động,
- **Tôi muốn:** Bot xác nhận đúng người vay trước khi công bố nợ và tự động bóc tách ngày hẹn thanh toán (Promise to Pay),
- **Để:** Thu hồi nợ đúng luật, bảo mật thông tin và cập nhật ngày hẹn vào CRM.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Xác nhận đúng người vay và chốt ngày PTP thành công
  Given Bot thực hiện cuộc gọi Outbound đến số điện thoại trong danh sách nợ quá hạn
  When Người nghe máy xác nhận đúng họ tên của chủ hợp đồng vay
  Then Bot mới được phép công bố số ngày quá hạn và số tiền nợ
  When Khách hàng cam kết: "Ngày 25 này có lương tôi sẽ chuyển khoản 3 triệu"
  Then LLM bóc tách chính xác các thực thể: `ptp_date: 2026-08-25`, `ptp_amount: 3000000`, `channel: CHUYEN_KHOAN`
  And Gửi tin nhắn SMS/Zalo ZNS xác nhận lịch hẹn và thông tin tài khoản thu hộ trong vòng <= 10 giây
  And Cập nhật CRM với trạng thái `Disposition: PTP`.

Scenario: Người nghe máy không phải là chủ hợp đồng vay
  Given Bot thực hiện cuộc gọi Outbound
  When Người nghe máy nói: "Tôi là vợ anh ấy, anh ấy đi vắng rồi"
  Then Bot tuyệt đối KHÔNG tiết lộ thông tin số tiền nợ hoặc hợp đồng vay
  And Bot lịch sự nhờ người nghe chuyển lời chủ hợp đồng liên hệ lại tổng đài ngân hàng
  And Cập nhật CRM với trạng thái `Disposition: THIRD_PARTY_CONTACT`.
```

---

### Epic 4: Bảo Mật, Tuân Thủ & Che Dữ Liệu (Security & Data Masking)

#### US-SEC-01: Che giấu dữ liệu nhạy cảm (Data Masking PCI-DSS)
- **Là một:** Cán bộ An toàn Thông tin (CISO/Compliance),
- **Tôi muốn:** Toàn bộ thông tin số thẻ, CCCD, OTP, CVV bị che trước khi ghi vào log hoặc cơ sở dữ liệu,
- **Để:** Đảm bảo tuân thủ tiêu chuẩn an toàn bảo mật PCI-DSS và bảo vệ quyền riêng tư người dùng.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Masking dữ liệu thẻ tín dụng trong log hội thoại
  Given Khách hàng đọc số thẻ tín dụng "4123 4567 8901 2345" trong cuộc hội thoại
  When Dữ liệu được ghi vào File Log, ElasticSearch hoặc Database
  Then Chuỗi số thẻ phải được che thành "4123 45XX XXXX 2345"
  And Mã CVV/CVC hoặc OTP nếu có phải bị xóa bỏ hoàn toàn (thay bằng `[REDACTED_OTP]`).
```

---

## 2. Bảng Chỉ Số Đánh Giá & Kiểm Soát Chất Lượng (Quality Assessment & QC Checklist)

| STT | Tiêu chí đánh giá (QC Metric) | Ngưỡng đạt chuẩn (Target Threshold) | Phương pháp kiểm thử / Đo lường |
|:---:|---|:---:|---|
| **1** | **Độ chính xác ý định (Intent Accuracy)** | **$\ge 90\%$** | Chạy bộ test set 500 mẫu câu thoại (CSKH & Debt Collection) với nhiều phương ngữ tiếng Việt. |
| **2** | **Độ trễ phản hồi (First Audio Byte Latency)** | **$\le 1.2\text{s}$ (P95)** | Đo thời gian từ timestamp VAD `SPEECH_END` đến byte âm thanh đầu tiên nhận tại client. |
| **3** | **Tỷ lệ xử lý thành công (FCR / Resolution Rate)** | **$\ge 75\%$** (cho các ca chuẩn) | Đếm số lượng phiên hoàn thành mục tiêu (khóa thẻ, tra cứu, chốt PTP) không cần leo thang human agent. |
| **4** | **Tính tự nhiên của giọng nói (MOS Voice Score)** | **$\ge 4.2 / 5.0$** | Đánh giá bởi hội đồng chuyên gia âm học: độ ngắt nghỉ câu, đọc đúng số tiền, ngày tháng, không giật cục. |
| **5** | **Thời gian ngắt lời (Barge-in Latency)** | **$\le 100\text{ms}$** | Kiểm thử phát hiện âm thanh người dùng khi bot đang nói, đo thời gian dừng phát âm thanh. |
| **6** | **Tỷ lệ phát hiện tấn công (Injection Defense)** | **$100\%$** | Chạy bộ test suite 50 trường hợp Jailbreak, Prompt Override, mạo danh quyền lực. |
| **7** | **Tuân thủ che dữ liệu (Data Masking Rate)** | **$100\%$** | Quét tự động toàn bộ database logs để đảm bảo không tồn tại thẻ/CCCD/OTP dạng plain-text. |
