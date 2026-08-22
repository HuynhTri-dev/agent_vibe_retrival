<!--
name: tools_procedure_list.md
description: Requirements for server-side webhook tools and deterministic agent procedures for banking CSKH.
-->
# Tools & Procedures Requirements

Based on the agent requirements, the Agent needs a mix of Server-side Tools to integrate with the core banking system (CBS) and Procedures to enforce deterministic workflows.

## 1. Server-side Webhook Tools

These tools need to be configured in the ElevenLabs dashboard to hit your backend API endpoints.

| Tool ID | Tool Name | Description | Inputs |
| :--- | :--- | :--- | :--- |
| `tool_verify_cccd` | `verify_customer_id` | Verifies the CCCD provided by the user against the customer database. | `cccd_number` (string) |
| `tool_get_cards` | `get_customer_cards` | Retrieves the list of cards associated with the verified CCCD (type, last 4 digits, status). | `cccd_number` (string) |
| `tool_lock_card` | `execute_card_lock` | Locks a specific card of the user. Fails if user is not verified. | `cccd_number` (string), `card_last_four` (string) |
| `tool_get_balance` | `get_account_balance` | Retrieves available balance for a specific card of the authenticated user. | `cccd_number` (string), `card_last_four` (string) |
| `sys_transfer` | `system_tool_transfer` | (Built-in) Routes the call to a human agent. | N/A |
| `sys_end_call` | `system_tool_end` | (Built-in) Terminates the call. | N/A |

---

## 2. Procedures Design

### Procedure 1: Báo Mất Thẻ / Khóa Thẻ Khẩn Cấp (Fast-Track)
*   **Type:** Structured Procedure (Deterministic)
*   **Trigger:** "When the user says they lost their wallet, lost their card, or asks to lock/block their card immediately."
*   **Steps:**
    1.  **Ask:** "Ask the user to provide their CCCD number to authenticate (if not already authenticated in this session)."
    2.  **Tool:** `verify_customer_id`.
        *   *On Failure (Fallback):* If CCCD doesn't match or fails, call `system_tool_transfer` to handoff to a human agent immediately to avoid delays.
    3.  **Tool:** `get_customer_cards`.
        *   Retrieve the list of cards associated with the CCCD.
    4.  **Identify Card to Lock:**
        *   *If the customer has exactly 1 card:* Ask to confirm before locking (e.g., "Dạ, hệ thống ghi nhận anh/chị có một thẻ [Loại thẻ] đuôi [4 số cuối]. Anh/chị có muốn khóa thẻ này không ạ?").
        *   *If the customer has multiple cards:* List the active/lockable cards (e.g., "Dạ, em thấy mình đang có [N] thẻ: thẻ [Loại thẻ 1] đuôi [4 số cuối 1] và thẻ [Loại thẻ 2] đuôi [4 số cuối 2]... Anh/chị muốn khóa thẻ nào ạ?") và yêu cầu khách hàng cung cấp 4 số cuối của thẻ cần khóa.
    5.  **Tool:** `execute_card_lock`.
        *   Provide both `cccd_number` and `card_last_four`.
    6.  **Say:** "Dạ thẻ [Loại thẻ] đuôi [4 số cuối] của anh/chị đã được khóa thành công và an toàn ạ."
    7.  **System Tool:** `end_call` (or ask if they need any other assistance).

### Procedure 2: Tra Cứu Thông Tin Tài Khoản / Số Dư
*   **Type:** Structured Procedure (Deterministic)
*   **Trigger:** "When the user asks to check their account balance, how much money is left, or their card/account balance."
*   **Steps:**
    1.  **Ask:** "Ask the user to provide their CCCD for security verification before checking the balance (if not already authenticated in this session)."
    2.  **Tool:** `verify_customer_id`.
        *   *On Failure (Fallback):* Ask the user to repeat the number. If it fails again, transfer to a human.
    3.  **Tool:** `get_customer_cards`.
        *   Retrieve the list of cards associated with the CCCD.
    4.  **Identify Card to Check:**
        *   *If the customer has exactly 1 card:* Proceed directly to check balance.
        *   *If the customer has multiple cards:* List the active cards (e.g., "Dạ, em thấy mình có [N] thẻ: thẻ [Loại thẻ 1] đuôi [4 số cuối 1] và thẻ [Loại thẻ 2] đuôi [4 số cuối 2]... Anh/chị muốn kiểm tra số dư của thẻ nào ạ?") và yêu cầu khách hàng cung cấp 4 số cuối của thẻ cần tra cứu.
    5.  **Tool:** `get_account_balance`.
        *   Provide both `cccd_number` and `card_last_four`.
    6.  **Tell:** "Read the available balance of the specified card to the user clearly."

### Procedure 3: Unsupported Banking Operations
*   **Type:** Free-form Procedure
*   **Trigger:** "When the user asks about banking services that the agent is not trained to handle (e.g., corporate loans, opening L/C)."
*   **Content:**
    ```markdown
    Tell the user: "Dạ đối với yêu cầu này, em chưa được cấp quyền hỗ trợ trực tiếp. Để thông tin chính xác nhất, em xin phép chuyển tiếp cuộc trò chuyện của mình đến chuyên viên tư vấn của ngân hàng ạ."
    Then execute [system_tool id="transfer_call"].
    ```

