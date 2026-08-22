<!--
name: 01_BRD_Vision_Scope.md
description: Business Requirements Document (BRD) and Vision & Scope Document for Banking CSKH and Debt Collection Voicebot/Chatbot System.
-->

# Business Requirements Document (BRD) & Vision Scope
## Hệ Thống Trợ Lý Ảo Đa Kênh (Voicebot & Chatbot) Cho CSKH Ngân Hàng & Thu Hồi Nợ

---

## 1. Thông Tin Dự Án (Project Information)
- **Tên dự án:** Omni-Channel AI Agent for Banking CSKH & Debt Collection (Voice & Chat)
- **Mã dự án:** AGENT-FIN-VOICE-01
- **Phiên bản tài liệu:** v1.0.0
- **Ngày lập:** 2026-08-21
- **Trạng thái:** Brainstorm / Phân tích yêu cầu nghiệp vụ

---

## 2. Bối Cảnh Nghiệp Vụ & Phân Tích Vấn Đề (Business Context & Problem Analysis)
 
### 2.1. Phân tích hiện trạng (As-Is) & Vấn đề cốt lõi
1. **Nghiệp vụ CSKH Ngân hàng:**
   - **Tải cuộc gọi dồn dập vào giờ cao điểm:** Tổng đài viên (Human Agent) bị quá tải bởi các câu hỏi lặp đi lặp lại (tra cứu số dư, phí thường niên, hạn mức thẻ, tìm điểm ATM).
   - **Thời gian xử lý tác vụ khẩn cấp chậm:** Khi khách hàng mất thẻ/nghi ngờ lộ thông tin vào ban đêm hoặc giờ cao điểm, việc chờ đợi kết nối tổng đài viên từ 3-5 phút tạo ra rủi ro tổn thất tài chính nghiêm trọng cho khách hàng và ngân hàng.
   - **Chi phí vận hành Contact Center cao:** Chi phí nhân sự ca kíp 24/7 lớn nhưng tỷ lệ hài lòng (CSAT) suy giảm do thời gian chờ đợi (Queue time) lâu.

2. **Nghiệp vụ Thu hồi nợ / Nhắc phí (Debt Collection):**
   - **Tỷ lệ tiếp cận và chốt hẹn thấp (PTP Rate):** Nhân viên nhắc nợ thủ công mất nhiều thời gian quay số (nhiều cuộc gọi bận, sai số, không nghe máy), dẫn đến năng suất cuộc gọi thấp.
   - **Rủi ro tuân thủ pháp lý & quy định ngân hàng nhà nước:** Nguy cơ nhân viên vi phạm khung giờ gọi điện, công bố nhầm thông tin nợ cho bên thứ ba (chưa định danh chính xác người vay), hoặc sử dụng ngôn từ không đúng chuẩn mực.
   - **Ghi nhận dữ liệu thiếu nhất quán:** Kết quả cuộc gọi (Disposition codes) bị phân loại sai lệch, làm chậm luồng gửi tin nhắn xác nhận (SMS/ZNS) và cập nhật hệ thống CRM/Core Collection.

### 2.2. Mục tiêu chuyển đổi sang To-Be
| Khía cạnh | Hiện trạng (As-Is) | Mục tiêu hệ thống mới (To-Be) |
|---|---|---|
| **Kênh tương tác** | Thoại truyền thống & Chat phân mảnh | Hợp nhất Voicebot (VoIP/SIP Trunk) & Chatbot (Web/App) đa kênh 24/7 |
| **Độ trễ phản hồi thoại** | Nhân viên trả lời hoặc IVR phím bấm rườm rà | Voice AI phản hồi tự nhiên, độ trễ End-to-End **< 1.000ms**, hỗ trợ ngắt lời (Barge-in) |
| **Xác thực danh tính** | Nhân viên hỏi thủ công từng câu | Xác thực tự động nhiều lớp (Voice OTP, 3-factor, khớp CCCD/SĐT) an toàn bảo mật |
| **Tác vụ khẩn cấp** | Chờ hàng đợi 3-5 phút | Tự động khóa thẻ/tài khoản tức thì trong vòng < 15 giây |
| **Nhắc nợ tự động** | Quay số thủ công, năng suất 80-120 cuộc/ngày/người | Auto-dialer thông minh gọi hàng nghìn cuộc/giờ, nhận diện PTP, cập nhật CRM tự động |

---

## 3. Mục Tiêu Nghiệp Vụ (Business Objectives - SMART)

1. **BO-01 (Giảm tải tổng đài):** Tự động hóa ít nhất **70%** các cuộc gọi/tin nhắn tra cứu chuẩn (số dư, hạn mức, sao kê, chính sách) mà không cần chuyển tiếp agent.
2. **BO-02 (Tối ưu tác vụ khẩn cấp):** Giảm thời gian thực hiện khóa thẻ khẩn cấp xuống **dưới 15 giây** từ lúc tiếp nhận ý định, tỷ lệ thành công 99.99%.
3. **BO-03 (Nâng cao hiệu suất thu hồi nợ):** Tăng tỷ lệ cam kết thanh toán (Promise-to-Pay - PTP) thành công thêm **25%** và tự động hóa 100% việc gửi SMS/ZNS xác nhận sau cuộc gọi trong vòng 10 giây.
4. **BO-04 (Tuân thủ & Trải nghiệm):** Đảm bảo 100% cuộc gọi nhắc nợ tuân thủ khung giờ pháp lý, 0% vi phạm tiết lộ dư nợ cho người thứ ba; đạt Intent Accuracy $\ge 90\%$ và First Audio Byte Latency $\le 1.2\text{s}$.

---

## 4. Các Bên Liên Quan (Stakeholders Matrix)

| Vai trò / Bộ phận | Trách nhiệm chính | Nhu cầu cốt lõi | Mức độ ảnh hưởng |
|---|---|---|---|
| **Ban Giám đốc Khối Vận hành & Dịch vụ Khách hàng** | Phê duyệt ngân sách & KPI vận hành | Giảm chi phí CSKH, tăng chỉ số CSAT/NPS | Quyết định (High) |
| **Bộ phận Thu hồi nợ (Debt Collection Dept)** | Cung cấp kịch bản nhắc nợ, danh mục phân loại | Chốt PTP tự động, cập nhật CRM thời gian thực | Quyết định (High) |
| **Khối An toàn Thông tin & Pháp chế (CISO / Compliance)** | Thẩm định bảo mật & tuân thủ pháp lý | Tuân thủ PCI-DSS, bảo vệ dữ liệu cá nhân, chống Prompt Injection | Bắt buộc (High) |
| **Khối Công nghệ Thông tin (Core Banking & VoIP/Telephony IT)** | Cung cấp API Core, tích hợp SIP Trunk/PBX | API ổn định, bảo mật Token, hạ tầng mạng chịu tải cao | Thực thi (High) |
| **Tổng đài viên (Human Agents)** | Tiếp nhận cuộc gọi leo thang (Escalation) | Nhận đầy đủ Context/Transcript trước đó khi chuyển giao | Người dùng cuối nội bộ |
| **Khách hàng Ngân hàng / Người vay** | Người tương tác trực tiếp | Phản hồi nhanh, tự nhiên, giải quyết việc ngay, không bị làm phiền sai | Người dùng cuối |

---

## 5. Phạm Vi Dự Án (Vision & Scope)

### 5.1. Trong phạm vi (In-Scope)
- **Module Kỹ thuật Nền tảng AI Voice/Chat:**
  - Tích hợp SIP Trunking (Twilio/Asterisk/Stringee) & Web/App Chat SDK.
  - Streaming Pipeline: VAD (Silero/WebRTC) $\rightarrow$ Streaming STT $\rightarrow$ LLM Context Engine $\rightarrow$ Streaming TTS (ElevenLabs Flash/Multilingual v2).
  - Cơ chế xử lý ngắt lời lập tức (Barge-in Interruption).
  - Tự động ngắt & chuyển tuyến Human Handoff kèm Context Packet.
- **Nghiệp vụ CSKH Ngân hàng:**
  - Định danh xác thực (Voice OTP, CCCD, thông tin tài khoản).
  - Tích hợp API Core Banking tra cứu số dư, hạn mức, sao kê 5 giao dịch gần nhất.
  - Kịch bản ưu tiên cao nhất: Khóa thẻ / Báo mất thẻ khẩn cấp.
  - Giải đáp FAQ sản phẩm, biểu phí, tỷ giá, lãi suất.
- **Nghiệp vụ Thu hồi nợ (Debt Collection):**
  - Tích hợp danh sách Outbound Campaign từ CRM.
  - Kiểm soát khung giờ gọi tuân thủ luật (VD: 08:00 - 21:00).
  - Bóc tách PTP (Ngày hẹn, số tiền, kênh thanh toán).
  - Gửi SMS Brandname / Zalo ZNS xác nhận tự động.
  - Phân loại Disposition Code tự động vào CRM.
- **Bảo mật & Giám sát:**
  - Data Masking (che số thẻ, OTP, số dư, CCCD) trong Logs & Audio Record.
  - LLM Guardrails chống Prompt Injection & Jailbreak.
  - Dashboard QC chấm điểm cuộc gọi theo tiêu chí định lượng.

### 5.2. Ngoài phạm vi (Out-of-Scope - Phase 1)
- Xử lý các giao dịch chuyển tiền trực tiếp hoặc phê duyệt hạn mức tín dụng tự động qua giọng nói (chỉ hỗ trợ tra cứu và khóa chặn).
- Tích hợp sinh trắc học giọng nói chuyên sâu (Voice Biometrics) cấp chứng thực chữ ký số pháp lý (dự kiến đưa vào Phase 2).
- Thu hồi nợ qua các kênh mạng xã hội không chính thống.

---

## 6. Ràng Buộc & Giả Định (Constraints & Assumptions)

### Ràng buộc kỹ thuật & pháp lý:
- **Độ trễ mạng:** Hạ tầng kết nối SIP Trunk và Server LLM/TTS phải có round-trip latency nội địa $< 80\text{ms}$.
- **Chuẩn bảo mật:** Tuân thủ triệt để tiêu chuẩn PCI-DSS (không lưu CVV, che 6 số giữa của số thẻ).
- **Ngữ âm tiếng Việt:** Mô hình TTS phải đọc chuẩn xác số tiền tiền Việt (VD: `500.000 VNĐ` đọc là "năm trăm nghìn đồng", không đọc "năm không không không không không").

### Giả định:
- Hệ thống Core Banking và CRM của Ngân hàng cung cấp sẵn các RESTful/gRPC API có thời gian đáp ứng $< 250\text{ms}$.
- Tỷ lệ nhận diện đúng của STT Tiếng Việt trong môi trường thoại VoIP đạt $\ge 93\%$.

---

## 7. Phân Tích Rủi Ro & Biện Pháp Giảm Thiểu (Risk Management)

| Mã Rủi Ro | Mô tả rủi ro | Khả năng | Tác động | Biện pháp giảm thiểu |
|---|---|---|---|---|
| **RSK-01** | Độ trễ voice vượt ngưỡng 1.2s gây gượng gạo cuộc gọi | Trung bình | Cao | Sử dụng Streaming STT + Early Chunking LLM + ElevenLabs Flash Streaming qua WebSocket |
| **RSK-02** | Khách hàng bị lộ thông tin nợ do bot nói nhầm người | Thấp | Nghiêm trọng | Bắt buộc bước xác nhận danh tính 2 chiều (Họ tên + 4 số cuối CCCD) trước khi nhắc đến dư nợ |
| **RSK-03** | Prompt Injection làm bot chấp nhận giảm nợ trái quyền | Thấp | Cao | Sử dụng System Prompt Guardrail cố định; cấm bot cam kết giảm nợ, chỉ ghi nhận đề xuất |
| **RSK-04** | Lỗi kết nối Core Banking khi khách hàng đang yêu cầu khóa thẻ | Thấp | Nghiêm trọng | Fallback khẩn cấp: Tự động chuyển ngay tới Agent ưu tiên 1 hoặc gọi API gateway dự phòng |
