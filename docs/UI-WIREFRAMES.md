# UI & User Flow: CodeCompass

## 1. User Journey
1. **Landing:** User arrives at the CodeCompass web app. They see a clean, premium landing screen with a single input bar.
2. **Action:** User pastes a public GitHub URL and hits Enter.
3. **Loading:** A sleek loading state appears, detailing the steps (Fetching files -> Chunking code -> Generating brief).
4. **Dashboard:** The main interface loads.
   - **Left Panel:** Displays the visual, expandable file tree.
   - **Right Panel (Tabs):** Defaults to the "Onboarding Brief" tab, showing the AI-generated architecture summary.
5. **Interaction:** User clicks the "Chat" tab and asks a specific question.
6. **Result:** The AI streams the answer, citing specific files which the user can visually cross-reference in the file tree on the left.

## 2. Screen Flow & Wireframes

### Screen 1: Home (Landing)
```text
+---------------------------------------------------------+
|  [Logo] CodeCompass                                     |
|                                                         |
|                                                         |
|             Navigate Any Codebase, Instantly.           |
|             Paste a GitHub URL to get started.          |
|                                                         |
|      [ https://github.com/user/repo............. ]      |
|                        [ Analyze ]                      |
|                                                         |
+---------------------------------------------------------+
```
*Purpose:* Zero-friction entry point. Focus entirely on the core action.

### Screen 2: Loading State
```text
+---------------------------------------------------------+
|                                                         |
|                     Analyzing Repo...                   |
|                                                         |
|                  [=================   ]                 |
|                                                         |
|             ✓ Fetching repository tree...               |
|             ✓ Filtering valid source files...           |
|             ⟳ Chunking and generating embeddings...     |
|                                                         |
+---------------------------------------------------------+
```
*Purpose:* Manage expectations. Ingesting a repo takes 10-30 seconds. Detailed loading steps prevent the user from leaving.

### Screen 3: Main Dashboard
```text
+---------------------------------------------------------+
| [Logo] CodeCompass | Repo: user/repo           [New]    |
+--------------------+------------------------------------+
| FILE EXPLORER      | [ Onboarding Brief ] [ Chat ]      |
|                    |                                    |
| 📁 src             | # Architecture Overview            |
|   📄 main.py       | This repository is a FastAPI       |
|   📁 utils         | web service that...                |
|     📄 helpers.py  |                                    |
| 📁 tests           | # Setup Instructions               |
|   📄 test_main.py  | 1. pip install -r requirements.txt |
| 📄 README.md       | 2. uvicorn main:app --reload       |
| 📄 requirements.txt|                                    |
|                    |                                    |
|                    |                                    |
+--------------------+------------------------------------+
```
*Purpose:* Provide complete context. The user has the macro view (File Tree) and the micro view (Brief/Chat) side-by-side.

### Screen 4: Chat Interface (Right Panel)
```text
+--------------------+------------------------------------+
| FILE EXPLORER      | [ Onboarding Brief ] [ Chat ]      |
|                    |                                    |
| 📁 src             |                                    |
|   📄 main.py       | [User]: How does authentication    |
| ...                |         work here?                 |
|                    |                                    |
|                    | [AI]: Authentication is handled    |
|                    | via JWT tokens in the middleware.  |
|                    | You can see the logic inside       |
|                    | `src/utils/auth.py` (Lines 12-45). |
|                    |                                    |
|                    | ---------------------------------- |
|                    | [ Ask a question about the code..] |
+--------------------+------------------------------------+
```
*Purpose:* Natural language interaction with clear citations to the file tree.
