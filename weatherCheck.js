'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// 時刻を取得する
function addZeroToHead(num){
  if( num < 10){
    return "0" + ( num );
  }else {
     return num;
  };
}

function addZeroToHeadPlusOne(num){
  const month = num + 1;
  if( month < 10){
    return "0" + month;
  }else {
     return month;
  };
}

const nowTime = new Date();
const year = nowTime.getFullYear(); 
const month = addZeroToHeadPlusOne(nowTime.getMonth());
const date = addZeroToHead(nowTime.getDate());
const hour = function() {
  const hor = nowTime.getHours();
  const min = nowTime.getMinutes();
  if (min < 10){
    return addZeroToHead(hor - 1);
  } else{
    return addZeroToHead(hor);
  } 
}
const minutes = function() {
  const minComv = [5,0,1,2,3,4];
  const min = Math.floor(nowTime.getMinutes() / 10);
  return minComv[min];
} 

const jmaTime = "" + year + month + date + hour() + minutes() + "000";
console.log(jmaTime);

// 地域コード
const codeOfToyota = "51116";
const codeOfInabu = "51071";
const codeOfOkazaki = "51226";

// 気象庁のJSONを取得、オブジェクト化
// オブジェクト化したjmaJSONを引数としてdisplayTempを実行
async function getJmaStatus(){
  const jmaURL = "https://www.jma.go.jp/bosai/amedas/data/map/" + jmaTime + ".json";
  console.log(jmaURL);
  const request = new Request(jmaURL);
  const response = await fetch(request);
  const jmaJSON = await response.json();
  
  displayTemp(jmaJSON);
}

// jmaJSONから温度を読み取り数値と注意情報をwebページに表示
function displayTemp(object) {
  const toyotaTemp = object[codeOfToyota]["temp"][0];
  const inabuTemp = object[codeOfInabu]["temp"][0];
  const shimoyamaTemp = toyotaTemp - (( toyotaTemp - inabuTemp)*0.682);
  const shimoyamaTempRound = Math.round((shimoyamaTemp * 10)) / 10

  const tempArer = document.body.getElementsByClassName("temp-console")[0];
  const tempParagraph = document.createElement('p');
  tempParagraph.textContent = shimoyamaTempRound + " ℃";
  tempArer.appendChild(tempParagraph);

  function alertCheck(temp){
    if (temp < 5) {
      return "路面凍結注意";
    } else if(temp > 28 ){
      return "熱中症注意";
    } else {
      return "注意情報はありません";
    }
  }
 
  const alertArer = document.body.getElementsByClassName("alert")[0];
  const alertParagraph = document.createElement('p');
  alertParagraph.textContent = alertCheck(shimoyamaTemp);
  alertArer.appendChild(alertParagraph);
}

getJmaStatus();
