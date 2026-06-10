"""上传拼音游戏文件到阿里云 OSS"""
import oss2
import os
import sys

# OSS 配置（从环境变量读取，避免泄露到 Git）
ACCESS_KEY_ID = os.environ.get('ALIYUN_ACCESS_KEY_ID', '')
ACCESS_KEY_SECRET = os.environ.get('ALIYUN_ACCESS_KEY_SECRET', '')
BUCKET_NAME = os.environ.get('ALIYUN_OSS_BUCKET', 'pinyingame-hk')
ENDPOINT = os.environ.get('ALIYUN_OSS_ENDPOINT', 'https://oss-cn-hongkong.aliyuncs.com')

# 本地目录和 OSS 前缀
LOCAL_DIR = '/Users/xinzhang/Documents/pinyingame'
OSS_PREFIX = 'pinyingame/'

# 排除的文件/目录
EXCLUDE = {'.git', '.venv', 'node_modules', '.vercel', 'tools', '__pycache__',
           '.env.local', '.vercelignore', '.gitignore', 'vercel.json',
           'upload_to_oss.py', '.DS_Store', 'package-lock.json', 'package.json',
           '使用说明.md'}

auth = oss2.Auth(ACCESS_KEY_ID, ACCESS_KEY_SECRET)
bucket = oss2.Bucket(auth, ENDPOINT, BUCKET_NAME)

uploaded = 0
failed = 0
skipped = 0

for root, dirs, files in os.walk(LOCAL_DIR):
    # 过滤排除目录
    dirs[:] = [d for d in dirs if d not in EXCLUDE]
    
    for fname in files:
        if fname in EXCLUDE:
            skipped += 1
            continue
        
        local_path = os.path.join(root, fname)
        relative = os.path.relpath(local_path, LOCAL_DIR)
        oss_path = OSS_PREFIX + relative
        
        try:
            content_type = None
            if fname.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif fname.endswith('.css'):
                content_type = 'text/css; charset=utf-8'
            elif fname.endswith('.js'):
                content_type = 'application/javascript; charset=utf-8'
            elif fname.endswith('.json'):
                content_type = 'application/json; charset=utf-8'
            elif fname.endswith('.mp3'):
                content_type = 'audio/mpeg'
            elif fname.endswith('.md'):
                content_type = 'text/markdown; charset=utf-8'
            
            headers = {
                'Cache-Control': 'public, max-age=3600',
            }
            if content_type:
                headers['Content-Type'] = content_type
            
            bucket.put_object_from_file(oss_path, local_path, headers=headers)
            uploaded += 1
            if uploaded % 20 == 0:
                print(f'  已上传 {uploaded} 个文件...')
        except Exception as e:
            print(f'  ❌ 失败: {relative} — {e}')
            failed += 1

print(f'\n✅ 上传完成！')
print(f'   成功: {uploaded} 个文件')
print(f'   失败: {failed} 个文件')
print(f'   跳过: {skipped} 个文件')
print(f'\nOSS 路径: oss://{BUCKET_NAME}/{OSS_PREFIX}')
print(f'OSS 直连: http://{BUCKET_NAME}.{ENDPOINT.replace("https://", "")}/{OSS_PREFIX}index.html')
