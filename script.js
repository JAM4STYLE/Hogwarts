window.addEventListener("DOMContentLoaded", start);
let bloodArray = [];
function start() {
  const close = document.querySelector("h3");
  const background = document.querySelector(".background");
  const modal = document.querySelector(".modal");
  close.addEventListener("click", function () {
    background.classList.add("hidden");
    modal.classList.remove(housename);
  });
  fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then((res) => res.json())
    .then(appendBlood);

  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((res) => res.json())
    .then(studentlist);
}
const prefectClose = document.querySelector(".prefectX");
const prefectBg = document.querySelector(".prefectBg");
prefectClose.addEventListener("click", function () {
  prefectBg.classList.add("hidden");
});
const objectPrototype = {
  firstName: "",
  lastName: undefined,
  middleName: undefined,
  nickName: undefined,
  image: "",
  house: "",
  blood: "",
  prefect: false,
  expelled: false,
  inquisitorial: false,
  hackedBlood: undefined,
};
let hacked = false;
const newArray = [];
let currentArray;
const expelledArray = [];
let housename = "";
function studentlist(names) {
  console.log(names);
  names.forEach(cleanData);
  createCurrent(); // newArray.forEach(lookingin);
}
function createCurrent() {
  currentArray = newArray;
  sorting();
}
function capitalize(name) {
  if (name.indexOf("-") != -1) {
    console.log("contains");
  }
  return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
}
function appendBlood(family) {
  bloodArray = family;
  console.log(bloodArray);
}
function cleanData(badStudent) {
  let newStudent = Object.create(objectPrototype);
  badStudent.fullname = badStudent.fullname.trim();
  if (badStudent.fullname.indexOf(" ") > 0) {
    newStudent.firstName = badStudent.fullname.substring(0, badStudent.fullname.indexOf(" "));
  } else {
    newStudent.firstName = badStudent.fullname;
  }
  newStudent.firstName = capitalize(newStudent.firstName);

  if (badStudent.fullname.indexOf(" ") > 0) {
    newStudent.lastName = badStudent.fullname.substring(badStudent.fullname.lastIndexOf(" ") + 1);
    newStudent.lastName = capitalize(newStudent.lastName);
    newStudent.image = `${newStudent.lastName.toLowerCase()}_${newStudent.firstName.charAt(0).toLowerCase()}`;
  }
  if (badStudent.fullname.indexOf(" ") != badStudent.fullname.lastIndexOf(" ")) {
    if (badStudent.fullname.indexOf(`"`) > 0) {
      newStudent.nickName = badStudent.fullname.substring(badStudent.fullname.indexOf(`"`), badStudent.fullname.lastIndexOf(`"`) + 1);
      newStudent.nickName = newStudent.nickName.charAt(0) + newStudent.nickName.charAt(1).toUpperCase() + newStudent.nickName.substring(2).toLowerCase();
    } else {
      newStudent.middleName = badStudent.fullname.substring(badStudent.fullname.indexOf(" ") + 1, badStudent.fullname.lastIndexOf(" "));
      newStudent.middleName = capitalize(newStudent.middleName);
    }
  }

  newStudent.house = badStudent.house.trim();
  newStudent.house = newStudent.house.charAt(0).toUpperCase() + newStudent.house.substring(1).toLowerCase();
  const pureBlood = bloodArray.pure.filter((family) => newStudent.lastName === family);
  if (pureBlood.length > 0) {
    const halfBlood = bloodArray.half.filter((family) => newStudent.lastName === family);
    if (halfBlood.length > 0) {
      newStudent.blood = "Half Blood";
    } else {
      newStudent.blood = "Pure Blood";
    }
  } else {
    const isHalf = bloodArray.half.filter((family) => newStudent.lastName === family);
    if (isHalf.length > 0) {
      newStudent.blood = "Half Blood";
    } else {
      newStudent.blood = "Muggle Born";
    }
  }

  newArray.push(newStudent);
  console.log(newStudent.firstName + " " + newStudent.middleName + " " + newStudent.lastName);
}

function lookingin(studentinfo) {
  const template = document.querySelector("template").content;
  const templateCopy = template.cloneNode(true);
  const templateName = templateCopy.querySelector(".name");

  templateName.textContent = [studentinfo.firstName, studentinfo.middleName, studentinfo.nickName, studentinfo.lastName].join(" ");
  const bigBox = templateCopy.querySelector(".bigBox");
  bigBox.classList.add(studentinfo.house);
  const prefectButton = templateCopy.querySelector(".prefect");
  const expellBtn = templateCopy.querySelector(".expell");
  const inquisitorialButton = templateCopy.querySelector(".inquisitorial");

  if (hacked == true) {
    if (studentinfo.blood == "Pure Blood") {
      const bloodType = ["Pure Blood", "Half Blood", "Muggle Born"];
      const random = Math.floor(Math.random() * 3);
      studentinfo.hackedBlood = bloodType[random];
    } else {
      studentinfo.hackedBlood = "Pure Blood";
    }
    if (studentinfo.hackedBlood === "Pure Blood" || studentinfo.house === "Slytherin") {
      inquisitorialButton.classList.remove("hidden");
      if (studentinfo.inquisitorial == true) {
        inquisitorialButton.textContent = "Remove from Inquisitorial";
      } else {
        inquisitorialButton.textContent = "Join Inquisitorial";
      }
    }
  } else {
    expellBtn.classList.remove("hidden");

    if (studentinfo.blood === "Pure Blood" || studentinfo.house === "Slytherin") {
      inquisitorialButton.classList.remove("hidden");
      if (studentinfo.inquisitorial == true) {
        inquisitorialButton.textContent = "Remove from Inquisitorial";
      } else {
        inquisitorialButton.textContent = "Join Inquisitorial";
      }
    }
  }

  if (studentinfo.expelled == true) {
    expellBtn.classList.add("hidden");
    inquisitorialButton.classList.add("hidden");
    prefectButton.classList.add("hidden");
  }
  inquisitorialButton.addEventListener("click", () => {
    if (studentinfo.inquisitorial == true) {
      studentinfo.inquisitorial = false;
      inquisitorialButton.textContent = "Join Inquisitorial";
    } else {
      studentinfo.inquisitorial = true;
      inquisitorialButton.textContent = "Remove from Inquisitorial";
      if (hacked == true) {
        setTimeout(() => {
          studentinfo.inquisitorial = false;
          inquisitorialButton.textContent = "Join Inquisitorial";
        }, 200);
      }
    }
  });
  if (studentinfo.prefect == false) {
    prefectButton.textContent = "Appoint Prefect";
  } else {
    prefectButton.textContent = "Remove Prefect";
  }
  prefectButton.addEventListener("click", () => {
    if (studentinfo.prefect == false) {
      const checkPrefect = currentArray.filter((studentPrefect) => studentPrefect.prefect);
      const prefectHouse = checkPrefect.filter((prefect) => prefect.house == studentinfo.house);
      if (prefectHouse.length < 2) {
        studentinfo.prefect = true;
        prefectButton.textContent = "Remove Prefect";
      } else {
        prefectBg.classList.remove("hidden");
        document.querySelector(".prefect1name").textContent = [prefectHouse[0].firstName, prefectHouse[0].middleName, prefectHouse[0].nickName, prefectHouse[0].lastName].join(" ");
        document.querySelector(".prefect2name").textContent = [prefectHouse[1].firstName, prefectHouse[1].middleName, prefectHouse[1].nickName, prefectHouse[1].lastName].join(" ");
        document.querySelector(".prefect1").addEventListener("click", () => {
          prefectHouse[0].prefect = false;
          studentinfo.prefect = true;
          prefectBg.classList.add("hidden");
          prefectButton.textContent = "Remove Prefect";
          displayList(currentArray);
        });
        document.querySelector(".prefect2").addEventListener("click", () => {
          prefectHouse[1].prefect = false;
          studentinfo.prefect = true;
          prefectBg.classList.add("hidden");
          prefectButton.textContent = "Remove Prefect";
          displayList(currentArray);
        });
      }
    } else {
      studentinfo.prefect = false;
      prefectButton.textContent = "Appoint Prefect";
    }
  });

  expellBtn.addEventListener("click", () => {
    if (studentinfo.lastName == "Jinaru") {
      document.querySelector(".errorBg").classList.remove("hidden");
      document.querySelector(".errorX").addEventListener("click", () => {
        document.querySelector(".errorBg").classList.add("hidden");
      });
    } else {
      studentinfo.inquisitorial = false;
      studentinfo.prefect = false;
      studentinfo.expelled = true;
      newArray.splice(newArray.indexOf(studentinfo), 1);
      expelledArray.push(studentinfo);
      bigBox.classList.add("expelled");
      setTimeout(() => {
        displayList(currentArray);
      }, 500);
    }
  });

  templateCopy.querySelector(".name").addEventListener("click", function () {
    const background = document.querySelector(".background");
    background.classList.remove("hidden");
    const home = document.querySelector(".house");
    home.textContent = studentinfo.house;
    const modalname = document.querySelector(".modalname");
    modalname.textContent = templateName.textContent;
    const crest = document.querySelector(".crestpic");
    crest.setAttribute("src", `${studentinfo.house}.png`);
    const modal = document.querySelector(".modal");
    housename = studentinfo.house;
    const statusBlood = document.querySelector(".bloodStatus");

    if (hacked == true) {
      statusBlood.textContent = studentinfo.hackedBlood;
    } else {
      statusBlood.textContent = studentinfo.blood;
    }
    modal.classList.add(housename);
    if (studentinfo.inquisitorial == true) {
      document.querySelector(".isInq").classList.remove("hidden");
    } else {
      document.querySelector(".isInq").classList.add("hidden");
    }
    if (studentinfo.prefect == true) {
      document.querySelector(".isPrefect").classList.remove("hidden");
    } else {
      document.querySelector(".isPrefect").classList.add("hidden");
    }
    const profilImage = document.querySelector(".studentpic");
    let imagePath;
    let imageCheck = newArray.filter(imageNameCheck);
    if (imageCheck.length > 1) {
      imagePath = `${studentinfo.lastName.toLowerCase()}_${studentinfo.firstName.toLowerCase()}`;
      console.log(imagePath);
    } else {
      imagePath = `${studentinfo.image}`;
      console.log(imagePath);
    }

    profilImage.src = `images/${imagePath}.png`;
    function imageNameCheck(studentName) {
      return studentinfo.lastName === studentName.lastName;
    }
  });

  document.querySelector(".studentList").appendChild(templateCopy);
}
const search = document.getElementById("myInput");
search.addEventListener("input", searchField);

function searchField() {
  searched = currentArray.filter(isSearch);
  displayList(searched);
  console.log(searched);
}
function isSearch(student) {
  studentFull = [student.firstName, student.middleName, student.nickName, student.lastName].join(" ");

  if (studentFull.toUpperCase().indexOf(search.value.toUpperCase()) > -1) {
    return true;
  }
}

function displayList(student) {
  document.querySelector(".studentList").innerHTML = "";
  student.forEach(lookingin);
}
const filter = document.getElementById("filterButton");
filter.addEventListener("click", filterField);
let getValue;
function filterField() {
  getValue = document.querySelector("#filterBy").value;
  console.log(getValue);

  const filtered = newArray.filter(isFilter);
  if (getValue === "Expelled") {
    currentArray = expelledArray;
  } else {
    currentArray = filtered;
  }

  displayList(currentArray);
  console.log(filtered);
}
function isFilter(student) {
  if (getValue === "default") {
    return true;
  } else if (getValue === "Prefects") {
    return student.prefect;
  } else if (getValue === "Inquisitorial") {
    return student.inquisitorial;
  } else {
    return student.house === getValue;
  }
}
const sort = document.querySelector("#sortButton");
sort.addEventListener("click", sorting);
function sorting() {
  const sortValue = document.querySelector("#sortBy").value;
  console.log(sortValue);
  if (sortValue == "First Name") {
    currentArray.sort(sortFirstN);
  } else if (sortValue == "Last Name") {
    currentArray.sort(sortLastN);
  } else if (sortValue == "House") {
    currentArray.sort(sortHouse);
  }
  displayList(currentArray);
}
function sortFirstN(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else if (a.firstName > b.firstName) {
    return 1;
  }
  return 0;
}
function sortLastN(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else if (a.lastName > b.lastName) {
    return 1;
  }
  return 0;
}
function sortHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else if (a.house > b.house) {
    return 1;
  }
  return 0;
}
function setColor() {
  const red = randomColor();
  const blue = randomColor();
  const green = randomColor();
  return `rgb(${red}, ${green}, ${blue})`;
}
function randomColor() {
  const rndColor = Math.floor(Math.random() * 256);
  return rndColor;
}
function hackTheSystem() {
  if (hacked == false) {
    const andy = {
      firstName: "Andrei",
      lastName: "Jinaru",
      middleName: "",
      nickName: undefined,
      image: "jinaru_a",
      house: "Gryffindor",
      blood: "Pure Blood",
      prefect: false,
      expelled: false,
      inquisitorial: false,
      hackedBlood: undefined,
    };
    newArray.push(andy);
    console.log(newArray);
    hacked = true;
    createCurrent();
    document.querySelector(".title").textContent = "Hacked " + document.querySelector(".title").textContent;
    changeBody();
  }
}
document.addEventListener("keydown", (a) => {
  console.log(a.which);
  if (a.key === "a") {
    hackTheSystem();
  }
});
function changeBody() {
  document.querySelector("body").style.backgroundColor = setColor();
  setTimeout(() => {
    changeBody();
  }, 100);
}
