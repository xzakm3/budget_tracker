# server.py
import sys
from mcp.server.fastmcp import FastMCP
import subprocess, tempfile, textwrap

mcp = FastMCP("python-runner")

@mcp.tool()
def run_python(code: str) -> str:
    """Execute Python code in a temp file and return stdout/stderr."""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(textwrap.dedent(code))
        path = f.name
    proc = subprocess.run(["python", path], capture_output=True, text=True, timeout=30)
    return proc.stdout

if __name__ == "__main__":
    mcp.run()
