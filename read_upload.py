path = r'D:\web development\Lampandglow.pk\src\sections\ProfileSection.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines, 1):
    if 35 <= i <= 60:
        print(f'{i}: {line}', end='')
