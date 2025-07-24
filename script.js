/* eslint-disable no-alert */
//store to localstorage

function storeToLocalStorage(data){
  localStorage.setItem('CoffeeCount', JSON.stringify(data));//convert object into string as localstorage store only strings datatype.

}

function loadPreviousValue() {
  const saved = localStorage.getItem('CoffeeCount');
  if (saved) {
    return JSON.parse(saved); // Convert back to object
  }
  return null;
}

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here

  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
  renderProducers(data);
}

function clickCoffee(data) {
  //value of coffeee is coming
  // your code here
  data.coffee++;
  updateCoffeeView(data.coffee);
  storeToLocalStorage(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  for (let producer of producers) {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter((d) => {
    return d.unlocked === true;
  });
}

function makeDisplayNameFromId(id) {
  // your code here
  let arr = id.split("_");

  let titleCase = "";

  for (let i = 0; i < arr.length; i++) {
    titleCase += arr[i][0].toUpperCase() + arr[i].slice(1);

    if (i < arr.length - 1) {
      titleCase += " ";
    }
  }

  return titleCase;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById("producer_container");

  unlockProducers(data.producers, data.coffee);
  //get list of unlocked producers
  let listOfUnlockedProducers = getUnlockedProducers(data);
  console.log("Unlocked producers:", listOfUnlockedProducers);

  deleteAllChildNodes(producerContainer);

  for (let list of listOfUnlockedProducers) {
    producerContainer.append(makeProducerDiv(list));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let producer of data.producers) {
    if (producer.id === producerId) {
      return producer;
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here

  for (let producer of data.producers) {
    if (producer.id === producerId) {
      return data.coffee >= producer.price;
    }
  }
}

function updateCPSView(cps) {
  // your code here

  const cpsIndicator = document.getElementById("cps");
  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor((oldPrice * 125) / 100);
}

function attemptToBuyProducer(data, producerId) {
  // your code here


  let listOfCanAfford = canAffordProducer(data, producerId);
  if (listOfCanAfford) {
    //true;

    let producer = getProducerById(data, producerId);

    producer.qty++;
    data.coffee = data.coffee - producer.price;

    producer.price = updatePrice(producer.price);
    data.totalCPS = data.totalCPS + producer.cps;
    storeToLocalStorage(data);
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  // your code here
 
  if (event.target.tagName !== "BUTTON") return;
  const producerId = event.target.id.slice(4); 


  if(attemptToBuyProducer(data, producerId)){
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    renderProducers(data);
    storeToLocalStorage(data);

  } 
  else {
    window.alert("Not enough coffee!");
  }
}



function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
  storeToLocalStorage(data);
}




/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = loadPreviousValue() ||  window.data;
if(loadPreviousValue()){
  updateCoffeeView(data.coffee) //0
  updateCPSView(data.totalCPS) //0
  renderProducers(data)
}

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
