<!--
name: procedure.md
description: Reference catalog of customer service procedures designed for the banking CSKH agent.
-->
# Banking CSKH Agent - Procedure Design Catalog

This document defines the structured and free-form procedures recommended for the An Binh Bank CSKH Agent. These procedures ensure safe, compliant, and deterministic customer service workflows, separating routine inquiries from high-risk transactions.

---

## 1. Summary of Proposed Procedures

| Procedure ID | Procedure Name | Target Scenario | Security Level | Primary Tool(s) |
| :--- | :--- | :--- | :--- | :--- |
| `proc_emergency_lock` | Báo Mất Thẻ / Khóa Thẻ Khẩn Cấp | Lost/stolen card, immediate lock needed | Medium-High | `verify_customer_id`, `get_customer_cards`, `execute_card_lock` |
| `proc_check_balance` | Tra Cứu Số Dư Tài Khoản / Thẻ | Check current available balance | Medium | `verify_customer_id`, `get_customer_cards`, `get_account_balance` |
| `proc_recent_tx` | Tra Cứu Lịch Sử Giao Dịch | View last 3-5 transactions | Medium | `verify_customer_id`, `get_customer_cards`, `get_recent_transactions` |
| `proc_unlock_card` | Mở Khóa Thẻ Tạm Thời | Unlock a previously locked card | High (Requires OTP) | `verify_customer_id`, `send_otp`, `verify_otp`, `execute_card_unlock` |
| `proc_activate_card` | Kích Hoạt Thẻ Mới | Activate a newly issued card | High (Requires OTP) | `verify_customer_id`, `send_otp`, `verify_otp`, `execute_card_activation` |
| `proc_sms_banking` | Đăng Ký / Hủy SMS Banking | Manage balance notification service | Medium | `verify_customer_id`, `toggle_sms_banking` |
| `proc_fraud_report` | Báo Cáo Giao Dịch Gian Lận | Unrecognized transaction or fraud alert | High (Emergency) | `execute_card_lock`, `system_tool_transfer` |
| `proc_unsupported` | Nghiệp Vụ Chưa Hỗ Trợ | Handoff corporate, credit limit, loans, etc. | Low | `system_tool_transfer` |

---

## 2. Detailed Procedure Workflows

### 1. Procedure: Báo Mất Thẻ / Khóa Thẻ Khẩn Cấp (`proc_emergency_lock`)
*   **Trigger:** User lost their wallet/card, or suspects card compromise.
*   **Security:** Verify CCCD. If verified, check session memory.
*   **Steps:**
    1.  **Session Check:** If CCCD is not yet verified in this session, ask for CCCD and call `verify_customer_id`. If it fails twice, handoff to human agent immediately.
    2.  **Card Fetch:** Execute `get_customer_cards` using verified CCCD.
    3.  **Selection:** 
        *   *If 1 card:* Ask for confirmation ("Dạ em thấy mình có thẻ Visa đuôi 1234, anh/chị muốn khóa thẻ này đúng không ạ?").
        *   *If multiple cards:* Read out the active cards and ask the user to provide the last 4 digits of the card they wish to lock.
    4.  **Action:** Call `execute_card_lock` with `cccd_number` and `card_last_four`.
    5.  **Output:** Confirm successful lock. Prompt if they need replacement instructions.

### 2. Procedure: Tra Cứu Số Dư Tài Khoản / Thẻ (`proc_check_balance`)
*   **Trigger:** "Xem số dư", "Tôi còn bao nhiêu tiền", "Tài khoản có bao nhiêu".
*   **Security:** Verify CCCD (with session memory bypass).
*   **Steps:**
    1.  **Session Check:** Verify CCCD if not already authenticated.
    2.  **Card Fetch:** Execute `get_customer_cards`.
    3.  **Selection:**
        *   *If 1 card/account:* Fetch and read balance directly.
        *   *If multiple cards/accounts:* Read the active cards and ask which one they want to check.
    4.  **Action:** Call `get_account_balance` with `cccd_number` and `card_last_four`.
    5.  **Output:** Read the balance slowly and clearly (e.g., "Dạ, số dư khả dụng của thẻ đuôi 1234 là mười lăm triệu đồng ạ").

### 3. Procedure: Tra Cứu Lịch Sử Giao Dịch (`proc_recent_tx`)
*   **Trigger:** "Xem lịch sử giao dịch", "Tôi mới chuyển khoản/nhận tiền được chưa", "Tra cứu giao dịch gần đây".
*   **Security:** Verify CCCD.
*   **Steps:**
    1.  **Session Check:** Verify CCCD if not already authenticated.
    2.  **Card/Account Fetch:** Execute `get_customer_cards`.
    3.  **Selection:** Ask user to select the card/account (if multiple exist).
    4.  **Action:** Call `get_recent_transactions` (returns last 3 transactions: date, amount, type, content).
    5.  **Output:** Read out the transactions clearly: "Dạ, giao dịch gần nhất của anh/chị là vào ngày 22 tháng 8, trừ hai trăm nghìn đồng phí dịch vụ ạ...".

### 4. Procedure: Mở Khóa Thẻ Tạm Thời (`proc_unlock_card`)
*   **Trigger:** "Mở khóa thẻ", "Mở lại thẻ bị khóa".
*   **Security:** High Risk. Requires CCCD validation + OTP SMS verification.
*   **Steps:**
    1.  **Session Check:** Verify CCCD if not already authenticated.
    2.  **Card Fetch:** Execute `get_customer_cards` to list locked cards.
    3.  **Selection:** Ask user to choose which locked card to reopen.
    4.  **OTP Verification:**
        *   Call `send_otp` to send a 6-digit code to the user's registered phone number.
        *   Ask the user to read the OTP.
        *   Call `verify_otp` with the entered code. If verification fails twice, transfer to a human agent.
    5.  **Action:** Call `execute_card_unlock` with `cccd_number` and `card_last_four`.
    6.  **Output:** Confirm card is active and ready for use.

> [!CAUTION]
> **Safety Rule:** Never ask the user to read out their CVV/CVC, Card Expiration, or password. OTP verification is strictly handled via the secure SMS channel.

### 5. Procedure: Kích Hoạt Thẻ Mới (`proc_activate_card`)
*   **Trigger:** "Kích hoạt thẻ mới nhận", "Active thẻ mới".
*   **Security:** High Risk. Requires CCCD validation + OTP SMS verification.
*   **Steps:**
    1.  **Session Check:** Verify CCCD if not already authenticated.
    2.  **Card Fetch:** Execute `get_customer_cards` to find pending/inactive cards.
    3.  **Selection:** Confirm the last 4 digits of the new card.
    4.  **OTP Verification:** Call `send_otp` and verify via `verify_otp`.
    5.  **Action:** Call `execute_card_activation` with `cccd_number` and `card_last_four`.
    6.  **Output:** Confirm activation and remind them to change the initial PIN at an ATM or App.

### 6. Procedure: Đăng Ký / Hủy SMS Banking (`proc_sms_banking`)
*   **Trigger:** "Đăng ký nhận tin nhắn biến động số dư", "Hủy dịch vụ SMS banking".
*   **Security:** Verify CCCD.
*   **Steps:**
    1.  **Session Check:** Verify CCCD.
    2.  **Action:** Call `toggle_sms_banking` with `cccd_number` and action type (`register` or `unregister`).
    3.  **Output:** Confirm status change and outline fee structures (if any).

### 7. Procedure: Báo Cáo Giao Dịch Gian Lận (`proc_fraud_report`)
*   **Trigger:** "Tôi bị trừ tiền lạ", "Giao dịch không phải tôi làm", "Ai đó hack tài khoản tôi".
*   **Security:** Emergency Flow.
*   **Steps:**
    1.  **Immediate Lock:** Offer to lock the card immediately using `execute_card_lock` to prevent further loss.
    2.  **Verify/Confirm:** Get the last 4 digits of the affected card. Lock it.
    3.  **Transfer:** Immediately initiate human handoff `system_tool_transfer` to the Fraud/Risk Management team.

---

## 3. Human Handoff (Fallback) Standards
For any of the following scenarios, the agent must immediately route to a human agent:
1.  **Double Authentication Failure:** User fails CCCD check twice.
2.  **Double OTP Failure:** User fails OTP input twice.
3.  **Out-of-Scope Requests:** Corporate accounts, loan applications, complex interest rate negotiations.
4.  **Sentiment Trigger:** User becomes extremely angry, uses profanity, or insists on talking to a human.
