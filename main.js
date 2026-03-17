let library = [];
let activeArena = [];
const libraryArea = document.querySelector(".library-container");
const arenaArea = document.querySelector(".arena-container");

summon = (id, init) => {
  const creatureData = library.find((item) => item.id === id);
  const fighter = new Entity(
    creatureData.name,
    creatureData.maxHealth,
    creatureData.health,
    init,
    creatureData.type,
  );
  activeArena.push(fighter);
  // console.log(`${fighter.name} был призван на арену!`);
};

renderLibrary = () => {
  const libraryCont = document.querySelector(".library-container");
  libraryCont.innerHTML = "";
  if (library !== null) {
    library.forEach((element) => {
      const card = createLibraryCard(element);
      libraryArea.append(card);
    });
  }
  const showBtn = document.querySelector(".libraryAddButton");
  showBtn.addEventListener("click", () => {
    showAddEntity();
  });
};

renderArena = () => {
  sortArena();
  arenaArea.innerHTML = "";
  activeArena.forEach((element) => {
    const card = createArenaCard(element);
    arenaArea.append(card);
  });
  saveArena();
};

renderEffect = (arenaElem, element) => {
  const statusField = arenaElem.querySelector(".statusField");
  statusField.innerHTML = "";
  element.status.forEach((statusElem) => {
    const effect = document.createElement("button");
    effect.innerHTML = `${statusElem}`;
    effect.classList.add("closeEffectBtn");
    effect.addEventListener("click", () => {
      const index = element.status.indexOf(effect.textContent);
      if (index !== -1) {
        element.status.splice(index, 1);
        renderEffect(arenaElem, element);
      }
    });
    statusField.append(effect);
  });
  saveArena();
};

sortArena = () => {
  activeArena.sort((a, b) => b.initiative - a.initiative);
};

showAddEntity = () => {
  const addEntityPanel = document.querySelector(".addEntity");
  const closeBtn = document.querySelector(".addEntityCloseBtn");

  const mainContainer = document.querySelector(".main-container");
  const header = document.querySelector("header");

  closeBtn.addEventListener("click", () => {
    addEntityPanel.classList.remove("show");
    mainContainer.classList.remove("blur");
    header.classList.remove("blur");
  });
  addEntityPanel.classList.add("show");
  mainContainer.classList.add("blur");
  header.classList.add("blur");

  const createEntityBtn = document.querySelector(".addEntityBtn");
  createEntityBtn.addEventListener("click", () => {
    const inputName = document.querySelector(".inputName");
    const inputHP = document.querySelector(".inputHP");
    const inputType = document.querySelector(".inputType");
    console.log(inputHP.value);
    if (inputName.value !== "" && inputHP.value !== "" && inputType.value !== "" && inputHP.value >= 0) {
      library.push({
        id: Date.now(),
        name: inputName.value,
        maxHealth: inputHP.value,
        health: inputHP.value,
        initiative: 0,
        type: inputType.value,
      });
      console.log(library);
      saveLibrary();
      renderLibrary();
      inputName.value = "";
      inputHP.value = "";
      inputType.value = "";
    }
  });
};

setTypeClass = (object, type) => {
  if (type == "Игрок") object.classList.add("player");
  else if (type == "Враг") object.classList.add("enemy");
  else object.classList.add("npc");
};

createArenaCard = (element) => {
  const arenaElem = document.createElement("div");
  arenaElem.innerHTML = `
      <button class="closeBtn">X</button>
      <p class="name"><b>Имя:</b> ${element.name}</p>
      <p class="health"><b>Здоровье:</b> ${element.health}</p>
      <p class="type"><b>Тип:</b> ${element.type}</p>
      <div class="statusField"></div>
      <hr>
      <p class="initiative"><b>Инициатива: </b> ${element.initiative}</p>
      <hr>
      <button class="healBtn">Лечение</button>
      <input class="inputField dmgHeal" type="text">
      <button class="dmgBtn">Урон</button>
      <hr>
      <input class="statusInput" type"text">
      <button class="addStatusBtn">Добавить статус</button>
    `;
  arenaElem.classList.add("entityCard");
  setTypeClass(arenaElem, element.type);

  if (element.health === 0) {
    arenaElem.classList.add("death");
  }

  renderEffect(arenaElem, element);

  const healBtn = arenaElem.querySelector(".healBtn");
  const dmgBtn = arenaElem.querySelector(".dmgBtn");
  const closeBtn = arenaElem.querySelector(".closeBtn");
  const inputDmgHeal = arenaElem.querySelector(".dmgHeal");

  const statusBtn = arenaElem.querySelector(".addStatusBtn");
  const statusInput = arenaElem.querySelector(".statusInput");

  healBtn.addEventListener("click", () => {
    if (!isNaN(Number(inputDmgHeal.value))) {
      element.takeHeal(Number(inputDmgHeal.value));
      renderArena();
    }
  });
  dmgBtn.addEventListener("click", () => {
    if (!isNaN(Number(inputDmgHeal.value))) {
      element.takeDamage(Number(inputDmgHeal.value));
      renderArena();
    }
  });
  closeBtn.addEventListener("click", () => {
    const index = activeArena.indexOf(element);
    if (index !== -1) {
      activeArena.splice(index, 1);
      renderArena();
    }
  });
  statusBtn.addEventListener("click", () => {
    element.status.push(statusInput.value);
    renderEffect(arenaElem, element);
    statusInput.value = "";
  });
  return arenaElem;
};

createLibraryCard = (element) => {
  const libraryElem = document.createElement("div");
  libraryElem.innerHTML = `
    <div class="library-card-container">
      <button class="libraryCardCloseBtn">X</button>
      
      <div class="library-card-info">
        <p><b>Имя:</b> ${element.name}</p>
        <p><b>Здоровье:</b> ${element.health}</p>
        <p><b>Тип:</b> ${element.type}</p>
      </div>
    </div>

    <label for=""><b>Инициатива:</b> </label>
    <input type="text" class="inputField">
    <button class="libraryCardAddBtn">Добавить</button>
    `;
  libraryElem.classList.add("libraryCard");
  setTypeClass(libraryElem, element.type);

  const btn = libraryElem.querySelector(".libraryCardAddBtn");
  const input = libraryElem.querySelector("input");
  btn.addEventListener("click", () => {
    let init = input.value;
    if (isNaN(Number(init))) {
      init = 0;
    }
    summon(element.id, Number(init));
    renderArena();
  });

  const closeLibraryCardBtn = libraryElem.querySelector(".libraryCardCloseBtn");
  closeLibraryCardBtn.addEventListener("click", () => {
    const index = library.indexOf(element);
    if (index !== -1) {
      library.splice(index, 1);
      saveLibrary();
      renderLibrary();
    }
  });
  return libraryElem;
};

loadArena();
loadLibrary();
renderArena();
renderLibrary();
