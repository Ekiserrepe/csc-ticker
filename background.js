let originalBadgeColor = '';

function updateBadge(price) {
    chrome.action.setBadgeText({ text: price.toString() });

    if (originalBadgeColor === '') {
        chrome.action.getBadgeBackgroundColor({}, result => {
            originalBadgeColor = result;
        });
    }

    chrome.action.setBadgeBackgroundColor({ color: [255, 215, 0, 255] });

    
    setTimeout(() => {
        chrome.action.setBadgeBackgroundColor({ color: originalBadgeColor });
    }, 1000); // (1 second)
}

function fetchcasinocoinPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=casinocoin&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            const casinocoinPrice = parseFloat(data.casinocoin.usd);
            const formattedPrice = `${casinocoinPrice.toFixed(3)}`;
            updateBadge(formattedPrice);
        })
        .catch(error => {
            console.error('Error fetching CasinoCoin price:', error);
            updateBadge('Error');
        });
}

chrome.runtime.onInstalled.addListener(() => {
    fetchcasinocoinPrice();
});

chrome.runtime.onStartup.addListener(() => {
    fetchcasinocoinPrice();
});

chrome.action.onClicked.addListener(() => {
    fetchcasinocoinPrice();
});

chrome.idle.onStateChanged.addListener(state => {
    if (state === 'active') {
        fetchcasinocoinPrice();
    }
});

setInterval(fetchcasinocoinPrice, 300000); //5 Minutes