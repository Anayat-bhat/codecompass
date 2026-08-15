import uuid
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter, Language

# Map language strings to LangChain's Language enum
LANGUAGE_MAP: Dict[str, Language] = {
    "python": Language.PYTHON,
    "js": Language.JS,
    "ts": Language.TS,
    "html": Language.HTML,
    "css": Language.HTML,  # Uses CSS/HTML block structures
    "cpp": Language.CPP,
    "go": Language.GO,
    "java": Language.JAVA,
    "rust": Language.RUST,
    "markdown": Language.MARKDOWN,
}

def create_code_splitter(language_str: str, chunk_size: int = 1000, chunk_overlap: int = 150) -> RecursiveCharacterTextSplitter:
    """
    Creates a code-aware text splitter tailored to the language AST structures if available.
    """
    lang_enum = LANGUAGE_MAP.get(language_str.lower())
    if lang_enum:
        return RecursiveCharacterTextSplitter.from_language(
            language=lang_enum,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )

def chunk_file(doc: Dict[str, Any], chunk_size: int = 1000, chunk_overlap: int = 150) -> List[Dict[str, Any]]:
    """
    Splits a single file document into AST-aware code chunks with metadata.
    """
    file_path = doc.get("path", "unknown")
    content = doc.get("content", "")
    language = doc.get("language", "text")
    repo = doc.get("repo", "unknown")

    if not content.strip():
        return []

    splitter = create_code_splitter(language, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    text_chunks = splitter.split_text(content)

    chunks = []
    for idx, text in enumerate(text_chunks):
        # Generate a unique deterministic ID for the vector DB chunk
        chunk_id = f"{repo}_{file_path}_{idx}".replace("/", "_").replace(".", "_")
        
        chunks.append({
            "id": chunk_id,
            "text": text,
            "metadata": {
                "file_path": file_path,
                "language": language,
                "repo": repo,
                "chunk_index": idx,
                "total_chunks": len(text_chunks),
                "char_length": len(text)
            }
        })

    return chunks

def chunk_repository_documents(documents: List[Dict[str, Any]], chunk_size: int = 1000, chunk_overlap: int = 150) -> List[Dict[str, Any]]:
    """
    Processes all documents retrieved from a repository and flattens chunks.
    """
    all_chunks = []
    for doc in documents:
        file_chunks = chunk_file(doc, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        all_chunks.extend(file_chunks)
    return all_chunks
