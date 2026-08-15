import os
import re
import requests
from typing import List, Dict, Tuple, Optional

# Supported code extensions and their normalized language identifiers
SUPPORTED_EXTENSIONS: Dict[str, str] = {
    ".py": "python",
    ".js": "js",
    ".jsx": "js",
    ".ts": "ts",
    ".tsx": "ts",
    ".html": "html",
    ".css": "css",
    ".json": "json",
    ".md": "markdown",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".c": "cpp",
    ".cpp": "cpp",
    ".h": "cpp",
}

# Directories and files to explicitly ignore
IGNORED_DIRS = {
    "node_modules", ".git", ".github", "venv", "env", "__pycache__",
    "dist", "build", ".next", ".vscode", ".idea", "coverage", "vendor"
}

IGNORED_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock",
    "Cargo.lock", "Pipfile.lock", ".DS_Store"
}

def parse_github_url(url: str) -> Tuple[str, str]:
    """
    Extracts owner and repo name from a GitHub repository URL.
    Supports formats:
      - https://github.com/owner/repo
      - https://github.com/owner/repo.git
      - owner/repo
    """
    url = url.strip()
    if url.endswith(".git"):
        url = url[:-4]
    
    # Regex match for standard github URL
    match = re.search(r"github\.com/([^/]+)/([^/]+)", url)
    if match:
        return match.group(1), match.group(2)
    
    # Handle shorthand owner/repo
    parts = [p for p in url.split("/") if p]
    if len(parts) == 2:
        return parts[0], parts[1]
    
    raise ValueError(f"Invalid GitHub URL or repository format: '{url}'. Expected format: 'https://github.com/owner/repo'")

def get_headers() -> Dict[str, str]:
    """Build request headers with authorization token if available."""
    token = os.getenv("GITHUB_TOKEN", "").strip()
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token and token != "your_github_token_here":
        headers["Authorization"] = f"token {token}"
    return headers

def is_target_file(file_path: str) -> bool:
    """Checks if a file path is a supported source code file and not ignored."""
    parts = file_path.split("/")
    # Check directory ignores
    for part in parts[:-1]:
        if part in IGNORED_DIRS or part.startswith("."):
            return False
            
    filename = parts[-1]
    if filename in IGNORED_FILES or filename.startswith("."):
        return False
        
    ext = os.path.splitext(filename)[1].lower()
    return ext in SUPPORTED_EXTENSIONS

def fetch_repository_files(repo_url: str, max_files: int = 150) -> List[Dict[str, str]]:
    """
    Fetches the repository file structure via GitHub API and retrieves raw contents
    for filtered source files up to max_files limit.
    """
    owner, repo = parse_github_url(repo_url)
    headers = get_headers()
    
    # 1. Fetch main/default branch
    repo_info_url = f"https://api.github.com/repos/{owner}/{repo}"
    resp = requests.get(repo_info_url, headers=headers)
    if resp.status_code == 404:
        raise ValueError(f"GitHub repository '{owner}/{repo}' not found or is private.")
    elif resp.status_code != 200:
        raise ValueError(f"GitHub API Error ({resp.status_code}): {resp.json().get('message', 'Failed to fetch repository info')}")
        
    default_branch = resp.json().get("default_branch", "main")
    
    # 2. Fetch recursive git tree
    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
    tree_resp = requests.get(tree_url, headers=headers)
    if tree_resp.status_code != 200:
        raise ValueError(f"Failed to fetch repository tree: {tree_resp.json().get('message', 'Tree fetch failed')}")
        
    tree_data = tree_resp.json()
    tree = tree_data.get("tree", [])
    
    # Filter files
    filtered_items = [
        item for item in tree 
        if item.get("type") == "blob" and is_target_file(item.get("path", ""))
    ][:max_files]
    
    documents = []
    for item in filtered_items:
        path = item["path"]
        ext = os.path.splitext(path)[1].lower()
        language = SUPPORTED_EXTENSIONS.get(ext, "text")
        
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{path}"
        raw_resp = requests.get(raw_url, headers=headers)
        if raw_resp.status_code == 200:
            # Skip empty files or files that are too huge (> 500KB)
            if len(raw_resp.text.strip()) > 0 and len(raw_resp.content) < 500000:
                documents.append({
                    "path": path,
                    "content": raw_resp.text,
                    "language": language,
                    "repo": f"{owner}/{repo}"
                })
                
    return documents
