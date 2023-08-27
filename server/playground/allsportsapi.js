import WebSocket from 'ws';

const socket = new WebSocket(
    'wss://wss.allsportsapi.com/live_events?widgetKey=' +
        process.env.ALL_SPORTS_API +
        '&timezone=+03:00'
);

socket.onmessage = function (event) {
    if (event.data) {
        const matchesData = JSON.parse(event.data);
        // Now variable matchesData contains all matches that received an update
        // Here can update matches in dom from variable matchesData
        console.log(matchesData);
    }
};


