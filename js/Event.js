// eslint-disable-next-line no-var
var OregonH = OregonH || {};

class EventType {
  constructor(type, notification, text) {
    this.type = type;
    this.notification = notification;
    this.text = text;
  }
}

class StatChange extends EventType {
  constructor(type, notification, text, value, stat) {
    super(type, notification, text);
    this.value = value;
    this.stat = stat;
  }
}

class ShopEvent extends EventType {
  constructor(type, notification, text, products) {
    super(type, notification, text);
    this.products = products;
  }
}

function makeEvent(obj) {
  const {
    type,
    notification,
    text,
    value,
    products,
    stat,
  } = obj;
  switch (obj.type) {
    case 'ATTACK':
      return new EventType(type, notification, text)
    case 'STAT-CHANGE':
      return new StatChange(type, notification, text, value, stat)
    case 'SHOP':
      return new ShopEvent(type, notification, text, products)
    default:
      return {};
  }
}


//  ---------------------------------------------------------

class GameEvent {
  constructor(data) {
    this.eventTypes = [];
    // this.data = data;
    this.populateEventTypes(data);
  }

  populateEventTypes(data) {
    //  eslint-disable-next-line no-undef
    for (let i = 0; i < data.length; i += 1) {
      // eslint-disable-next-line no-undef
      const obj = data[i];
      const event = makeEvent(obj);
      this.eventTypes.push(event);
    }
  }

  generateEvent() {
    const eventIndex = Math.floor(Math.random() * this.eventTypes.length);
    const eventData = this.eventTypes[eventIndex];

    //  events that consist in updating a stat
    if (eventData.type === 'STAT-CHANGE') {
      this.stateChangeEvent(eventData);
    } else if (eventData.type === 'SHOP') {
      //  pause game
      this.game.pauseJourney();

      //  notify user
      this.ui.notify(eventData.text, eventData.notification);

      //  prepare event
      this.shopEvent(eventData);
    } else if (eventData.type === 'ATTACK') {
      //  pause game
      this.game.pauseJourney();

      //  notify user
      this.ui.notify(eventData.text, eventData.notification);

      //  prepare event
      this.attackEvent(eventData);
    }
  }


  stateChangeEvent(eventData) {
  //  can't have negative quantities
    if (eventData.value + this.caravan[eventData.stat] >= 0) {
      this.caravan[eventData.stat] += eventData.value;
      this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
    }
  }

  shopEvent(eventData) {
    //  number of products for sale
    const numProds = Math.ceil(Math.random() * 4);

    //  product list
    const products = [];
    let j;
    let priceFactor;

    for (let i = 0; i < numProds; i += 1) {
      //  random product
      j = Math.floor(Math.random() * eventData.products.length);

      //  multiply price by random factor +-30%
      priceFactor = 0.7 + 0.6 * Math.random();

      products.push({
        item: eventData.products[j].item,
        qty: eventData.products[j].qty,
        price: Math.round(eventData.products[j].price * priceFactor)
      });
    }

    this.ui.showShop(products);
  }

  attackEvent() {
    const firepower = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_FIREPOWER_AVG);
    const gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);

    this.ui.showAttack(firepower, gold);
  }
}

OregonH.Event = new GameEvent(data);

// OregonH.Event.eventTypes = [];

//  OregonH.Event.generateEvent = function generateEvent() {
//  pick random one


// OregonH.Event.stateChangeEvent = function(eventData) {

// };

// OregonH.Event.shopEvent = function(eventData) {
// };

// //prepare an attack event
// OregonH.Event.attackEvent = function(eventData){
// }
