var OregonH = OregonH || {};

class Caravan {
  init(stats) {
    this.day = stats.day;
    this.distance = stats.distance;
    this.crew = stats.crew;
    this.food = stats.food;
    this.oxen = stats.oxen;
    this.money = stats.money;
    this.firepower = stats.firepower;
  }

  consumeFood() {
    this.food -= this.crew * OregonH.FOOD_PER_PERSON;

    if (this.food < 0) {
      this.food = 0;
    }
  }

  updateWeight() {
    let droppedFood = 0;
    let droppedGuns = 0;

    //  how much can the caravan carry
    this.capacity = this.oxen * OregonH.WEIGHT_PER_OX + this.crew * OregonH.WEIGHT_PER_PERSON;

    //  how much weight do we currently have
    this.weight = this.food * OregonH.FOOD_WEIGHT + this.firepower * OregonH.FIREPOWER_WEIGHT;

    //  drop things behind if it's too much weight
    //  assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
      this.firepower -= 1;
      this.weight -= OregonH.FIREPOWER_WEIGHT;
      droppedGuns += 1;
    }

    if (droppedGuns) {
      this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
    }

    while (this.food && this.capacity <= this.weight) {
      this.food -= 1;
      this.weight -= OregonH.FOOD_WEIGHT;
      droppedFood += 1;
    }

    if (droppedFood) {
      this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
    }
  }

  updateDistance() {
    const diff = this.capacity - this.weight;
    const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
    this.distance += speed;
  }
}
// OregonH.Caravan = {};
OregonH.Caravan = new Caravan();
// OregonH.Caravan.init = function(stats){
// };

// //update weight and capacity
// OregonH.Caravan.updateWeight = function(){
// };

// //update covered distance
// OregonH.Caravan.updateDistance = function() {
//   //the closer to capacity, the slower

// };

// //food consumption
// OregonH.Caravan.consumeFood = function() {
// };
