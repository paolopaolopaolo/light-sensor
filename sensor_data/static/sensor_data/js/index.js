var lastProgress = 0;

function determineColor(data) {
    var alpha;
    if (data < 250) {
        alpha = '1';
    } else if (data < 500) {
        alpha = '0.9';
    } else if (data < 970) {
        alpha = '0.7';
    } else {
        alpha = '0.3';
    }
    return 'rgba(72,165,226,' + alpha + ')';
}

function determineExtraMessage(data) {
    var message;
    if (data < 125) {
        message = '- oh, so dark';
    } else if (data > 980){
        message = '- oof, it\'s like being on the sun';
    }
    return message;
}

function startClient () {
    var wsClient = new WebSocket('ws://light.dpmercado.com:8768/');

    wsClient.onopen = function () {
        console.log('Connection open!');
    };

    wsClient.onmessage = function (message) {
        const incomingData = parseInt(message.data, 10);
        const progress = incomingData / 1000;
        doEverything(lastProgress, progress);
        lastProgress = progress;
    };

    wsClient.onerror = function (error) {
        console.log(error);
    };

    wsClient.onclose = function () {
        console.log('Connection Closed');
        startClient();
    };
}

startClient();

