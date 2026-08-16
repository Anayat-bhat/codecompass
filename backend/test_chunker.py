import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from services.chunker import chunk_file, chunk_repository_documents

def test_ast_chunker():
    print("========================================")
    print("Testing Day 5 AST Code-Aware Chunker")
    print("========================================")

    sample_python = """
class DatabaseManager:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.is_connected = False

    def connect(self):
        print(f"Connecting to {self.connection_string}...")
        self.is_connected = True
        return True

    def query(self, sql: str):
        if not self.is_connected:
            raise RuntimeError("Database not connected")
        return f"Executing {sql}"
"""

    sample_doc = {
        "path": "database/manager.py",
        "content": sample_python,
        "language": "python",
        "repo": "owner/sample-repo"
    }

    chunks = chunk_file(sample_doc, chunk_size=300, chunk_overlap=50)

    print(f"Successfully chunked file into {len(chunks)} chunks.")
    for idx, chunk in enumerate(chunks):
        print(f"\n--- Chunk {idx + 1} ---")
        print(f"ID: {chunk['id']}")
        print(f"Metadata: {chunk['metadata']}")
        print(f"Content:\n{chunk['text']}")

    assert len(chunks) > 0, "Chunking produced 0 chunks!"
    print("\n[SUCCESS] Milestone 1 Chunker Verification Passed!")

if __name__ == "__main__":
    test_ast_chunker()
