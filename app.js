const defaultText = "The quick brown fox jumps over the lazy dog";
let text = defaultText;
let timer;
let timeLeft;
let totalTime = 60;
let performanceData = [];

const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");

function renderText(){
  textDisplay.innerHTML="";
  text.split("").forEach(char=>{
    const span=document.createElement("span");
    span.innerText=char;
    textDisplay.appendChild(span);
  });
}
renderText();

function startTest(){
  totalTime=parseInt(document.getElementById("timeSelect").value);
  timeLeft=totalTime;
  input.disabled=false;
  input.value="";
  input.focus();

  timer=setInterval(()=>{
    timeLeft--;
    document.getElementById("time").innerText=timeLeft;
    if(timeLeft<=0) finishTest();
  },1000);
}

function finishTest(){
  clearInterval(timer);
  input.disabled=true;
  saveScore();
  updateChart();
}

input.addEventListener("input",()=>{
  const chars=textDisplay.querySelectorAll("span");
  const typed=input.value.split("");
  let correct=0;

  chars.forEach((span,i)=>{
    if(typed[i]==null){
      span.classList.remove("correct","incorrect");
    } else if(typed[i]===span.innerText){
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correct++;
    } else{
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  let wpm=Math.round((correct/5)/((totalTime-timeLeft)/60))||0;
  let cpm=correct*60/(totalTime-timeLeft)||0;
  let accuracy=Math.round((correct/typed.length)*100)||100;

  document.getElementById("wpm").innerText=wpm;
  document.getElementById("cpm").innerText=Math.round(cpm);
  document.getElementById("accuracy").innerText=accuracy;

  performanceData.push(wpm);
});

function restartTest(){
  clearInterval(timer);
  input.value="";
  input.disabled=true;
  renderText();
}

function toggleTheme(){
  document.body.classList.toggle("light");
}

function saveScore(){
  let scores=JSON.parse(localStorage.getItem("proScores"))||[];
  scores.push(document.getElementById("wpm").innerText);
  scores.sort((a,b)=>b-a);
  localStorage.setItem("proScores",JSON.stringify(scores.slice(0,10)));
  displayScores();
}

function displayScores(){
  const scores=JSON.parse(localStorage.getItem("proScores"))||[];
  const list=document.getElementById("scores");
  list.innerHTML="";
  scores.forEach(s=>{
    const li=document.createElement("li");
    li.innerText=s+" WPM";
    list.appendChild(li);
  });
}
displayScores();

function updateChart(){
  new Chart(document.getElementById("performanceChart"),{
    type:"line",
    data:{
      labels:performanceData.map((_,i)=>i),
      datasets:[{
        label:"WPM Trend",
        data:performanceData
      }]
    }
  });
}

function showDashboard(){
  document.getElementById("dashboard").classList.toggle("hidden");
}

function generateAIText(){
  text="Practice makes progress. Focus, speed, precision, consistency.";
  renderText();
}

function startMultiplayer(){
  alert("Multiplayer module ready for WebSocket backend integration.");
}
