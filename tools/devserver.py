#!/usr/bin/env python3
# Static file server for local dev that disables caching, so edited ES modules
# (imported by bare path) are always re-fetched on reload. Plain
# `python3 -m http.server` sends no Cache-Control and the browser then caches
# bare-import submodules, serving stale code after edits.
#
# Usage: python3 tools/devserver.py [port]   (default 4173)
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"dev server (no-cache) on http://localhost:{PORT}")
    httpd.serve_forever()
