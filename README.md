Copy as Markdown: alt+C (option+C on Mac) 

Use alt+C (option+C on Mac) to copy any web page as plaintext Markdown, preserving headings, links, images, codeblocks, tables, and lists with perfect formatting! Useful for LLMs, creating .md files, sending webpage content over messaging apps, etc.

-------------------------------------------------------------------------------------------

WHY?

When you copy anything, your clipboard keeps 3 formats: plaintext, and HTML and RTF (rich text format). In a browser, it's mostly plaintext and HTML, and only when you paste, the destination app determine for you which format you get to keep. 

This is fine when working with text editors like Notion, as they take the HTML and convert it to their internal format to preserve the structure of the document, but fastruting when working with LLMs, as the input textarea of LLMs interfaces often only take plaintext, making it easy to lose context like table structure, link urls, headings. 

Personally, to solve this problem before, I would copy from web page, paste to Notion, copy from Notion, paste to Sublime, and finally paste it into LLM interfaces.

HOW?

This Chrome extension solve this problem by using the same code that powers the markdown text editor - a library called "prosemirror", and directly take the selected HTML from your browser to generate the final markdown, and put it into your clipboard.

We bundled all the code directly into the Chrome extension so your copied content is securely processed by your browser, and it works completly offline!

-------------------------------------------------------------------------------------------

Roadmap:
2024/11/13: had the idea
2024/11/15: prototype development complete
2024/11/19: published

TODO:
- Improve relative URLs handling
- allow more key combination options
- beautify format further with tables

made by Mangle Kuo (https://manglekuo.com)

