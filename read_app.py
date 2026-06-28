path = r'D:\web development\Lampandglow.pk\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines, 1):
    if 625 <= i <= 650:
        print(f'{i}: {line}', end='')
