'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// 時刻の一部要素に0を加える関数
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

// 時刻を取得し、JSON取得用の文字列に変換
const nowTime = new Date();
console.log(nowTime);
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

// 地域コード
const codeOfToyota = "51116";
const codeOfInabu = "51071";
const codeOfOkazaki = "51226";

// 注意情報用関数
function alertCheck(temp){
  if (temp < 5) {
    return "路面凍結注意";
  } else if(temp > 28 ){
    return "熱中症注意";
  } else {
    return "注意情報はありません";
  }
}

// jmaJSONから温度を読み取り数値と注意情報をwebページに表示
function displayTemp(object) {
  const toyotaTemp = object[codeOfToyota]["temp"][0];
  const inabuTemp = object[codeOfInabu]["temp"][0];
  const shimoyamaTemp = toyotaTemp - (( toyotaTemp - inabuTemp)*0.682);
  const shimoyamaTempRound = Math.round((shimoyamaTemp * 10)) / 10

  const tempArer = document.body.getElementsByClassName("temp-console")[0];
  const tempParagraph = document.createElement('p');
  tempParagraph.classList.add("shimoyama-temp");
  tempParagraph.textContent = shimoyamaTempRound + " ℃";
  tempArer.appendChild(tempParagraph);
 
  const alertArer = document.body.getElementsByClassName("alert")[0];
  const alertParagraph = document.createElement('p');
  alertParagraph.classList.add("shimoyama-alert");
  alertParagraph.textContent = alertCheck(shimoyamaTemp);
  alertArer.appendChild(alertParagraph);
}

// 下山の天候情報の表示を実行
getJmaStatus();

  

// マウスオーバー用関数
function goToToyota() { 
  // 地区の差し替え
  const toyotaLocation = document.createElement('span');
    toyotaLocation.textContent = "本社地区";
    toyotaLocation.classList.add("toyota-location");
  const shimoyamaLocation = document.body.getElementsByClassName("shimoyama-location")[0];
  const parentLocation = document.body.getElementsByClassName("parent-location")[0];
  parentLocation.replaceChild(toyotaLocation,shimoyamaLocation);

  // 差し替え用JSON取得
  async function getJmaStatus2(){
    const jmaURL = "https://www.jma.go.jp/bosai/amedas/data/map/" + jmaTime + ".json";
    const request = new Request(jmaURL);
    const response = await fetch(request);
    const jmaJSON = await response.json();
  
    changetoToyotaTemp(jmaJSON);
  }
  // 温度の差し替え 下山=>豊田
  function changetoToyotaTemp(object){
      const newTempToyo = document.createElement('p');
      newTempToyo.classList.add("toyota-temp");
      const toyotaTemp = object[codeOfToyota]["temp"][0];
      newTempToyo.textContent = toyotaTemp + " ℃";
      const oldTempShimo = document.body.getElementsByClassName("shimoyama-temp")[0];
      const tempParent =  document.body.getElementsByClassName("temp-console")[0];
      tempParent.replaceChild(newTempToyo,oldTempShimo);

      const newAlertToyo = document.createElement('p');
      newAlertToyo.classList.add("toyota-alert")
      newAlertToyo.textContent = alertCheck(toyotaTemp);
      const oldAlertShimo = document.body.getElementsByClassName("shimoyama-alert")[0];
      const AlertParent =  document.body.getElementsByClassName("alert")[0];
      AlertParent.replaceChild(newAlertToyo,oldAlertShimo);
    
  }

  getJmaStatus2();
}

function backToShimoyama() { 
  const shimoyamaLocationBack = document.createElement('span');
  shimoyamaLocationBack.classList.add("shimoyama-location");
  shimoyamaLocationBack.textContent = "下山地区";
  const toyotaLocation = document.body.getElementsByClassName("toyota-location")[0];
  const parentLocation = document.body.getElementsByClassName("parent-location")[0];
  parentLocation.replaceChild(shimoyamaLocationBack,toyotaLocation);
  
    // 温度の差し替え 下山=>豊田
    async function getJmaStatus3(){
      const jmaURL = "https://www.jma.go.jp/bosai/amedas/data/map/" + jmaTime + ".json";
      const request = new Request(jmaURL);
      const response = await fetch(request);
      const jmaJSON = await response.json();
    
      changetoShimoTemp(jmaJSON);
    }
      
      function changetoShimoTemp(object){
        const newTempShimo = document.createElement('p');
        newTempShimo.classList.add("shimoyama-temp");
        const toyotaTemp = object[codeOfToyota]["temp"][0];
        const inabuTemp = object[codeOfInabu]["temp"][0];
        const shimoyamaTemp = toyotaTemp - (( toyotaTemp - inabuTemp)*0.682);
        const shimoyamaTempRound = Math.round((shimoyamaTemp * 10)) / 10
        newTempShimo.textContent = shimoyamaTempRound + " ℃";
      const oldTempToyo = document.body.getElementsByClassName("toyota-temp")[0];
      const tempParent =  document.body.getElementsByClassName("temp-console")[0];
      tempParent.replaceChild(newTempShimo,oldTempToyo);

      const newAlertShimo = document.createElement('p');
      newAlertShimo.classList.add("shimoyama-alert")
      newAlertShimo.textContent = alertCheck(toyotaTemp);
      const oldAlertToyo = document.body.getElementsByClassName("toyota-alert")[0];
      const AlertParent =  document.body.getElementsByClassName("alert")[0];
      AlertParent.replaceChild(newAlertShimo,oldAlertToyo);
    }
    getJmaStatus3();
  }

// マウスオーバー実行
const toyotaMark = document.getElementsByClassName("toyota-marker")[0];
toyotaMark.addEventListener("mouseover",goToToyota);
toyotaMark.addEventListener("mouseout",backToShimoyama);
