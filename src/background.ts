import { convertHTMLToMarkdown } from "./htmlToProseMirror";
async function getTabID() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab?.id || 0;
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert_html_to_markdown") {
    // alert("convert_html_to_markdown");
    try {
      const tabId = await getTabID();
      console.log(tabId);
      const response = await chrome.tabs.sendMessage(tabId, {
        type: "getSelectionHtml"
      });
      console.log(response);

      if (!response) {
        console.warn("No response from the content script.");
        return;
      }

      const container = document.createElement("div");
      container.innerHTML = response;

      const markdownContent = await convertHTMLToMarkdown(container.innerHTML);

      if (markdownContent) {
        await navigator.clipboard.writeText(markdownContent);
        console.log("Clipboard updated with Markdown content.", markdownContent);
      } else {
        console.error("Conversion returned null, check the HTML content.");
      }


    } catch (error) {
      console.warn('Error, either selection is empty or conversion failed:', error);
    }

  }
});
