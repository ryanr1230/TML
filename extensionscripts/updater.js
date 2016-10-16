function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOrdinal(n) {
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

let dont_include = ["https://www.google.com/_/chrome/newtab", "https://www.google.com/webhp?sourceid=chrome-instant"];
let access_token = "787158601265668097-tydRuRHmWbgioNpmxYjcNhYHdfau0oU";
let consumer_secret = "3piDTzHnxSrZU13XVe9XeplJSp37QwGxDZh4O1bQYSpAyD3OLA";
let token_secret = "HSHRPRy6v4q7hLjDnFIBMTMXxxhkY4TcMZo618vHl4vSt";
let consumer_key = "h0B4AkoYI2N0P4wNAROO1S6BQ";
let seconds_interval = 600000;

function makeNotif(title, message) {
    var options = {
      type: "basic",
      title: title,
      message: message,
      iconUrl: "notification.png"
    }

    chrome.notifications.create(options);
}

setInterval(function () {
	$.get("http://tweetmylife.herokuapp.com/tweet/retweets", function(data) {
        console.log(data);
        if(data !== "") {
		    makeNotif("You got a retweet", "Someone really likes \"" + data.text + "\"!");
        }
	});	
}, 1000);

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    for(var i = 0; i < dont_include.length; i++) {
        if(message.url.startsWith(dont_include[i])) {
            return;
        }
    }

    chrome.storage.local.get('num_visits', function (result) {
        if(result.num_visits === undefined) {
            result.num_visits = {};
        }
        let visits = result.num_visits[message.baseUrl];
        let cur_time = +new Date;
        if(visits === undefined) {
            visits = {};
            visits['num'] = 1;
            visits['time'] = cur_time;
        } else {
            if(visits.time > cur_time - seconds_interval) {
                visits['num']++;
            } else {
                visits['num'] = 1;
            }
            visits['time'] = cur_time;
        }
        result.num_visits[message.baseUrl] = visits;
        chrome.storage.local.set(result);

        var cb = new Codebird;
        cb.setConsumerKey(consumer_key, consumer_secret);
        cb.setToken(access_token, token_secret);
        let current_date = ("" + new Date()).substring(0, 21);
        let new_status = message.url;

        // Take screenshot and send image to node server that will post to twitter
        chrome.tabs.captureVisibleTab(null, {}, function (image) {
            $.post("https://tweetmylife.herokuapp.com/tweet", {
                "file": image.replace("data:image/jpeg;base64,",""),
                "status": new_status,
                "visits": visits.num,
                "base_url": message.baseUrl
            });
        });


    });
    sendResponse({response:"goodbye"});
});
