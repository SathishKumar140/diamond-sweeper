global.startApp = function(container) {
  const savedData =  localStorage.getItem('diamond-sweaper');
  if(savedData){
    const parseData = JSON.parse(savedData);
    if(!parseData.gameover){
      global.diamonds = parseData.diamonds;
      global.gameover = parseData.gameover;
      global.lastSuggestion = parseData.lastSuggestion;
      document.querySelectorAll('[data-cell]').forEach((cell,index)=>{
        cell.classList.forEach((list,i)=>{
          cell.classList.remove(cell.classList[1]);
          cell.classList.add(parseData.cells[index].classList[1]);
          cell.classList.add(parseData.cells[index].classList[2]);
        })
      })
      global.setMessage(parseData.message);
    }else{
      global.diamonds = global.generateRandomNumbers();
      global.gameover = false;
    }
  }else{
    document.querySelectorAll('[data-cell]').forEach((cell,index)=>{
      cell.classList.forEach((list,i)=>{
        cell.classList.remove(cell.classList[1]);
        cell.classList.add('unknown');
      })
    })
    global.setMessage("Please click unknown boxes to find you diamond :-)");
    global.diamonds = global.generateRandomNumbers();
    global.gameover = false;
  }
}
global.selectedCell = function(target) {
  let message = '';
  if(target.classList.contains('unknown') && !global.gameover){
    const cell = parseInt(target.dataset.cell);
    if(global.lastSuggestion){
      const lastSuggestionTarget = document.querySelector("[data-cell='"+global.lastSuggestion+"']");
      lastSuggestionTarget.classList.remove('arrow');
    }
    target.classList.remove('unknown');
    const index = global.diamonds.indexOf(cell);
    if(index > -1){
      target.classList.add('diamond');
      global.diamonds.splice(index,1);
      const score = global.calculateScore();
      if(global.diamonds.length === 0){
        message = 'Game over !!! your score is ' + score;
        global.setMessage(message);
        global.gameover = true;
      }else{
        global.setMessage('Current Score - '+ score +' Diamonds left -' + global.diamonds.length)
      }
    }else{
      const score = global.calculateScore();
      global.lastSuggestion = cell;
      target.classList.add('arrow');
      const closestDiamond = global.closest(cell, global.diamonds);
      const selectedCellDirection = Math.floor(cell/8);
      const nearestCellDirection = Math.floor(closestDiamond/8);
      if((selectedCellDirection === nearestCellDirection) && cell > closestDiamond){
        target.classList.add('left');
      }else if(selectedCellDirection < nearestCellDirection ){
        target.classList.add('bottom');
      }else if(selectedCellDirection > nearestCellDirection ){
        target.classList.add('top');
      }
      message = 'Current Score - '+ score +' Diamonds left -' + global.diamonds.length
      global.setMessage(message);
    }
  }
  global.save(message);
}

global.save = function(message){
  const cells = [];
  document.querySelectorAll("[data-cell]").forEach((data)=>{
    cells.push({classList:data.classList})
  })
  localStorage.setItem('diamond-sweaper',JSON.stringify({diamonds:global.diamonds,gameover:global.gameover,cells:cells,lastSuggestion:global.lastSuggestion,message:message}));
}

global.restartGame = function(){
  localStorage.removeItem('diamond-sweaper');
  global.startApp();
}

global.setMessage = function(message){
  document.querySelector('.messages').innerHTML =  message;
}

global.calculateScore = function(){
  const datacells = document.querySelectorAll("[data-cell]");
  let score = 0;
  datacells.forEach(function(cell){
    cell.classList.contains('unknown') ? score += 1 : score;
  })
  return score
}

global.generateRandomNumbers = function(){
  let arr = []
  while(arr.length < 8){
      const randomnumber = Math.ceil(Math.random()*63)
      if(arr.indexOf(randomnumber) > -1) continue;
      arr[arr.length] = randomnumber;
  }
  return arr
}

global.closest = function(num, arr) {
  let curr = arr[0];
  let diff = Math.abs (num - curr);
  for (let val = 0; val < arr.length; val++) {
      const newdiff = Math.abs (num - arr[val]);
      if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
      }
  }
  return curr;
}