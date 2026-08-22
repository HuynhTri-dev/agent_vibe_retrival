# Knowledge Base (Hybrid RAG) Integration List

To support the CSKH Agent effectively, the following document categories should be ingested into the ElevenLabs Knowledge Base:

## 1. Document Requirements

| Document Name / Category | RAG Retrieval Type | Purpose |
| :--- | :--- | :--- |
| `faq_general.pdf / .md` | Semantic Search | Handle general banking inquiries (e.g., how to use the app, general branch hours, general service fees). |
| `card_policies.md` | Full Document / Keyword | Detailed information on card types, specific fees, and issuance processes. Required for exact policy matching. |
| `branch_locations.csv / .md` | Keyword Search | Look up specific branch addresses or ATM locations using exact location names or districts. |
| `security_guidelines.md` | Semantic Search | Guidelines on how to detect fraud, phishing, and what the bank's official contact channels are. |

## 2. RAG Configuration Settings
- **Activation Mode:** `Optional (Alpha)` is recommended over `Every turn`. This saves latency and tokens during casual greetings (e.g., "Alo", "Chào em") and avoids unnecessary lookups when the user is simply providing their CCCD for authentication.
- **Character Limit:** Set to ~10,000 - 15,000 characters to keep response latency low for real-time voice, ensuring the TTS starts speaking quickly.
- **Chunk Limit:** Set to 5-10 chunks to filter out noise and only inject the most relevant sections into the prompt context.

## 3. Data Ingestion & Maintenance
- **Method:** Use the ElevenLabs REST API (`/v1/convai/knowledge-base`) to automatically sync these documents from the bank's internal CMS.
- **Format:** Prefer Markdown (`.md`) with clear headings (`#`, `##`) and tables for structured data (like fees), as the LLM processes this format much better than raw PDFs.
