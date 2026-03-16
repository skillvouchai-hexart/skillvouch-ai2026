import os

file_path = 'server.js'
with open(file_path, 'r') as f:
    content = f.read()

# Pattern for /api/resume/analyze PDF parsing
search_pdf = """      } else if (fileName.endsWith('.pdf')) {
        log(`Parsing PDF: pdf type=${typeof pdf}, hasPDFParse=${!!(pdf && pdf.PDFParse)}`);
        if (pdf && typeof pdf.PDFParse === 'function') {
          const parser = new pdf.PDFParse({ data: buffer });
          try {
            const result = await parser.getText();
            resumeText = result.text;
          } finally {
            await parser.destroy();
          }
        } else if (typeof pdf === 'function') {
           log('Falling back to pdf() function call for v1 API');
           const data = await pdf(buffer);
           resumeText = data.text;
        } else {
          log('ERROR: pdf is neither a function nor contains PDFParse constructor');
          throw new Error('PDF parsing library configuration error');
        }
      } else {"""

# Replace for first occurrence (resume analyzer)
# Note: I'll actually replace both occurrences if they match the pattern, or specifically target the first one.
# Given they might be slightly different now after my previous attempt, let's look at the file content again.

print("Search PDF pattern length:", len(search_pdf))

# Replacement with TXT support
replace_pdf_txt = """      } else if (fileName.endsWith('.pdf')) {
        log(`Parsing PDF: pdf type=${typeof pdf}, hasPDFParse=${!!(pdf && pdf.PDFParse)}`);
        try {
          if (pdf && typeof pdf.PDFParse === 'function') {
            const parser = new pdf.PDFParse({ data: buffer });
            try {
              const result = await parser.getText();
              resumeText = result.text;
            } finally {
              await parser.destroy();
            }
          } else if (typeof pdf === 'function') {
             const data = await pdf(buffer);
             resumeText = data.text;
          } else if (pdf && typeof pdf.default === 'function') {
             const data = await pdf.default(buffer);
             resumeText = data.text;
          } else {
             throw new Error('PDF parsing library not responding. Please try DOCX format.');
          }
        } catch (pdfErr) {
          log(`PDF Extraction Failed: ${pdfErr.message}`);
          throw new Error(`Technical error reading PDF: ${pdfErr.message}`);
        }
      } else if (fileName.endsWith('.txt')) {
        resumeText = buffer.toString('utf8');
      } else {"""

new_content = content.replace(search_pdf, replace_pdf_txt)

if content == new_content:
    print("No changes made. Search string not found.")
else:
    with open(file_path, 'w') as f:
        f.write(new_content)
    print(f"Successfully updated {content.count(search_pdf)} occurrences.")
