export class CardEntity {
  constructor(model) {
    this.lvl = model?.lvl ?? 0;
    this.name = model?.name ?? '';
    this.points = model?.points ?? 0;
    this.winner = model?.winner ?? false;
  }
}
