chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // request.data -- blob
    console.log("Hello!");
    console.log(blob);
    sendResponse({data:"Good!"});
  }
);
