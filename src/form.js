const overlay = document.getElementById("overlay");
const form = overlay.querySelector("#create-player-form");
const createPlayerBtn = document.getElementById("show-form-btn");

const fullnameInput = overlay.querySelector("#fullname");
const positionsInput = overlay.querySelector("#positions");
const clubsInput = overlay.querySelector("#clubs");
const countriesInput = overlay.querySelector("#countries");

const playerStatsInputs = form.querySelectorAll("input[type='number']");

const normalPlayerStats = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];
const goalKeeperStats = ["DIV", "HAN", "KIC", "REF", "SPE", "POS"];

let selectedStats = normalPlayerStats;

loadPositionsInInput();
loadClubs();
loadCountries();

createPlayerBtn.onclick = function (){
    overlay.classList.remove("hidden");

    overlay.onclick = function(e) {
        if (e.target == overlay) {
            overlay.classList.add("hidden");
        }
    }
}

form.onsubmit = function(e) {
    e.preventDefault();

    let playerData = getFormData();
    
    substitutions.push(playerData);
    showSubstitutionsPlayers();
}


function loadPositionsInInput() {
    positions.forEach(position => {
        let option = document.createElement("option");
        option.value = position;
        option.textContent = position;

        positionsInput.appendChild(option);
    });

    positionsInput.addEventListener("change", function() {
        if (positionsInput.value == "GK") {
            selectedStats = goalKeeperStats;
        }else {
            selectedStats = normalPlayerStats;
        }

        playerStatsInputs.forEach((input, index) => {
            input.parentElement.querySelector("label").textContent = selectedStats[index];
        })
    })
}

async function loadClubs() {
    let res = await axios("../clubs.json");
    let clubs = res.data;

    clubs.forEach(({club}) => {
        let option = document.createElement("option");
        option.value = club;
        option.textContent = club;

        clubsInput.appendChild(option);
    })

    let clubImgTag = clubsInput.parentElement.parentElement.querySelector("img");
    let defaultImgSrc = clubImgTag.src;

    clubsInput.addEventListener("change", function() {
        let selectedClub = clubs.find(club => club.club == clubsInput.value);
        if (selectedClub) {
            clubImgTag.src = selectedClub.logo;
            clubImgTag.classList.remove("hidden");
            clubsInput.setAttribute("data-logo", selectedClub.logo)
        }else {
            clubImgTag.src = defaultImgSrc;
            clubImgTag.classList.add("hidden");
        }
    })
}

async function loadCountries() {
    let res = await axios("../countries.json");
    let countries = res.data;

    countries.forEach(({country}) => {
        let option = document.createElement("option");
        option.value = country;
        option.textContent = country;

        countriesInput.appendChild(option);
    })

    let countryImgTag = countriesInput.parentElement.parentElement.querySelector("img");
    let defaultImgSrc = countryImgTag.src;

    countriesInput.addEventListener("change", function() {
        let selectedCountry = countries.find(country => country.country == countriesInput.value);
        if (selectedCountry) {
            countryImgTag.src = selectedCountry.flag;
            countryImgTag.classList.remove("hidden");
            countriesInput.setAttribute("data-flag", selectedCountry.flag);
        }else {
            countryImgTag.src = defaultImgSrc;
            countryImgTag.classList.add("hidden");
        }
    })
}

function getFormData() {

    let isGK = positionsInput.value === "GK";

    const weights = isGK
        ? {
            diving: 0.20,
            handling: 0.15,
            kicking: 0.10,
            reflexes: 0.25,
            speed: 0.10,
            positioning: 0.20
        }
        : {
            pace: 0.25,
            shooting: 0.25,
            passing: 0.25,
            dribbling: 0.25,
            defending: 0.25,
            physical: 0.25
        };

    let stats = Object.keys(weights).reduce(function(acc, key, index) {
        let value = parseInt(playerStatsInputs[index].value);
        acc[key] = value;
        acc.rating = (acc.rating || 0) + (value * weights[key]);
        return acc;
    }, {})


    stats.rating = Math.ceil(stats.rating);

    return  {
        name: fullnameInput.value,
        photo: null,
        position: positionsInput.value,
        nationality: countriesInput.value,
        flag: countriesInput.getAttribute("data-flag"),
        club: clubsInput.value,
        logo: clubsInput.getAttribute("data-logo"),
        ...stats
      }
}