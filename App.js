'use strict';

const scalewayCosts = document.getElementById('scalewayCosts');
const bunnyCosts = document.getElementById('bunnyCosts');
const backblazeCosts = document.getElementById('backblazeCosts');
const vultrCosts = document.getElementById('vultrCosts');

const scaleRadioSingle = document.getElementById('single');
const bunnyRadioHDD = document.getElementById('HDD');

const storageRange = document.getElementById('storageRange');
const transferRange = document.getElementById('transferRange');

const storageValue = document.getElementById('storageValue');
const transferValue = document.getElementById('transferValue');

const radioButtonsBunny = document.getElementsByName('bunny');
const radioButtonsScaleway = document.getElementsByName('scaleway');
const radioButtons = [...radioButtonsBunny, ...radioButtonsScaleway];

scaleRadioSingle.checked = true;
bunnyRadioHDD.checked = true;

const rangeStorageValue = `${storageRange.value}GB`;
storageValue.innerText = rangeStorageValue;

const rangeTransferValue = `${transferRange.value}GB`;
transferValue.innerText = rangeTransferValue;

const bucksToPicksel = 400 / 74;

const backblazeTomb = document.getElementById('backblazeTomb');
const bunnyTomb = document.getElementById('bunnyTomb');
const scalewayTomb = document.getElementById('scalewayTomb');
const vultrTomb = document.getElementById('vultrTomb');

const tombsColors = {
  backblaze: '#eb2929',
  bunny: '#ebbe29',
  scaleway: '#b429eb',
  vultr: '#3688f3',
};

const calcScalewaySingle = (
  val1, 
  val2,
) => ((val1 - 75) * 0.03 + (val2 - 75) * 0.02).toFixed(2);

const calcScalewayMulti = (
  val1, 
  val2,
) => ((val1 - 75) * 0.06 + (val2 - 75) * 0.02).toFixed(2);

const calcBunnyHDD = (val1, val2) => (val1 * 0.01 + val2 * 0.01).toFixed(2);
const calcBunnySSD = (val1, val2) => (val1 * 0.02 + val2 * 0.01).toFixed(2);

const calcBackblaze = (val1, val2) => (val1 * 0.005 + val2 * 0.01).toFixed(2);
const calcVultr = (val1, val2) => (val1 * 0.01 + val2 * 0.01).toFixed(2);

const calculations = () => {
  const storageVal = Number(storageRange.value);
  const transferVal = Number(transferRange.value);
  
  let result = {
    backblaze: 7,
    bunny: 10,
    scaleway: 0,
    vultr: 5,
  };
  
  console.log(result)

  if (scaleRadioSingle.checked) {
    result.scaleway = +calcScalewaySingle(storageVal, transferVal);
  } else {
    result.scaleway = +calcScalewayMulti(storageVal, transferVal);
  }

  const calcResultBunnyHDD = calcBunnyHDD(storageVal, transferVal);
  const calcResultBunnySSD = calcBunnySSD(storageVal, transferVal);

  if (bunnyRadioHDD.checked) {
    result.bunny = calcResultBunnyHDD < result.bunny ? +calcResultBunnyHDD : result.bunny;
  } else {
    result.bunny = calcResultBunnySSD < result.bunny ? +calcResultBunnySSD : result.bunny;
  }

  const calcResultBackblaze = calcBackblaze(storageVal, transferVal);

  if (calcResultBackblaze > result.backblaze) {
    result.backblaze = +calcResultBackblaze;
  }

  const calcResultVultr = calcVultr(storageVal, transferVal);

  if (calcResultVultr > result.vultr) {
    result.vultr = +calcResultVultr;
  }

  console.log(result)
  return result;
};

const onRangeChange = (event) => {
  const target = event.currentTarget;
  
  if (target.id === 'storageRange' || target.id === 'transferRange') {
    target.id === 'storageRange'
      ? storageValue.innerText = `${event.currentTarget.value}GB`
      : transferValue.innerText = `${event.currentTarget.value}GB`;
  }

  const calcResultObj = calculations();

  const values = Object.values(calcResultObj);
  const minValue = Math.min(...values);
  
  for (let x in calcResultObj) {
    const elemName = `${x}Tomb`;
    const getElem = document.getElementById(elemName);

    (calcResultObj[x] !== minValue)
      ? getElem.style.backgroundColor = '#b3adad'
      : getElem.style.backgroundColor = tombsColors[x];
  }
  
  if (calcResultObj.backblaze > 7) {
    backblazeCosts.innerText = `${calcResultObj.backblaze}$`;
    backblazeTomb.style.width = Math.trunc(+calcResultObj.backblaze * bucksToPicksel) + 'px';
  } else {
    backblazeCosts.innerText = '7$';
    backblazeTomb.style.width = Math.trunc(7 * bucksToPicksel) + 'px';
  }

  if (calcResultObj.bunny < 10) {
    bunnyCosts.innerText = `${calcResultObj.bunny}$`;
    bunnyTomb.style.width = Math.trunc(calcResultObj.bunny * bucksToPicksel) + 'px';
  } else {
    bunnyCosts.innerText = '10$';
    bunnyTomb.style.width = Math.trunc(10 * bucksToPicksel) + 'px';
  }

  if (calcResultObj.scaleway > 0) {
    scalewayCosts.innerText = `${calcResultObj.scaleway}$`;
    scalewayTomb.style.width = Math.trunc(calcResultObj.scaleway * bucksToPicksel) + 'px';
  } else {
    scalewayCosts.innerText = 'FREE';
    scalewayTomb.style.width = '400px';
  }
  
  if (calcResultObj.vultr > 5) {
    vultrCosts.innerText = `${calcResultObj.vultr}$`;
    vultrTomb.style.width = Math.trunc(calcResultObj.vultr * bucksToPicksel) + 'px';
  } else {
    vultrCosts.innerText = '5$';
    vultrTomb.style.width = Math.trunc(5 * bucksToPicksel) + 'px';
  }
};

window.onload = (e) => {
  onRangeChange(e);
  console.log(transferRange, transferValue)
  transferValue.innerText = `${transferRange.value}GB`;
};

storageRange.addEventListener('change', onRangeChange);
transferRange.addEventListener('change', onRangeChange);
radioButtons.map(button => button.addEventListener('change', onRangeChange));
