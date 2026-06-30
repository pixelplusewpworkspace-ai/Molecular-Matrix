import os
import re

directory = 'd:\\Molecular Matrix'
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

# The perfect Trustpilot SVG stars
big_star = '<svg viewBox="0 0 512 512" class="w-3.5 h-3.5 fill-white"><path d="M512 198.5l-195.3-29L256 0 195.3 169.5 0 198.5l141.2 138L108 512l148-77.8L404 512l-33.2-175.5z"/></svg>'
small_star = '<svg viewBox="0 0 512 512" class="w-2.5 h-2.5 fill-white"><path d="M512 198.5l-195.3-29L256 0 195.3 169.5 0 198.5l141.2 138L108 512l148-77.8L404 512l-33.2-175.5z"/></svg>'

old_hero_star = '<i data-lucide="star" class="w-4 h-4 text-white fill-white"></i>'

floating_widget = f"""    <!-- Floating Trustpilot Widget -->
    <a href="https://www.trustpilot.com/review/molecularmatrix.online" target="_blank" class="fixed bottom-6 right-6 z-[90] flex items-center space-x-3 bg-white px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-black/5 hover:-translate-y-1 transition-all duration-300 group">
        <div class="flex items-center space-x-0.5">
            <div class="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">{small_star}</div>
            <div class="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">{small_star}</div>
            <div class="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">{small_star}</div>
            <div class="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">{small_star}</div>
            <div class="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">{small_star}</div>
        </div>
        <div class="flex items-center space-x-1.5 border-l border-black/10 pl-2.5">
            <span class="font-bold text-[12px] tracking-wide" style="color: #1c1c1c;">Trustpilot</span>
        </div>
    </a>
"""

for file in html_files:
    filepath = os.path.join(directory, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update hero section star in use-cases.html
    if file == 'use-cases.html':
        content = content.replace(old_hero_star, big_star)
        
    # 2. Remove old floating widget if it exists
    # Find start: <!-- Floating Trustpilot Widget -->
    # Find end: </a>
    if "<!-- Floating Trustpilot Widget -->" in content:
        start_idx = content.find("<!-- Floating Trustpilot Widget -->")
        end_idx = content.find("</a>", start_idx) + 4
        # Also remove any trailing newlines before </body>
        content = content[:start_idx] + content[end_idx:]
        
    # 3. Insert new floating widget before </body>
    if "</body>" in content:
        content = content.replace("</body>", floating_widget + "</body>")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated all HTML files successfully.")
