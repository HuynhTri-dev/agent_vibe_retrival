Hệ thống Voicebot/Chatbot cho hai nghiệp vụ **CSKH Ngân hàng** và **Thu hồi nợ** đòi hỏi các nhóm yêu cầu nghiêm ngặt về kỹ thuật, luồng hội thoại, bảo mật và tính tuân thủ.

---

**1. Yêu cầu kỹ thuật nền tảng (Voice Agent & Chatbot Architecture)**

* **Độ trễ phản hồi (End-to-End Latency):** Đối với voicebot, tổng độ trễ từ lúc người dùng dứt lời đến khi bot phát giọng nói phải duy trì dưới **800ms – 1.200ms** để giữ nhịp hội thoại tự nhiên.
* **Xử lý ngắt lời (Barge-in / Interruption handling):** Bot phải lập tức dừng phát âm thanh ngay khi phát hiện người dùng nói xen ngang qua cơ chế VAD (Voice Activity Detection).
* **Chuỗi xử lý (Pipeline):**
* *STT (Speech-to-Text):* Nhận diện tiếng Việt chuẩn xác, nhận diện tốt các từ viết tắt, số tài khoản, số tiền và tên riêng.
* *LLM / NLU Engine:* Phân tích ý định (Intent Recognition), bóc tách thực thể (Named Entity Recognition - NER) và duy trì ngữ cảnh nhiều lượt thoại (Multi-turn Context).
* *TTS (Text-to-Speech - ElevenLabs):* Sử dụng các model tối ưu độ trễ (như *Eleven Flash* hoặc *Eleven Multilingual v2*), gán nhãn phát âm đúng cho số tiền, ngày tháng và thuật ngữ tài chính.


* **Cơ chế chuyển tiếp người thật (Human Handoff):** Tự động chuyển cuộc gọi/chat sang tổng đài viên (Human Agent) kèm toàn bộ ngữ cảnh/lịch sử trò chuyện khi phát hiện khiếu nại gay gắt hoặc người dùng yêu cầu trực tiếp.

---

**2. Phân tích chi tiết theo từng kịch bản nghiệp vụ**

### A. Nghiệp vụ Chăm sóc khách hàng Ngân hàng (Banking CSKH)

| Tiêu chí | Chi tiết yêu cầu |
| --- | --- |
| **Xác thực danh tính (Authentication)** | Tích hợp lớp định danh bảo mật (Voice OTP, CCCD, xác thực 3 thông tin cá nhân) trước khi truy xuất dữ liệu nhạy cảm. |
| **Truy xuất dữ liệu (Core Banking API)** | Tích hợp API thời gian thực để tra cứu: số dư tài khoản, hạn mức thẻ tín dụng, lịch sử giao dịch gần nhất, trạng thái khóa/mở thẻ. |
| **Kịch bản xử lý khẩn cấp** | Luồng ưu tiên cao nhất cho tác vụ báo mất thẻ / khóa thẻ khẩn cấp, giảm tối đa bước trung gian để thực thi lệnh ngay lập tức. |
| **Giọng nói & Tác phong** | Giọng điệu ấm áp, lịch sự, chuẩn mực, tốc độ vừa phải, thể hiện tính chuyên nghiệp và đồng cảm. |

---

### B. Nghiệp vụ Thu hồi nợ / Nhắc phí (Debt Collection)

| Tiêu chí | Chi tiết yêu cầu |
| --- | --- |
| **Tuân thủ quy định & Pháp lý** | Tuân thủ khung giờ gọi cho phép, xác nhận chính xác danh tính người nhận nợ trước khi công bố thông tin dư nợ (tránh vi phạm bảo mật dữ liệu cá nhân). |
| **Quản lý cảm xúc & Xử lý từ chối** | LLM cần prompt định hướng rõ ràng: kiên quyết, lịch sự, không bị dẫn dắt lạc đề khi khách hàng khiếu nại hoặc từ chối hợp tác. |
| **Chốt cam kết thanh toán (PTP)** | Tự động bóc tách ngày hẹn thanh toán (Promise to Pay), số tiền hẹn trả, phương thức thanh toán và gửi SMS/Zalo ZNS xác nhận ngay sau cuộc gọi. |
| **Ghi nhận trạng thái (Disposition Codes)** | Tự động phân loại kết quả cuộc gọi vào CRM: *Hẹn thanh toán*, *Không nhấc máy*, *Sai số*, *Tranh chấp khoản vay*, *Không thừa nhận nợ*. |

---

**3. Yêu cầu về Bảo mật & Vận hành dữ liệu**

* **Mã hóa & Che thông tin (Data Masking):** Toàn bộ dữ liệu nhạy cảm (số thẻ, OTP, CVV, thông tin cá nhân) phải được che (masking) trong nhật ký log chat/voice và database theo tiêu chuẩn PCI-DSS.
* **Prompt Injection Defense:** Thiết lập rào chắn bảo vệ LLM để bot không bị người dùng điều hướng nói sai quy tắc ngân hàng hoặc đưa ra các thỏa thuận tài chính trái thẩm quyền.
* **Tích hợp kênh liên lạc:** Kết nối với SIP Trunking / Tổng đài VoIP (như Asterisk, Twilio, Stringee) cho Voicebot và SDK Web/App cho Chatbot.

---

**4. Bộ chỉ số QC & Đánh giá (Quality Checklist cho bài test)**

* **Độ chính xác nghiệp vụ (Intent Accuracy):** Tỷ lệ hiểu đúng yêu cầu tra cứu hoặc phản hồi nợ $\ge 90\%$.
* **Độ trễ tương tác (First Audio Byte Latency):** Thời gian phản hồi thoại $\le 1.2\text{s}$.
* **Khả năng tự nhiên của Voice:** Cách ngắt nghỉ câu, đọc số tiền (VD: "500.000 VNĐ" đọc là "năm trăm nghìn đồng", không đọc từng chữ số rời rạc).
* **Tỷ lệ xử lý thành công (Resolution Rate):** Tỷ lệ giải quyết xong tác vụ mà không cần đẩy sang agent đối với các ca chuẩn.