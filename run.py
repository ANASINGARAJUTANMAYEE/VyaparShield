#!/usr/bin/env python3
"""
run.py — Vyapar Shield project runner utility.

Usage:
    python run.py [command]

Commands:
    dev         Start the Next.js development server (default)
    build       Build the production bundle
    start       Start the production server
    test        Run Vitest unit tests
    lint        Run ESLint
    check       Run lint + tests together
    install     Install npm dependencies
    help        Show this help message

Examples:
    python run.py           # starts dev server
    python run.py dev       # starts dev server (explicit)
    python run.py test      # runs all unit tests
    python run.py check     # lint then test
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent
ENV_FILE = PROJECT_ROOT / ".env.local"
ENV_EXAMPLE = PROJECT_ROOT / ".env.example"

NPM = shutil.which("npm") or "npm"
NODE = shutil.which("node") or "node"

# ─── Helpers ──────────────────────────────────────────────────────────────────

def run(args: list[str], *, check: bool = True) -> int:
    """Run a subprocess command from the project root and return the exit code."""
    print(f"\n▶  {' '.join(args)}\n{'─' * 60}")
    result = subprocess.run(args, cwd=str(PROJECT_ROOT))
    if check and result.returncode != 0:
        print(f"\n✗  Command failed with exit code {result.returncode}")
        sys.exit(result.returncode)
    return result.returncode


def check_node():
    """Verify Node.js and npm are available."""
    if not shutil.which("node"):
        print("✗  Node.js not found. Install it from https://nodejs.org")
        sys.exit(1)
    if not shutil.which("npm"):
        print("✗  npm not found. It usually ships with Node.js.")
        sys.exit(1)


def check_env():
    """Warn if .env.local is missing so the developer knows what to do."""
    if not ENV_FILE.exists():
        print(
            f"\n⚠  .env.local not found.\n"
            f"   Copy {ENV_EXAMPLE.name} → .env.local and fill in your values before running.\n"
            f"   The dev server will still start but Supabase features will not work.\n"
        )


def check_node_modules():
    """Prompt the user to install dependencies if node_modules is absent."""
    if not (PROJECT_ROOT / "node_modules").exists():
        print("\n⚠  node_modules not found. Running npm install first…")
        run([NPM, "install"])


# ─── Commands ─────────────────────────────────────────────────────────────────

def cmd_install():
    check_node()
    print("Installing dependencies…")
    run([NPM, "install"])
    print("\n✓  Dependencies installed.")


def cmd_dev():
    check_node()
    check_env()
    check_node_modules()
    print("Starting Next.js development server…")
    print("Press Ctrl+C to stop.\n")
    run([NPM, "run", "dev"], check=False)


def cmd_build():
    check_node()
    check_env()
    check_node_modules()
    print("Building production bundle…")
    run([NPM, "run", "build"])
    print("\n✓  Build complete.")


def cmd_start():
    check_node()
    check_env()
    if not (PROJECT_ROOT / ".next").exists():
        print("⚠  No .next build folder found. Running build first…")
        cmd_build()
    print("Starting production server…")
    run([NPM, "run", "start"], check=False)


def cmd_test():
    check_node()
    check_node_modules()
    print("Running Vitest unit tests…")
    run([NPM, "run", "test"])
    print("\n✓  All tests passed.")


def cmd_lint():
    check_node()
    check_node_modules()
    print("Running ESLint…")
    run([NPM, "run", "lint"])
    print("\n✓  Lint passed.")


def cmd_check():
    cmd_lint()
    cmd_test()
    print("\n✓  All checks passed.")


def cmd_help():
    print(__doc__)


# ─── Dispatch ─────────────────────────────────────────────────────────────────

COMMANDS = {
    "dev": cmd_dev,
    "build": cmd_build,
    "start": cmd_start,
    "test": cmd_test,
    "lint": cmd_lint,
    "check": cmd_check,
    "install": cmd_install,
    "help": cmd_help,
    "--help": cmd_help,
    "-h": cmd_help,
}


def main():
    command = sys.argv[1] if len(sys.argv) > 1 else "dev"
    handler = COMMANDS.get(command)
    if handler is None:
        print(f"✗  Unknown command: {command!r}")
        print(f"   Available commands: {', '.join(k for k in COMMANDS if not k.startswith('-'))}")
        sys.exit(1)
    handler()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹  Stopped by user (Ctrl+C). Goodbye!")
        sys.exit(0)
