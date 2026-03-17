class Entity {
  constructor(name, maxHealth, health, initiative, type, status) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = health;
    this.initiative = initiative;
    this.type = type;
    status ? this.status = status : this.status = [];
  }

  takeDamage(dmg) {
    if (this.health == 0) {
      console.log("Атака невозможна - цель мертва!");
    } else if (this.health < dmg) {
      this.health = 0;
    } else {
      this.health -= dmg;
    }
  }

  takeHeal(heal) {
    if (this.maxHealth - heal <= this.health) this.health = this.maxHealth;
    else this.health += heal;
  }
}