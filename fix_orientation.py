import sys

filepath = 'd:\\Molecular Matrix\\use-cases.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Opens Right strings
opens_right_bubble = 'md:left-full top-1/2 -translate-y-1/2 md:ml-2.5 w-auto md:w-80 text-white rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,1)] opacity-0 pointer-events-none md:translate-x-4'
opens_right_pointer = 'right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-black" style="border-right-color: #000000'

# Opens Left strings
opens_left_bubble = 'md:right-full top-1/2 -translate-y-1/2 md:mr-2.5 w-auto md:w-80 text-white rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,1)] opacity-0 pointer-events-none md:-translate-x-4'
opens_left_pointer = 'left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-black" style="border-left-color: #000000'

def replace_case(c_id, to_dir, html):
    start_idx = html.find(f'id="{c_id}-bubble"')
    if start_idx == -1: return html
    end_idx = html.find('</div>', html.find('border-t-[10px]', start_idx)) + 6
    
    chunk = html[start_idx:end_idx]
    
    if to_dir == 'left': # means opens left
        chunk = chunk.replace(opens_right_bubble, opens_left_bubble)
        chunk = chunk.replace(opens_right_pointer, opens_left_pointer)
    else: # opens right
        chunk = chunk.replace(opens_left_bubble, opens_right_bubble)
        chunk = chunk.replace(opens_left_pointer, opens_right_pointer)
        
    return html[:start_idx] + chunk + html[end_idx:]

content = replace_case('case-07', 'left', content)
content = replace_case('case-06', 'right', content)
content = replace_case('case-05', 'left', content)
content = replace_case('case-04', 'right', content)
content = replace_case('case-03', 'left', content)
content = replace_case('case-02', 'right', content)
content = replace_case('case-01', 'left', content)

# update JS
content = content.replace("const leftBubbles = ['case-06', 'case-04', 'case-02'];", "const leftBubbles = ['case-07', 'case-05', 'case-03', 'case-01'];")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully')
