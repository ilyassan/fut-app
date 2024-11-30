(function(){
    const overlay = document.getElementById("create-player-overlay");
    const form = overlay.querySelector("#create-player-form");
    const validationAlert = form.querySelector("#alert");
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
    statsInputsEvents();

    createPlayerBtn.onclick = function (){
        overlay.classList.remove("hidden");

        overlay.onclick = function(e) {
            if (e.target == overlay) {
                overlay.classList.add("hidden");
                hideAlert();
            }
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();

        let playerData = getFormData();

        let invalidMessage = validateData(playerData);
        if (invalidMessage != 1) {
            showAlert(invalidMessage);
            return;
        }
        
        substitutions.push(playerData);
        showSubstitutionsPlayers();
        closeForm();

        let players = JSON.parse(localStorage.getItem("players"));
        players.push(playerData);
        localStorage.setItem("players", JSON.stringify(players));
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

    function statsInputsEvents() {
        playerStatsInputs.forEach(input => {
            input.addEventListener("keyup", function(e) {
                let value = parseInt(input.value);
                if (value < 0) {
                    input.value = 0;
                } else if (value > 100) {
                    input.value = 100;
                }
            })
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
            name: capitalize(fullnameInput.value.trim()),
            photo: null,
            position: getSelectedValueFromSelectTag(positionsInput),
            nationality: getSelectedValueFromSelectTag(countriesInput),
            flag: countriesInput.getAttribute("data-flag"),
            club: getSelectedValueFromSelectTag(clubsInput),
            logo: clubsInput.getAttribute("data-logo"),
            ...stats
        }
    }

    function validateData(playerData) {
        const nameRegex = /^[^:;?!@&#$<>&'"]+$/;

        const emptyRegex = /^\s*$/;

        let isExist = substitutions.concat(fieldPlayers).find(player => player.name === playerData.name);

        if (isExist) {
            return "Player name is already exist.";
        }

        if (emptyRegex.test(playerData.name)) {
            return "Please fill the name field.";
        }

        if (!nameRegex.test(playerData.name)) {
            return "Invalid characters in the name field.";
        }
        
        if (emptyRegex.test(playerData.position)) {
            return "Please select the player position.";
        }

        if (emptyRegex.test(playerData.club)) {
            return "Please select a club.";
        }

        if (emptyRegex.test(playerData.nationality)) {
            return "Please select a country.";
        }

        if (isNaN(playerData.rating)) {
            return "Please fill the player stats.";
        }

        return 1;
    }

    function closeForm() {
        overlay.classList.add("hidden");
    }

    function getSelectedValueFromSelectTag(selectTag) {

        const options = selectTag.children;
        
        for (let option of options) {
            if (option.selected) {
                return option.getAttribute("value") || "";
            }
        }

    }

    function capitalize(string) {
        return string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }

    function showAlert(message) {
        validationAlert.textContent = message;
        validationAlert.classList.remove("hidden");
    }

    function hideAlert() {
        validationAlert.textContent = "";
        validationAlert.classList.add("hidden");
    }
})();