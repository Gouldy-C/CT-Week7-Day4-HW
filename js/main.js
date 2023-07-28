const themeBtn = document.querySelector(".themeBtn");
const body = document.querySelector(".body");
const bodyClasses = body.classList;
const themeBtnClasses = themeBtn.classList;
const navBar = document.querySelector(".navbar");
const selectYear = document.querySelector("#season");
const selectRace = document.querySelector("#race");
const resultsNum = document.querySelector("#numResults");
const searchBtn = document.querySelector("#searchBtn");
const tableName = document.querySelector(".race-name");
const tableBody = document.querySelector('#table-body');
const tableDiv = document.querySelector('.table-div')
const tableTable = document.querySelector('.table-table')
const navBrand = document.querySelector('.navbar-brand')

let seasonData = {};
const seasonsList = [];

darkMode();
const startUp = async () => {
  await getSeasons();
  populateYears(seasonsList);
};
startUp();

function darkMode() {
  body.classList.add('bg-dark', 'text-light')
  body.classList.remove('bg-light', 'text-dark')
  navBar.classList.remove('bg-dark')
  navBar.classList.add('bg-light')
  navBrand.classList.add('text-dark')
  navBrand.classList.remove('text-light')
  tableDiv.classList.add('bg-light', 'table-light')
  tableDiv.classList.remove('bg-dark', 'table-dark')
  tableTable.classList.add('bg-light', 'table-light')
  tableTable.classList.remove('bg-dark', 'table-dark')
  themeBtnClasses.remove("btn-light");
  themeBtnClasses.add("btn-dark");
  themeBtn.innerText = "Light";
}
function lightMode() {
  body.classList.remove('bg-dark', 'text-light')
  body.classList.add('bg-light', 'text-dark')
  navBar.classList.add('bg-dark', 'text-light')
  navBar.classList.remove('bg-light', 'text-dark')
  navBrand.classList.remove('text-dark')
  navBrand.classList.add('text-light')
  tableDiv.classList.remove('bg-light', 'table-light')
  tableDiv.classList.add('bg-dark', 'table-dark')
  tableTable.classList.remove('bg-light', 'table-light')
  tableTable.classList.add('bg-dark', 'table-dark')
  themeBtnClasses.remove("btn-dark");
  themeBtnClasses.add("btn-light");
  themeBtn.innerText = "Dark";
}

themeBtn.addEventListener("click", () => {
  themeBtn.innerText === "Light" ? lightMode() : darkMode();
});

const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

for (i of arrayRange(1, 30, 1)) {
  if (i === 7) {
    resultsNum.innerHTML += `<option value="${i}" selected>${i}</option>`;
  } else resultsNum.innerHTML += `<option value="${i}">${i}</option>`;
}

async function getSeasons() {
  const res = await fetch("https://ergast.com/api/f1/seasons.json?limit=1000");
  const fixed = await res.json();
  const seasons = fixed.MRData.SeasonTable.Seasons;
  for (const s in seasons) {
    seasonsList.push([Number(s), seasons[s].season]);
  }
}

function populateYears(seasons) {
  for (s of seasons) {
    const html = `<option value="${s[1]}">${s[0] + 1} : ${s[1]}</option>`;
    selectYear.innerHTML += html;
  }
}
selectYear.addEventListener("change", async function () {
  let year = this.value;
  const res = await fetch(`https://ergast.com/api/f1/${year}.json?limit=1000`);
  seasonData = await res.json();
  const numRaces = Number(seasonData.MRData.total);
  selectRace.innerHTML = `<option value="none" selected disabled hidden>Race Number</option>`;
  for (i in arrayRange(0, numRaces - 1, 1)) {
    const html = `<option value="${Number(i) + 1}">${Number(i) + 1} : ${
      seasonData.MRData.RaceTable.Races[i].raceName
    }</option>`;
    selectRace.innerHTML += html;
  }
});

searchBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  tableBody.innerHTML = ''
  const year = selectYear.value;
  const race = selectRace.value - 1;
  const resNum = resultsNum.value;
  const name = `${seasonData.MRData.RaceTable.Races[race].raceName}  -  ${
    seasonData.MRData.RaceTable.Races[race].Circuit.circuitName
  }  -  ${
    seasonData.MRData.RaceTable.Races[race].Circuit.Location.country
  }  -  ${race + 1}`;
  const res = await fetch(
    `http://ergast.com/api/f1/${year}/${race + 1}/driverStandings.json?limit=${resNum}`)
  const data = await res.json()
  if (data.MRData.StandingsTable.StandingsLists[0]){
    tableName.innerText = name
    for (driver of data.MRData.StandingsTable.StandingsLists[0].DriverStandings){
      tableBody.innerHTML += `<tr>
                                <th scope="row">${driver.position}</th>
                                <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                                <td>${driver.Driver.nationality}</td>
                                <td>${driver.Constructors[0].name}</td>
                                <td>${driver.points}</td>
                              </tr>`
    }
  } else tableName.innerText = 'No Race Data Available Yet'
  
});
