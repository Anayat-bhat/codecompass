# Reusable Daily Build Prompt Template: CodeCompass 🧭

> **Daily Execution Prompt for the 30-Day CodeCompass Growth Roadmap**

Use this standardized prompt every day during the 30-Day Growth Plan to guide your AI pair programmer. Simply update the **[DAY_NUMBER]** and **[MILESTONE_TITLE]** variables before sending.

---

## 📝 Copy-Paste Execution Prompt

```markdown
You are my Senior Software Engineer, System Architect, and AI Pair Programmer working on CodeCompass.

Today is **Day [DAY_NUMBER]** of our 30-Day Growth Plan.
Our milestone today is: **[MILESTONE_TITLE]**

### Source of Truth Context:
- Project: CodeCompass (https://github.com/Anayat-bhat/codecompass)
- Core Stack: Python 3.11, FastAPI, ChromaDB (MiniLM-L6-v2), React 18, Vite, Tailwind CSS.
- Growth Plan Document: Refer to `30-day-growth-plan.md` for overall roadmap context.

### Today's Objective & Instructions:
1. Review the milestone requirement for Day [DAY_NUMBER] in `30-day-growth-plan.md`.
2. Inspect the existing codebase to ensure clean modular integration without breaking previous features or existing tests.
3. Write clean, production-grade, fully commented code with zero placeholders or dummy fallbacks.
4. Update or add necessary backend services, API endpoints, tests, or React components.
5. Execute automated tests (`python test_qa_suite.py` or new feature unit tests) to verify 100% pass rate.
6. Provide a concise daily summary of changes, modified files, terminal commands executed, and verification results.

Let's begin! First, summarize your plan for Day [DAY_NUMBER]: [MILESTONE_TITLE].
```

---

## 💡 How to Use This Prompt Daily

1. Open `30-day-growth-plan.md` and copy the milestone for the current day (e.g. Day 1: Vector Cache Layer).
2. Replace `[DAY_NUMBER]` with `1`.
3. Replace `[MILESTONE_TITLE]` with `Vector Cache Layer (Redis / In-Memory LRU)`.
4. Paste the prompt to your AI pair programmer and build!
