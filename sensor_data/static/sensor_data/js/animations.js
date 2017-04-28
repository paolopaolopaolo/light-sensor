// Hex to RGB Conversions

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

// Get style by progress

const getColorWithMilestones = (milestones, progress) => {
    const integerProgress = Math.floor(progress * 100);
    const milestoneKeys = Object.keys(milestones);
    let startingFromIdx = milestoneKeys.findIndex(milestone => integerProgress < parseInt(milestone, 10)) - 1;
    if (startingFromIdx < 0) startingFromIdx = milestoneKeys.length - 1;
    const startingMilestone = milestoneKeys[startingFromIdx];
    const endingMilestone = milestoneKeys[Math.min(startingFromIdx + 1, milestoneKeys.length - 1)];
    const milestoneSize = ((parseInt(startingMilestone, 10) - parseInt(endingMilestone, 10))**2)**(1/2);
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

const getXYByProgress = (width, percent) => {
    const halfWidth = width * 1.85;
    const heightCoeff = 0.9;
    const x = (halfWidth) * percent;
    const y = -((heightCoeff/halfWidth) * ((x - halfWidth)**2)) + (halfWidth * heightCoeff);
    return [x, y];
};

// Progress: Style Milestone mappings

const dayPatternMilestones = {
    '0': '#000000',
    '50': '#003366',
    '100': '#FFFFFF'
};

// const dayPatternMilestones = {
//     '0': '#FF0000',
//     '100': '#00FF00'
// }

const sunMoonMilestones = {
    '0': '#f3f5f6',
    '25': '#FE5B35',
    '100': '#ffff00'
};

const width = 50;

const background = document.getElementById('container');
const birdie = document.getElementsByClassName('birdie')[0];

const _colorStep = (el, milestones, pastProg, progLimit, asc = null) => () => {
    if (asc === null) asc = pastProg - progLimit < 0;
    const newProg = asc ? pastProg + 0.01 : pastProg - 0.01;
    el.style.background = getColorWithMilestones(milestones, newProg);
    if (asc ? newProg < progLimit : newProg > progLimit) {
        window.requestAnimationFrame(_colorStep(el, milestones, newProg, progLimit, asc));
    }
};

const _parabolaStep = (el, width, pastProg, progLimit, asc = null) => () => {
    if (asc === null) asc = pastProg - progLimit < 0;
    const newProg = asc ? pastProg + 0.01 : pastProg - 0.01;
    const newXY = getXYByProgress(width, newProg);
    el.style.left = `${newXY[0]}vw`;
    el.style.bottom = `${newXY[1]}vh`;
    if (asc ? newProg < progLimit : newProg > progLimit) {
        window.requestAnimationFrame(_parabolaStep(el, width, newProg, progLimit, asc));
    }
};

const doEverything = (from, to) => {
    window.requestAnimationFrame(_colorStep(background, dayPatternMilestones, from, to));
    window.requestAnimationFrame(_parabolaStep(birdie, width, from, to));
    window.requestAnimationFrame(_colorStep(birdie, sunMoonMilestones, from, to));
};
