# server.py
import sys
from mcp.server.fastmcp import FastMCP
import subprocess, tempfile, textwrap
import os

PORT = int(os.getenv("PORT", 8001))
mcp = FastMCP("python-runner", host="0.0.0.0", port=PORT)


@mcp.tool()
def run_python(code: str) -> str:
    """Execute Python code in a temp file and return stdout/stderr."""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(textwrap.dedent(code))
        path = f.name
    proc = subprocess.run(["python", path], capture_output=True, text=True, timeout=30)
    return proc.stdout


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
