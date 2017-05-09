
(() => {
    // Variables: Global
    const doEverything = window.doEverything;
    const threshold = 0.05;
    const progressArray = [0];
    let inProgress = false;
    let wsClient;
    const messageMap = {
      40: 'The office is pretty dark right now. The Yetis are in their respective homes ' +
          'or simply working in the dark.',
      60: 'The office is at average brightness. Perhaps it is a little cloudy. ' +
          'The Yetis are heads down at work, creating beautiful apps and digital experiences.',
      100: 'The office is as bright as it gets. Some Yetis are probably out and about, since ' +
           'they, like many mythical creatures, enjoy being outdoors.'
    };

    // Variables: DOM
    const lightBlip = document.getElementById('light-blip');

    const setMessage = (number) => {
        const adjustedNumber = number * 100;
        const compareKeys = Object.keys(messageMap).map(key => parseInt(key, 10)); // Get the numeric keys of message map

        for (let valIdx = 0; valIdx < compareKeys.length; valIdx++) {
            const value = compareKeys[valIdx];
            if (adjustedNumber < value) {
                lightBlip.innerText = messageMap[value];
                break;
            }
        }
    };

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

    const firstTwoDiff = array => array[0] !== array[1] && Math.abs(array[0] - array[1]) > threshold;

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
                    setMessage(to);
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


