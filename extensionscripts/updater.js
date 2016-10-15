function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    let access_token = "787158601265668097-tydRuRHmWbgioNpmxYjcNhYHdfau0oU";  
    let consumer_secret = "3piDTzHnxSrZU13XVe9XeplJSp37QwGxDZh4O1bQYSpAyD3OLA";
    let token_secret = "HSHRPRy6v4q7hLjDnFIBMTMXxxhkY4TcMZo618vHl4vSt";
    let consumer_key = "h0B4AkoYI2N0P4wNAROO1S6BQ";

    var cb = new Codebird;
    cb.setConsumerKey(consumer_key, consumer_secret);
    cb.setToken(access_token, token_secret);

   cb.__call(
		"statuses_update",
		{"status": message.url},
		function (reply, rate, err) {
            console.log(reply);
            console.log(rate);
            console.log(err);
			// ...
		}
	); 

    sendResponse({response:"goodbye"});
});
