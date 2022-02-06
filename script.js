let workDayHours = document.querySelector('.hoursWorkingDay');
let workDayMinutes = document.querySelector('.minutesWorkingDay');
let hoursOfProduction = document.querySelector('.hoursOnProduction');
let minutesOfProduction = document.querySelector('.minutesOnProduction');
let nonProductiveTimeInPercent = document.querySelector('.nonProductiveTimeInPercent');
let hoursOnTraining = document.querySelector('.hoursTraining');
let minutesOnTraining = document.querySelector('.minutesTraining');
let minutesOfNpt = document.querySelector('.minutesOfNpt');
let minutesOfBreak = document.querySelector('.minutesOfBreak');
let labelInResults = document.querySelector('.results .label');
let checkbox = document.querySelector('.switch input');
let buttonReset = document.querySelector('.reset');



/*stopwatch*/
const stopwatchValues = document.querySelector('.stopwatchValues');
const stopwatch = {
  elapsedTime: 0
}

const list = document.querySelector('.statusToPick');

let timer;
const state = {
  currentStatus: 'Offline',
  results: []
};



function getProductionTime() {


  let workDayInMinutes = workDayHours.value * 60 + Number(workDayMinutes.value);
  let trainingInMinutes = hoursOnTraining.value * 60 + Number(minutesOnTraining.value);
  let nptInMinutes = Math.round(nonProductiveTimeInPercent.value / 100 * (workDayInMinutes - trainingInMinutes));
  let productionInMinutes = workDayInMinutes - trainingInMinutes - nptInMinutes - minutesOfBreak.value;
  let convertTimeOfProduction = productionInMinutes / 60
  let productionHours = Math.floor(convertTimeOfProduction);
  let productionMinutes = productionInMinutes - productionHours * 60;
  let productionMinutesRounded = Math.round(productionMinutes);


  let sumOfProductionValues = 0;
  let sumOfNPTValues = 0;
  let sumOfTrainingValues = 0;
  let sumOfBreakValues = 0;



  if (nptInMinutes + trainingInMinutes + Number(minutesOfBreak.value) > workDayInMinutes) {
    document.querySelector('.errorElement').style.backgroundColor = "#dd005d";
  } else {
    hoursOfProduction.value = productionHours;
    minutesOfProduction.value = productionMinutesRounded;
    minutesOfNpt.value = nptInMinutes;
    document.querySelector('.errorElement').style.backgroundColor = "white";
  }

}


function changingProductionTime() {

  let hoursOfWorkPerDay = workDayHours.value * 60 + Number(workDayMinutes.value);
  let ProductionTime = hoursOfProduction.value * 60 + Number(minutesOfProduction.value);
  let trainingTime = hoursOnTraining.value * 60 + Number(minutesOnTraining.value);
  let NPTInMinutes = hoursOfWorkPerDay - ProductionTime - trainingTime - minutesOfBreak.value;
  let NPTPourcent = (NPTInMinutes * 100) / hoursOfWorkPerDay;
  let NPTPourcentRoundend = Math.round(NPTPourcent);



  if (ProductionTime + trainingTime + Number(minutesOfBreak.value) > hoursOfWorkPerDay) {
    document.querySelector('.errorElement').style.backgroundColor = "#dd005d";
  } else {
    minutesOfNpt.value = NPTInMinutes;
    nonProductiveTimeInPercent.value = NPTPourcentRoundend;
    document.querySelector('.errorElement').style.backgroundColor = "white";
  }
}



function updatedResults() {
  if (checkbox.checked == false) {
    labelInResults.innerHTML = 'yours results today:';
  } else {
    labelInResults.innerHTML = 'yours weekly results:';
  }
}

function reset() {

  workDayHours.value = '0';
  workDayMinutes.value = '00';
  hoursOfProduction.value = '0';
  minutesOfProduction.value = '00';
  nonProductiveTimeInPercent.value = '0';
  hoursOnTraining.value = '0';
  minutesOnTraining.value = '00';
  minutesOfNpt.value = '00';
  minutesOfBreak.value = '00';

}






/*stopwatch*/


function startStopWatch() {
  clearInterval(stopwatch.intervalId);
  stopwatch.startTime = Date.now();
  stopwatch.intervalId = setInterval(() => {

    const elapsedTime = Date.now() - stopwatch.startTime;
    stopwatch.elapsedTime = elapsedTime;
    const seconds = parseInt((elapsedTime / 1000) % 60);
    const minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
    const hour = parseInt((elapsedTime / (1000 * 60 * 60)) % 24);
    displayTime(hour, minutes, seconds)
  }, 1000);
}

function displayTime(hour, minutes, seconds) {
  const leadZeroTime = [hour, minutes, seconds].map(time => time < 10 ? `0${time}` : time)
  stopwatchValues.innerHTML = leadZeroTime.join(':')
}



function updateResults() {
  //  clearInterval(stopwatch.intervalId);

  state.results.push({
    time: stopwatch.elapsedTime,
    status: state.currentStatus,
    date: Date.now(),

  });
  state.currentStatus = list.value;
  console.log(state.results);

  let getArrayOfProductionResults = state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Production');
  let getArrayOfNPTResults = state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Non-productive time');
  let getArrayOfTrainingResults = state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Training');
  let getArrayOfBreakResults = state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Break');
  let getArrayOfProductionValues = getArrayOfProductionResults.map(value => value.time);
  sumOfProductionValues = getArrayOfProductionValues.reduce((acc, value) => acc + value, 0);
  let arrayOfConvertedProductionValues = convertion(sumOfProductionValues);
  document.getElementsByClassName('givenStatusTime')[1].innerHTML = `${arrayOfConvertedProductionValues[0]} h ${arrayOfConvertedProductionValues[1]} min ${arrayOfConvertedProductionValues[2]} sec`;

  let getArrayOfNPTValues = getArrayOfNPTResults.map(value => value.time);
  sumOfNPTValues = getArrayOfNPTValues.reduce((acc, value) => acc + value, 0);
  let arrayOfConvertedNPTValues = convertion(sumOfNPTValues);
  document.getElementsByClassName('givenStatusTime')[2].innerHTML = `${arrayOfConvertedNPTValues[0]} h ${arrayOfConvertedNPTValues[1]} min ${arrayOfConvertedNPTValues[2]} sec`;



  let getArrayOfTrainingValues = getArrayOfTrainingResults.map(value => value.time);
  sumOfTrainingValues = getArrayOfTrainingValues.reduce((acc, value) => acc + value, 0);
  //      console.log(sumOfTrainingValues);
  let arrayOfConvertedTrainingValues = convertion(sumOfTrainingValues);
  document.getElementsByClassName('givenStatusTime')[3].innerHTML = `${arrayOfConvertedTrainingValues[0]} h ${arrayOfConvertedTrainingValues[1]} min ${arrayOfConvertedTrainingValues[2]} sec`;

  let getArrayOfBreakValues = getArrayOfBreakResults.map(value => value.time);
  sumOfBreakValues = getArrayOfBreakValues.reduce((acc, value) => acc + value, 0);
  let arrayOfConvertedBreakValues = convertion(sumOfBreakValues);

  document.getElementsByClassName('givenStatusTime')[4].innerHTML = `${arrayOfConvertedBreakValues[0]} h ${arrayOfConvertedBreakValues[1]} min ${arrayOfConvertedBreakValues[2]} sec`;


  let workDay = sumOfProductionValues + sumOfNPTValues + sumOfTrainingValues + sumOfBreakValues;
  let workDayConverted = convertion(workDay);
  document.getElementsByClassName('givenStatusTime')[0].innerHTML = `${workDayConverted[0]} h ${workDayConverted[1]} min  ${workDayConverted[2]} sec`;





  if (list.value !== 'Offline') {
    startStopWatch();
  }
  if (list.value === 'Offline') {
    clearInterval(stopwatch.intervalId);
    displayTime(0, 0, 0);

  }
  if (list.value === 'Offline' && checkbox.checked != true) {
    state.results = [];
    //        displayTime(0, 0, 0);
    document.getElementsByClassName('givenStatusTime')[0].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[1].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[2].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[3].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[4].innerHTML = '00 h 00 min 00 sec';

  }

  if (list.value === 'Offline' && checkbox.checked != false) {

  }


};






function convertion(milliseconds) {
  let arrayOfHoursMinutsSeconds = [];
  const sec = parseInt((milliseconds / 1000) % 60);
  const min = parseInt((milliseconds / (1000 * 60)) % 60);
  const hou = parseInt((milliseconds / (1000 * 60 * 60)) % 24);
  arrayOfHoursMinutsSeconds.push(hou, min, sec);
  const pushedArrayOfHoursMinutsSeconds = arrayOfHoursMinutsSeconds.map(time => time < 10 ? `0${time}` : time)

  return pushedArrayOfHoursMinutsSeconds;
}

function updateWeeklyResults() {
  if (checkbox.checked == true) {

    //    updateResults();

  }

};




console.log(window.dateFns);

console.log(window.dateFns.format(new Date(), 'DD-MM-YYYY'));

//=> "Today is a Wednesday"

/*formatDistance(subDays(new Date(), 3), new Date(), {
  addSuffix: true
//})*/
//=> "3 days ago"

//formatRelative(subDays(new Date(), 3), new Date())
//=> "last Friday at 7:26 p.m."








workDayHours.addEventListener('input', getProductionTime)
workDayMinutes.addEventListener('input', getProductionTime)
nonProductiveTimeInPercent.addEventListener('input', getProductionTime)
hoursOnTraining.addEventListener('input', getProductionTime)
minutesOnTraining.addEventListener('input', getProductionTime)
minutesOfNpt.addEventListener('input', getProductionTime)
hoursOfProduction.addEventListener('input', changingProductionTime)
minutesOfProduction.addEventListener('input', changingProductionTime)
checkbox.addEventListener('click', updatedResults);
buttonReset.addEventListener('click', reset);

//list.addEventListener('change', updateResults);
list.addEventListener('change', updateResults);
checkbox.addEventListener('click', updateWeeklyResults);
