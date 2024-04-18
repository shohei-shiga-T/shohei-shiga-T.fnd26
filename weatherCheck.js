'use strict'
// 1行目に記載している 'use strict' は削除しないでください

function addZeroToHead(num){
  if( num < 10){
    return "0" + ( num );
  }else {
     return num
  };
}

function addZeroToHeadPlusOne(num){
  const month = num + 1;
  if( month < 10){
    return "0" + month
  }else {
     return month
  };
}

const nowTime = new Date();
const year = nowTime.getFullYear(); 
const month = addZeroToHeadPlusOne(nowTime.getMonth());
const date = addZeroToHead(nowTime.getDate());
const hour = addZeroToHead(nowTime.getHours());
const jmaTime = "" + year + month + date + hour + "0000";
console.log(jmaTime)

const codeOfToyota = "51116";
const codeOfInabu = "51071";
const codeOfOkazaki = "51226";

async function getJmaStatus(){
  const jmaURL = "https://www.jma.go.jp/bosai/amedas/data/map/" + jmaTime + ".json";
  console.log(jmaURL);
  const request = new Request(jmaURL);
  const response = await fetch(request);
  const jmaJSON = await response.json();
  
  displayTemp(jmaJSON)
}

function displayTemp(object) {
  const toyotaTemp = object[codeOfToyota]["temp"][0];
  const inabuTemp = object[codeOfInabu]["temp"][0];
  const simoyamaTemp = toyotaTemp - (( toyotaTemp - inabuTemp)*0.682);
  const simoyamaTempRound = Math.round((simoyamaTemp * 10)) / 10

  const tempArer = document.body.getElementsByClassName("temp-console")[0];
  const paragraph = document.createElement('p');
  paragraph.textContent = simoyamaTempRound + " ℃";
  tempArer.appendChild(paragraph);
}

getJmaStatus();
