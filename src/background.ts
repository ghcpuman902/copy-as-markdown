async function getActiveTabId(): Promise<number> {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab?.id || 0;
}

async function handleConvertHtmlToMarkdown() {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) {
      console.warn("No active tab found.");
      return;
    }

    const response = await chrome.tabs.sendMessage(tabId, { type: "getSelectionHtml" });
    if (!response) {
      console.warn("No response from the content script.");
      return;
    }

    if (response.error) {
      console.error("Conversion returned null, check the HTML content.", response.error);
      return;
    }

    console.log("Clipboard updated with Markdown content.", response.markdownContent);
  } catch (error) {
    console.warn('Error, either selection is empty or conversion failed:', error);
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert_html_to_markdown") {
    await handleConvertHtmlToMarkdown();
  }
});
