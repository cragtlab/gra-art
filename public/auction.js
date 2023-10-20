const utterance = new SpeechSynthesisUtterance();
utterance.rate = 1.5;
window.speechSynthesis.onvoiceschanged = () =>{ 
    for (voice of window.speechSynthesis.getVoices()) {
        if (voice.name == "Google UK English Male") {
            utterance.voice = voice;
            utterance.rate = 1.2;
        }
    }
    //console.log(window.speechSynthesis.getVoices());
};
function placeBid() {
    const bidAmount = parseInt(document.getElementById('bidAmount').value);
    if (!isNaN(bidAmount)) {
        addBid(bidAmount);
        document.getElementById('bidAmount').value = "";
    }
}
function placeBidHigher() {
    document.getElementById('bidAmount').value = (highestBidAmount * 1 + 1);
    placeBid();
}
let lastBidAmount = 0; // to create excitement if bidded and outbid
let timeToAnnounce = false;
let highestBidAmount = 0;
let lastBidAnnouncement = "0";
function loadAuctionDiv() {
    // Announce the current bid every X seconds if text-to-speech is enabled
    textToSpeechInterval = setInterval(() => {
        timeToAnnounce = true;
    }, 10000);

    setInterval(async function () { // should listen event instead
        const bidHistoryElement = document.getElementById('bidHistory');
        details = await getAuctionDetails();
        highestBidAmount = 0;
        highestBidder = "0x";
        bids = details[2];
        timeRemaining = details[1] * 1000 - new Date().getTime();
        if (bids.length) {
            highestBidAmount = bids[bids.length - 1].amount;
            highestBidder = bids[bids.length - 1].bidder;
        }
        lastBidAmount = 0;
        for (bid of bids) {
            if (bid.bidder == accounts[0]) {
                lastBidAmount = bid.amount;
            }
        }

        // display based on whether auction ongoing
        if (details[0] == "0") {
            live_auction.style.display = 'none';
            ended_auction.style.display = 'none';
            out = "No Auction Currently. Please wait for next auction";
        } else {
            if (timeRemaining > 0) {
                live_auction.style.display = '';
                ended_auction.style.display = 'none';
                minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                out = "Current Highest Bid: " + highestBidAmount;
                out += "<br/>Auction Ends in " + minutes + "m " + seconds + "s";
                out += "<br/>";
                for (bid of bids) {
                    out += "<br/>" + getNiceName(bid.bidder) + " bidded for " + bid.amount;
                }
            } else {
                live_auction.style.display = 'none';
                // show pay auction method if winning bidder
                if (accounts[0] == highestBidder) {
                    out = "Congratulations. Auction ended with your winning bid of " + highestBidAmount;
                    ended_auction.style.display = '';
                } else {
                    out = "Bidded ended with highest bid: " + highestBidAmount;
                    ended_auction.style.display = 'none';
                }
            }
        }

        bidHistoryElement.innerHTML = out;
        if (lastBidAmount) {
            if (highestBidAmount == lastBidAmount) {
                bidFun.innerHTML = `<font color='green'>You are the highest bidder at ${lastBidAmount}</font>`;
            } else {
                bidFun.innerHTML = `<font color='red'>Your bid of $${lastBidAmount} was outbidded</font>`;
            }
        }

        if (timeToAnnounce) {
            timeToAnnounce = false;
            if (bidHistoryElement.innerHTML.split("<br>")[0] === lastBidAnnouncement && lastBidAnnouncement.indexOf("ended") == -1 && lastBidAnnouncement.indexOf("next auction") == -1) {
                speakEncouragement(minutes < 3);
            } else if (bidHistoryElement.innerHTML.split("<br>")[0] != lastBidAnnouncement) {
                lastBidAnnouncement = bidHistoryElement.innerHTML.split("<br>")[0];
                speak(lastBidAnnouncement);
            }

        }
    }, 200);
    function speak(text) {
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    }
    function testAllVoices() {
        id = 0; for (i of window.speechSynthesis.getVoices()) {
            const utterance = new SpeechSynthesisUtterance("apple are good. this is index " + (id++));
            utterance.rate = 1; utterance.voice = i;
            window.speechSynthesis.speak(utterance);
        }
    }
    function speakEncouragement(timeRunningOut) {
        const encouragementMessages = [
            "Bidding is still open! Place your bid now and be part of the excitement.",
            "Don't miss out! Place your bid and own this amazing art piece.",
            "Join the bidding frenzy! Your bid could be the winning bid. Place it now!",
            "The bidding is hot! Add your bid to the competition and secure this art piece.",
            "Make your mark on this artwork by placing your bid now!",
            "Keep the bids coming! Your bid might be the one that makes a difference.",
            "The auction is in full swing. Place a bid and make a statement with this art piece.",
            "Your bid can make a difference! Don't hesitate, bid now and show your interest in this artwork.",
            "Unleash your competitive spirit! Place your bid and challenge others.",
            "Bidding is a thrill! Join the action by placing your bid and aim for the top."
        ];

        const encouragementMessagesBelow3Mins = [
            "Ladies and gentlemen, we're down to the less than three minutes! Don't miss out on your chance to own this fantastic item. Keep those bids coming!",
            "Time is running out! This is your moment to make your move. Who will be the lucky winner? Bid now!",
            "Less than three minutes left on the clock. Make your bids count and secure this incredible piece. It's going, going...",
            "It's crunch time, folks! Three minutes to go. If you want it, bid now and show everyone you mean business!",
            "The countdown has begun, and the clock is ticking. Bid high, bid fast, and claim your prize. Less than three minutes left!"
        ]
        if (timeRunningOut) {
            msgs = encouragementMessagesBelow3Mins;
        } else {
            msgs = encouragementMessages;

        }

        const randomIndex = Math.floor(Math.random() * msgs.length);
        speak(msgs[randomIndex]);
    }

    
}