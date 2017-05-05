
(() => {
    // Variables: Global
    const doEverything = window.doEverything;
    const progressArray = [0];
    let inProgress = false;
    let wsClient;

    // Functions
    const startClient = () => {
        wsClient = new WebSocket('ws://light.dpmercado.com:8768/');

        wsClient.onopen = function () {
            console.log('Connection open!');
        };

        wsClient.onmessage = function (message) {
            const incomingData = parseInt(message.data, 10);
            progressArray.push(incomingData / 1000);
        };

        wsClient.onerror = function (error) {
            console.log(error);
        };

        wsClient.onclose = function () {
            console.log('Connection Closed');
            startClient();
        };
    };

    const firstTwoDiff = array => array[0] !== array[1];

    // Start Websocket
    startClient();

    // Set interval for animation
    setInterval(() => {
        if (progressArray.length > 1) {
            if (firstTwoDiff(progressArray)) {
                if (!inProgress) {
                    inProgress = true;
                    let from, to;
                    if (progressArray.length > 5) {
                        from = progressArray.splice(0, 4)[0];
                        to = progressArray[0];
                    } else {
                        from = progressArray.shift();
                        to = progressArray[0];
                    }
                    doEverything(from, to).then(() => {
                        inProgress = false;
                    });
                }
            } else {
                progressArray.shift();
            }
        }
    }, 16);

})();


