import re

with open('backup.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
i = 0
while i < len(lines):
    line = lines[i]
    m = re.match(r'^COPY\s+(public\.\w+)\s+\(([^)]+)\)\s+FROM\s+stdin;$', line.strip())
    if m:
        table = m.group(1)
        cols = m.group(2)
        i += 1
        while i < len(lines) and lines[i].strip() != r'\.':
            data = lines[i].rstrip('\n\r')
            if data:
                vals = []
                for field in data.split('\t'):
                    if field == r'\N':
                        vals.append('NULL')
                    else:
                        f2 = field.replace("'", "''")
                        vals.append(f"'{f2}'")
                output.append(f"INSERT INTO {table} ({cols}) VALUES ({', '.join(vals)});\n")
            i += 1
        if i < len(lines):
            i += 1
    else:
        output.append(line)
        i += 1

with open('backup_inserts.sql', 'w', encoding='utf-8') as f:
    f.writelines(output)

print('Done - backup_inserts.sql created')
