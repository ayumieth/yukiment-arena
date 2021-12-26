export default class Card {

  get power() {
    return this.offense + this.defense + this.energy;
  }

  get cost() {
    return parseFloat(this.power * ((Math.random() + 1) * 3));
  }

  constructor(model = {}) {
    this.name = model?.name ?? 0;
    this.image = model?.image ?? '';

    this.number = model?.number ?? 0;
    this.energy = model?.energy ?? 0;
    this.offense = model?.offense ?? 0;
    this.defense = model?.defense ?? 0;
  }
}
