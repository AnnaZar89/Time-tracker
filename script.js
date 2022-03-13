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

let sumOfProductionValues = 0;
let sumOfNPTValues = 0;
let sumOfTrainingValues = 0;
let sumOfBreakValues = 0;


let workDayConverted = [];
let arrayOfConvertedProductionValues = [];
let arrayOfConvertedNPTValues = [];
let arrayOfConvertedTrainingValues = [];
let arrayOfConvertedBreakValues = [];

let sumOfworkDayConverted = [];
let arrayOfConvertedSumOfProductionValues = [];
let arrayOfConvertedSumOfNPTValues = [];
let arrayOfConvertedSumOfTrainingValues = [];
let arrayOfConvertedSumOfBreakValues = [];

const weeklyResultsDiv = document.querySelector('.weeklyResultsDiv');
const actualResults = document.querySelector('.actualResults');
let weekSum = {};




/*FIREBASE*/

firebase.initializeApp({
  apiKey: "AIzaSyBVA4ajZsSa5EVIJtiYqNrkqPP80Y2QMHQ",
  authDomain: "test-b8ead.firebaseapp.com",
  projectId: "test-b8ead",
  storageBucket: "test-b8ead.appspot.com",
  messagingSenderId: "500859864296",
  appId: "1:500859864296:web:2914a519860cfc9b38355d",
  measurementId: "G-DNZF9TEG42"

});


var db = firebase.firestore();



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


let arrayWithStatusFiltered = [];

function updateResults() {

  state.results.push({
    time: stopwatch.elapsedTime,
    status: state.currentStatus,
    date: Date.now(),

  });
  state.currentStatus = list.value;




  let getArrayOfProductionResults = filterByStatus('Production');
  let getArrayOfNPTResults = filterByStatus('Non-productive time');
  let getArrayOfTrainingResults = filterByStatus('Training');
  let getArrayOfBreakResults = filterByStatus('Break');




  let getArrayOfProductionValues = getTimestamp(getArrayOfProductionResults);
  sumOfProductionValues = sumOfStatusTime(getArrayOfProductionValues);
  arrayOfConvertedProductionValues = convertion(sumOfProductionValues);
  document.getElementsByClassName('givenStatusTime')[1].innerHTML = `${arrayOfConvertedProductionValues[0]} h ${arrayOfConvertedProductionValues[1]} min ${arrayOfConvertedProductionValues[2]} sec`;


  let getArrayOfNPTValues = getTimestamp(getArrayOfNPTResults);
  sumOfNPTValues = sumOfStatusTime(getArrayOfNPTValues);
  arrayOfConvertedNPTValues = convertion(sumOfNPTValues);
  document.getElementsByClassName('givenStatusTime')[2].innerHTML = `${arrayOfConvertedNPTValues[0]} h ${arrayOfConvertedNPTValues[1]} min ${arrayOfConvertedNPTValues[2]} sec`;



  let getArrayOfTrainingValues = getTimestamp(getArrayOfTrainingResults);
  sumOfTrainingValues = sumOfStatusTime(getArrayOfTrainingValues);
  arrayOfConvertedTrainingValues = convertion(sumOfTrainingValues);
  document.getElementsByClassName('givenStatusTime')[3].innerHTML = `${arrayOfConvertedTrainingValues[0]} h ${arrayOfConvertedTrainingValues[1]} min ${arrayOfConvertedTrainingValues[2]} sec`;



  let getArrayOfBreakValues = getTimestamp(getArrayOfBreakResults);
  sumOfBreakValues = sumOfStatusTime(getArrayOfBreakValues);
  arrayOfConvertedBreakValues = convertion(sumOfBreakValues);
  document.getElementsByClassName('givenStatusTime')[4].innerHTML = `${arrayOfConvertedBreakValues[0]} h ${arrayOfConvertedBreakValues[1]} min ${arrayOfConvertedBreakValues[2]} sec`;


  let workDay = sumOfProductionValues + sumOfNPTValues + sumOfTrainingValues + sumOfBreakValues;
  workDayConverted = convertion(workDay);
  document.getElementsByClassName('givenStatusTime')[0].innerHTML = `${workDayConverted[0]} h ${workDayConverted[1]} min  ${workDayConverted[2]} sec`;









  if (list.value !== 'Offline') {
    startStopWatch();

  }

  if (list.value === 'Offline' && checkbox.checked != true) {
    state.results = [];

    document.getElementsByClassName('givenStatusTime')[0].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[1].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[2].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[3].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[4].innerHTML = '00 h 00 min 00 sec';

  }


  if (checkbox.checked != false) {
    state.results = [];
  }



  if (list.value === 'Offline') {

    clearInterval(stopwatch.intervalId);
    displayTime(0, 0, 0);


    db.collection(firstDayOfWeek()).add({

        production: sumOfProductionValues,
        NPT: sumOfNPTValues,
        Training: sumOfTrainingValues,
        Break: sumOfBreakValues


      })


      .then(() => {
        downloadWeeklyResults();
      })



  };


};


function downloadWeeklyResults() {

  db.collection(firstDayOfWeek()).onSnapshot((snapshot) => {

    let history = [];

    snapshot.docs.map(doc => {

      history.push(doc.data());

    })


    console.log(history);
    weekSum = history.reduce(function (previousValue, currentValue) {
      return {
        production: previousValue.production + currentValue.production,
        NPT: previousValue.NPT + currentValue.NPT,
        Training: previousValue.Training + currentValue.Training,
        Break: previousValue.Break + currentValue.Break
      }
    }, {
      production: 0,
      NPT: 0,
      Training: 0,
      Break: 0
    })


    let sumOfworkDay = weekSum.production + weekSum.NPT + weekSum.Training + weekSum.Break;
    sumOfworkDayConverted = convertion(sumOfworkDay);
    document.getElementsByClassName('givenStatusTimeWeekly')[0].innerHTML = `${sumOfworkDayConverted[0]} h ${sumOfworkDayConverted[1]} min  ${sumOfworkDayConverted[2]} sec`;


    arrayOfConvertedSumOfProductionValues = convertion(weekSum.production);
    arrayOfConvertedSumOfNPTValues = convertion(weekSum.NPT);
    arrayOfConvertedSumOfTrainingValues = convertion(weekSum.Training);
    arrayOfConvertedSumOfBreakValues = convertion(weekSum.Break);

    document.getElementsByClassName('givenStatusTimeWeekly')[1].innerHTML = `${arrayOfConvertedSumOfProductionValues[0]} h ${arrayOfConvertedSumOfProductionValues[1]} min ${arrayOfConvertedSumOfProductionValues[2]} sec`;
    document.getElementsByClassName('givenStatusTimeWeekly')[2].innerHTML = `${arrayOfConvertedSumOfNPTValues[0]} h ${arrayOfConvertedSumOfNPTValues[1]} min ${arrayOfConvertedSumOfNPTValues[2]} sec`;

    document.getElementsByClassName('givenStatusTimeWeekly')[3].innerHTML = `${arrayOfConvertedSumOfTrainingValues[0]} h ${arrayOfConvertedSumOfTrainingValues[1]} min ${arrayOfConvertedSumOfTrainingValues[2]} sec`;

    document.getElementsByClassName('givenStatusTimeWeekly')[4].innerHTML = `${arrayOfConvertedSumOfBreakValues[0]} h ${arrayOfConvertedSumOfBreakValues[1]} min ${arrayOfConvertedSumOfBreakValues[2]} sec`;


  });

  ifOffline();
};



function firstDayOfWeek() {
  const startOfWeek = dateFns.startOfWeek;
  let firstDay = startOfWeek(new Date(), {
    weekStartsOn: 1
  });

  firstDay = dateFns.format(firstDay, 'DD.MM.YYYY');
  console.log(firstDay);

  return firstDay
}


firstDayOfWeek();

function convertion(milliseconds) {
  let arrayOfHoursMinutsSeconds = [];
  const sec = parseInt((milliseconds / 1000) % 60);
  const min = parseInt((milliseconds / (1000 * 60)) % 60);
  const hou = parseInt((milliseconds / (1000 * 60 * 60)) % 24);

  arrayOfHoursMinutsSeconds.push(hou, min, sec);


  const pushedArrayOfHoursMinutsSeconds = arrayOfHoursMinutsSeconds.map(function (time) {
    if (time < 10) {
      return '0' + time;

    } else {
      return time;
    }


  });

  return pushedArrayOfHoursMinutsSeconds;

}



function updateWeeklyResults() {

  if (checkbox.checked == true) {
    weeklyResultsDiv.style.display = 'block';
    actualResults.style.display = 'none';
  }

  if (checkbox.checked != true) {
    weeklyResultsDiv.style.display = 'none';
    actualResults.style.display = 'block';
  }
};

function filterByStatus(status) {
  if (status === 'Production') {
    return state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Production');
  }
  if (status === 'Non-productive time') {
    return state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Non-productive time');
  }
  if (status === 'Training') {
    return state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Training');
  }
  if (status === 'Break') {
    return state.results.filter(arrayWithStatus => arrayWithStatus.status === 'Break');
  }
}




function getTimestamp(array) {
  return array.map(value => value.time);
}

function sumOfStatusTime(arrayOfTimes) {
  return arrayOfTimes.reduce((acc, value) => acc + value, 0);
}


function ifOffline() {
  if (list.value === 'Offline' && checkbox.checked != true) {
    state.results = [];

    document.getElementsByClassName('givenStatusTime')[0].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[1].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[2].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[3].innerHTML = '00 h 00 min 00 sec';
    document.getElementsByClassName('givenStatusTime')[4].innerHTML = '00 h 00 min 00 sec';

  }
}



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
list.addEventListener('change', updateResults);
checkbox.addEventListener('click', updateWeeklyResults);
checkbox.addEventListener('click', ifOffline);
