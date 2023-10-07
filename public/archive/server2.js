const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

let currentBid = 0;
let biddingEndTime = null;
const bidHistory = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const bid = parseInt(message);

        if (biddingEndTime && !isNaN(bid) && bid > currentBid) {
            currentBid = bid;
            const currentTime = new Date().getTime();
            if (biddingEndTime - currentTime < 180000) {
                // If less than 3 minutes left, extend the bidding time to 3 minutes later
                biddingEndTime = new Date(currentTime + 180000);
            }

            const timestamp = new Date();
            bidHistory.unshift({ bid: currentBid, timestamp });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcastDetails() {
    const details = getConsolidatedDetails();
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(details);
        }
    });
}
function formatBidEntry(entry) {
    const timeAgo = getTimeAgo(entry.timestamp);
    return `${entry.bid} at ${timeAgo}`;
}

function startBiddingTimer(durationInMinutes) {
    currentTime = new Date().getTime();
    biddingEndTime = new Date(currentTime + durationInMinutes * 60000);
    setInterval(() => {
        //console.log("biddingEndTime - currentTime" + (biddingEndTime - new Date().getTime()));
        if (biddingEndTime - new Date().getTime() <= 0) {
            // End the bidding when time runs out
            biddingEndTime = null;
            console.log("bidding ended");
            broadcastDetails();
        } else {
            broadcastDetails();
        }
    }, 1000);
}

function getTimeRemaining() {
    const currentTime = new Date().getTime();
    const timeRemaining = biddingEndTime - currentTime;

    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${minutes}m ${seconds}s`;
}
function getTimeAgo(timestamp) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return `${minutesAgo}m ${seconds}s ago`;
}

function getConsolidatedDetails() {
    if (!biddingEndTime) {
        return `Bidding ended with highest bid: $${currentBid}`;
    }
    let details = `Current highest bid: $${currentBid}`;

    details += `\nBidding ends in: ${getTimeRemaining()}\n`;

    if (bidHistory.length > 0) {
        details += '\nPrevious bids:';
        bidHistory.forEach((entry) => {
            const timeAgo = getTimeAgo(entry.timestamp);
            details += `\n- $${entry.bid} at ${timeAgo}`;
        });
    }
    return details;
}

// Rest of the functions remain the same

console.log('WebSocket server started on port 8081');
startBiddingTimer(15); // Bidding duration in minutes (e.g., 60 minutes)
