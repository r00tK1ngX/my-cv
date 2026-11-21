"""Exercise the actual preview script in a disposable fixture, never production out/."""
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.request

WORKSPACE = Path(__file__).resolve().parents[2]

class PreviewContainmentTest(unittest.TestCase):
    def test_preview_does_not_follow_escaping_symlink(self):
        parent = WORKSPACE / 'qa/regression-fixtures'
        parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='preview-', dir=parent) as temp:
            root = Path(temp)
            (root / 'scripts').mkdir()
            shutil.copy2(WORKSPACE / 'scripts/serve-export.py', root / 'scripts/serve-export.py')
            (root / 'out').mkdir()
            (root / 'out/index.html').write_text('<h1>Fixture</h1>')
            (root / 'secret.txt').write_text('PRIVATE-TEST-FIXTURE')
            (root / 'out/escape.txt').symlink_to(root / 'secret.txt')
            with socket.socket() as probe:
                probe.bind(('127.0.0.1', 0))
                port = probe.getsockname()[1]
            process = subprocess.Popen([sys.executable, '-B', str(root / 'scripts/serve-export.py')], cwd=root, env=dict(os.environ, PORT=str(port)), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            try:
                base = f'http://127.0.0.1:{port}'
                for _ in range(100):
                    try:
                        with urllib.request.urlopen(base + '/', timeout=.5) as response:
                            self.assertEqual(response.status, 200)
                        break
                    except (urllib.error.URLError, ConnectionError):
                        time.sleep(.02)
                else:
                    self.fail('Preview did not start')
                try:
                    with urllib.request.urlopen(base + '/escape.txt', timeout=2) as response:
                        status, body = response.status, response.read()
                except urllib.error.HTTPError as error:
                    with error:
                        status, body = error.code, error.read()
                self.assertIn(status, (400, 403, 404), 'Preview served an escaping symlink')
                self.assertNotIn(b'PRIVATE-TEST-FIXTURE', body)
            finally:
                process.terminate()
                process.wait(timeout=5)

if __name__ == '__main__':
    unittest.main()
