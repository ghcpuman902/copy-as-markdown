import { DOMElement } from "react";
import { convertHTMLToMarkdown } from "./htmlToProseMirror";


async function getTabID() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab?.id || 0;
}

function getSelection() { return window.getSelection()?.toString() || ""; }


chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert_html_to_markdown") {
    chrome.scripting.executeScript({
      target: { tabId: await getTabID() },
      func: getSelection
    }).then(async (injectionResults) => {
      for (const { frameId, result } of injectionResults) {
        const selection = result;
        if (!selection) {
          console.error("No selection found on the page.");
          return;
        }

        const container = document.createElement("div");
        container.innerHTML = selection;

        const markdownContent = await convertHTMLToMarkdown(container.innerHTML);

        if (markdownContent) {
          await navigator.clipboard.writeText(markdownContent);
          console.log("Clipboard updated with Markdown content.");
        } else {
          console.error("Conversion returned null, check the HTML content.");
        }
      }
    });
  }
});
