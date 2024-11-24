import { convertHTMLToMarkdown } from "./htmlToProseMirror";
chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
        if (message.type === "getSelectionHtml") {
            try {
                var container = null;
                if (typeof window.getSelection != "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                    }
                } else if (typeof document.selection != "undefined") {
                    if (document.selection.type == "Text") {
                        container = document.selection.createRange();
                    }
                }

                const markdownContent = await convertHTMLToMarkdown(container);

                sendResponse({ markdownContent });

                await navigator.clipboard.writeText(markdownContent);
            } catch (error) {
                console.error("Error processing selection:", error);
                sendResponse({ error: "Failed to process selection" });
            }
        }
    });

