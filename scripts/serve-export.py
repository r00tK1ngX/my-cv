#!/usr/bin/env python3
"""Local-only static export preview. Does not expose repository files."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1] / 'out'
if not (ROOT / 'index.html').is_file():
    raise SystemExit('Build out/ first; no fallback to source root')

class ExportHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def allowed_target(self, target):
        target = Path(target)
        try:
            relative = target.relative_to(ROOT)
            current = ROOT
            if current.is_symlink():
                return False
            for part in relative.parts:
                current = current / part
                if current.is_symlink():
                    return False
            return target.resolve().is_relative_to(ROOT.resolve())
        except (OSError, ValueError, RuntimeError):
            return False

    def send_head(self):
        if '..' in unquote(self.path).split('/'):
            self.send_error(400)
            return None
        target = Path(self.translate_path(self.path))
        if not self.allowed_target(target):
            self.send_error(403)
            return None
        if target.is_dir():
            for name in ('index.html', 'index.htm'):
                if not self.allowed_target(target / name):
                    self.send_error(403)
                    return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def send_error(self, code, message=None, explain=None):
        if code == 404 and self.allowed_target(ROOT / '404.html') and (ROOT / '404.html').is_file():
            data = (ROOT / '404.html').read_bytes()
            self.send_response(404)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(data)
            return
        super().send_error(code, message, explain)

port = int(os.getenv('PORT', '4173'))
print(f'Serving static out/ at http://127.0.0.1:{port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', port), ExportHandler).serve_forever()
