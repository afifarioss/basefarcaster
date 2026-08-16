import subprocess, json

def run(cmd):
    try:
        return subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=20).stdout.strip()
    except subprocess.TimeoutExpired:
        return '(timed out)'
    except Exception as e:
        return f'ERROR: {e}'

print('=== x402 references in code ===')
out = run('grep -rli "x402" --include=*.ts --include=*.tsx --include=*.json --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next .')
print(out or '(none found)')

print()
print('=== vercel link check ===')
print(run('ls -la .vercel 2>/dev/null') or '(.vercel folder not found — is this dir linked to a Vercel project?)')
print(run('vercel --version') or '(vercel CLI not installed or not on PATH)')
