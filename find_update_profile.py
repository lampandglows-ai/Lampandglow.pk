path = r'D:\web development\Lampandglow.pk\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines, 1):
    if 'updateProfile' in line or 'update profile' in line.lower():
        print(f'{i}: {line}', end='')
