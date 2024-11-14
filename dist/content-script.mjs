// src/content-script.js
function getSelectionHtml() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
}
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log("Content script received message:", JSON.stringify(message, null, 2));
    const debugDisplay = document.createElement("pre");
    debugDisplay.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    max-width: 400px;
    max-height: 300px;
    overflow: auto;
    z-index: 999999;
  `;
    debugDisplay.textContent = JSON.stringify(message, null, 2);
    document.body.appendChild(debugDisplay);
    setTimeout(() => {
      debugDisplay.remove();
    }, 5e3);
    sendResponse(getSelectionHtml());
  }
);
//# sourceMappingURL=content-script.mjs.map