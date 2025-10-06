# server.py
import sys
from mcp.server.fastmcp import FastMCP
import subprocess, tempfile, textwrap
import os

PORT = int(os.getenv("PORT", 8001))
mcp = FastMCP("python-runner", host="0.0.0.0", port=PORT)


@mcp.resource(uri="resource://jumptech_info")
def get_jumptech_info() -> str:
    """Get JUMP-TECH s. r. o. info"""
    return (
        "Address: JUMP-TECH s. r. o.,Kopčianska 10 851 01 Bratislava - Petržalka.\n"
        "Company was created at 8.4.2020"
        "IČO: 52922201"
        "DIČ: 2121231233"
        "IČ DPH: SK2121231233"
    )


@mcp.tool()
def run_python(code: str) -> str:
    """Execute Python code in a temp file and return stdout/stderr."""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(textwrap.dedent(code))
        path = f.name
    proc = subprocess.run(["python", path], capture_output=True, text=True, timeout=30)
    os.unlink(path)
    return proc.stdout


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
