
// Boilerplate for NOT polluting that sweet, sweet global namespace.
window.doEverything = (() => {
    // VARIABLES: Global
    const width = 90; // in vw
    const raf = window.requestAnimationFrame; // aliased for readability
    const stepSize = 0.0075;

    // VARIABLES: DOM elements

    const background = document.getElementById('container');
    const birdie = document.getElementsByClassName('birdie')[0];
    const roof = document.getElementsByClassName('roof__front')[0];
    const roof3D = document.getElementsByClassName('roof__3d')[0];
    const houseBody = document.getElementsByClassName('house-body')[0];
    const houseBody3D = document.getElementsByClassName('house-body-3d')[0];
    const wps = document.getElementsByClassName('wp');

    // VARIABLES: Style Milestone mappings for Color changes

    const dayPatternMilestones = {
        '0': '#000000',
        '50': '#003366',
        '100': '#a3c1cd'
    };
    const sunMoonMilestones = {
        '0': '#f3f5f6',
        '25': '#FE7B65',
        '100': '#ffff00'
    };
    const roofMilestones = {
        '0': '#9f9f9f',
        '100': '#ffffff'
    };
    const roofBackground = {
        '0': '#595959',
        '100': '#9f9f9f'
    };
    const houseBodyMilestones = {
        '0': '#002f3d',
        '100': '#009DAB'
    };
    const houseBackground = {
        '0': '#00101b',
        '100': '#004452'
    };
    const windowMilestones = {
        '0': '#ffff00',
        '25': '#FE7B65',
        '50': '#a6c5e4',
        '100': '#ffffff'
    };

    // FUNCTIONS: Hex to RGB Conversions
    const _hexToRGBArray = (hexString) => {
        const rgbArray = hexString
            .match(/#{0,1}(\w{2})(\w{2})(\w{2})/)
            .slice(1)
            .map(val => parseInt(val, 16));

        if (rgbArray.findIndex(val => val > 255 || val < 0) > -1) return; // returns null if hexString is invalid
        return rgbArray;
    };

    const _rgbArrayToHex = (rgbArray) => {
        return `#${rgbArray.map((val) => {
            const hexString = Math.floor(val).toString(16);
            return hexString.length === 1 ? `0${hexString}` : hexString;
        }).join('')}`;
    };

    // FUNCTIONS: Get style by progress (0.0 - 1.0)

    const getColorWithMilestones = (milestones, progress) => {


        // Convert from 0 - 1 scale to 0 - 100 scale
        const integerProgress = Math.floor(progress * 100);

        // Get the "milestone" markers as they are defined
        // TODO: Validate milestone keys to ensure that they are assorted in ascending order
        const milestoneKeys = Object.keys(milestones);

        // Find the index of the milestone that is the "floor" of the given progress value
        let startingFromIdx = milestoneKeys.findIndex(milestone => integerProgress < parseInt(milestone, 10)) - 1;

        // Default startingFrom as the last milestone
        if (startingFromIdx < 0) startingFromIdx = milestoneKeys.length - 1;

        // Get the color Hex of the given milestone
        const startingMilestone = milestoneKeys[startingFromIdx];

        const endingMilestone = milestoneKeys[Math.min(startingFromIdx + 1, milestoneKeys.length - 1)];
        const milestoneSize = Math.abs(parseInt(startingMilestone, 10) - parseInt(endingMilestone, 10));
        const fromArray = _hexToRGBArray(milestones[startingMilestone]);
        const toArray = _hexToRGBArray(milestones[endingMilestone]);
        const normalizedProgress = (integerProgress - startingMilestone) / milestoneSize;
        // gets the difference between from and to on all rgb values
        const diffArray = toArray.map((toItem, idx) => toItem - fromArray[idx]);
        // gets the array of colors
        const targetRGBArray = diffArray.map((diffItem, idx) => Math.max(fromArray[idx] + (diffItem * normalizedProgress), 0) );
        const rgbString = _rgbArrayToHex(targetRGBArray);
        return (rgbString);
    };

    const getYUpturntParabola = (width, percent) => {
        const adjustedWidth = width;
        const heightCoeff = 0.5;
        const x = (adjustedWidth) * percent;
        const y = -((heightCoeff/adjustedWidth) * (Math.pow(x - adjustedWidth, 2))) + (adjustedWidth * heightCoeff) + 40;
        return [x, y];
    };

    // FUNCTIONS: Animation frames (returning functions passed to rAF)

    const _colorStep = (
        el,
        milestones,
        pastProg,
        progLimit,
        asc,
        attribute,
        finishedAnimations
    ) =>
        () => {
            if (asc === null) asc = pastProg - progLimit < 0;
            const newProg = asc ? pastProg + stepSize : pastProg - stepSize;
            el.style[attribute] = getColorWithMilestones(milestones, newProg);
            if (asc ? newProg < progLimit : newProg > progLimit) {
                raf(_colorStep(el, milestones, newProg, progLimit, asc, attribute, finishedAnimations));
            } else {
                finishedAnimations.push(true);
            }
        };

    const _parabolaStep = (
        el,
        width,
        pastProg,
        progLimit,
        finishedAnimations,
        asc = null
    ) =>
        () => {
            if (asc === null) asc = pastProg - progLimit < 0;
            const newProg = asc ? pastProg + stepSize : pastProg - stepSize;
            const newXY = getYUpturntParabola(width, newProg);
            el.style.left = `${newXY[0]}vw`;
            el.style.bottom = `${newXY[1]}vh`;
            if (asc ? newProg < progLimit : newProg > progLimit) {
                raf(_parabolaStep(el, width, newProg, progLimit, finishedAnimations, asc));
            } else {
                finishedAnimations.push(true);
            }
        };

    // FUNCTION: Returns list of animations to perform

    const animationListFactory = (from, to, finishedAnimations) => ([
        [_colorStep, background, dayPatternMilestones, from, to, null, 'background-color', finishedAnimations],
        [_parabolaStep, birdie, width, from, to, finishedAnimations],
        [_colorStep, birdie, sunMoonMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, roof, roofMilestones, from, to, null, 'border-bottom-color', finishedAnimations],
        [_colorStep, houseBody, houseBodyMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, roof3D, roofBackground, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, houseBody3D, houseBackground, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[0], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[1], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[2], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[3], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[4], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[5], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[6], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[7], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[8], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[9], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[10], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[11], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[12], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[13], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[14], windowMilestones, from, to, null, 'background-color', finishedAnimations],
        [_colorStep, wps[15], windowMilestones, from, to, null, 'background-color', finishedAnimations]
    ]);

    // Returns a Promise that resolves once the animations are complete
    return (from, to) => new Promise((resolve) => {
        let finishedAnimations = [];
        const animationList = animationListFactory(from, to, finishedAnimations);

        for (let idx = 0; idx < animationList.length; idx++) {
            const argArray = animationList[idx];
            const stepFunc = argArray.shift();
            raf(stepFunc.apply(window, argArray));
        }

        // Naïve, yet comprehensive way to ensure that resolve is called
        // only after all the animations are complete.
        // Won't resolve until all the animations have reached the end
        const checker = setInterval(() => {
            if (animationList.length === finishedAnimations.length) {
                clearInterval(checker);
                resolve();
            }
        }, 16);
    });
})();
