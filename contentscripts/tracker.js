chrome.runtime.sendMessage({url: window.location.href}, function(response) {
  console.log("did it!");
});
