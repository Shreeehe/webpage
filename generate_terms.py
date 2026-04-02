import re

# Read template strings from index.html
with open('/media/shri/Files/Files/Business/webpage_tracked/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract header (up to </header>)
head_match = re.search(r'(<!DOCTYPE html>.*?</header>)', index_html, re.DOTALL)
header_html = head_match.group(1).replace('href="#', 'href="index.html#')

# Extract footer (from <footer> to end)
footer_match = re.search(r'(<footer>.*</html>)', index_html, re.DOTALL)
footer_html = footer_match.group(1).replace('href="#', 'href="index.html#')

footer_html = footer_html.replace('<a href="index.html#">Terms of Service</a>', '<a href="terms.html">Terms of Service</a>')

with open('/media/shri/Files/Files/Business/webpage_tracked/SERVICE CONSENT FORM.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract exactly SECTION B
section_b = content.split('SECTION B\n// TERMS AND CONDITIONS OF SERVICE')[1].split('// \nDECLARATION & SIGNATURE')[0]

html_body = f"""
    <section class="section" style="padding-top: 150px; background-color: #f8fafc;">
        <div class="container" style="max-width: 900px; margin: 0 auto; background: white; padding: 50px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div class="section-header text-center fade-in">
                <h1 style="color: var(--primary-dark); font-size: 36px; margin-bottom: 20px;">Terms and Conditions of Service</h1>
                <div class="accent-line" style="margin: 0 auto 30px;"></div>
                <p style="color: var(--text-secondary); line-height: 1.8;">This document constitutes a binding Service Agreement between <strong>AKSRAYA HEALTH CARE</strong> and the Client. By engaging our services, you agree to abide by all the terms and conditions set out below.</p>
            </div>
            
            <div class="terms-content" style="color: var(--text-secondary); line-height: 1.8;">
"""

clauses = re.split(r'-{70}\n(CLAUSE \d+ — [^\n]+)\n-{70}\n', section_b)
for i in range(1, len(clauses), 2):
    title = clauses[i].strip()
    body = clauses[i+1].strip()
    
    # Format the body
    body_html = ""
    paragraphs = body.split('\n\n\n')
    for p in paragraphs:
        p = p.strip()
        if not p: continue
        # Handle lists or indented text
        p = p.replace('\n     ', ' ') # remove wrapping indentation
        p = p.replace('\n', '<br>')
        body_html += f'<p style="margin-bottom: 20px;">{p}</p>'
    
    html_body += f"""
                <h3 style="color: var(--primary-color); margin-top: 40px; margin-bottom: 15px; font-size: 22px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">{title}</h3>
                {body_html}
"""

html_body += """
            </div>
        </div>
    </section>
"""

with open('/media/shri/Files/Files/Business/webpage_tracked/terms.html', 'w', encoding='utf-8') as f:
    f.write(header_html + "\n" + html_body + "\n" + footer_html)

print("Generated terms.html")
