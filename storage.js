saveLibrary = () => {
  let str = JSON.stringify(library);
  localStorage.setItem("library", str);
};
loadLibrary = () => {
  let str = JSON.parse(localStorage.getItem("library"));
  if (str !== null) {
    library = str;
  } else library = [];
};

saveArena = () => {
  let str = JSON.stringify(activeArena);
  localStorage.setItem("activeArena", str);
  // console.log(localStorage.getItem("activeArena"));
};

loadArena = () => {
  let data = JSON.parse(localStorage.getItem("activeArena"));
  console.log('Арена загружена');
  if (data != null) {
    data.forEach(element => {
      console.log(element.status);
      const fighter = new Entity(
        element.name,
        element.maxHealth,
        element.health,
        element.initiative,
        element.type,
        element.status,
      )
      console.log(fighter.status);
      activeArena.push(fighter);
    });
  } else activeArena = [];
};
