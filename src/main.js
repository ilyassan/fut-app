const positions = ["ST", "LW", "RW", "CM", "CB", "RB", "LB", "GK"];
const allFieldPositions = [["LW", "ST", "RW"], ["CM", "CM", "CM"], ["LB", "CB", "CB", "RB"], ["GK"]];

let substitutions = [];
const fieldPlayers = [];

const formationLines = document.querySelectorAll("#formation .line");

let emptyCacheCard;
let replacedCacheCard;

searchInputEvents();
showSubstitutionsPlayers();
showEmptyFieldCards();


async function loadPlayers () {
    if (substitutions.length > 0) return;

    let res = await axios('../players.json');
    substitutions = res.data;
}

async function showSubstitutionsPlayers(filteredArray = false) {
    await loadPlayers();

    let container = document.getElementById('substitutions');
    container.innerHTML = "";

    let array = substitutions;
    let isPlayersActive = false;

    if (filteredArray !== false) {
        array = filteredArray
        isPlayersActive = true;
    }

    array.forEach((player) => {
        let card = substitutionCard(player, isPlayersActive);
        container.appendChild(card);
        substitutionCardEvents(card, isPlayersActive);
    })
}

function addPlayerToField(playerData) {
    let card = playerFieldCard(playerData);
    if (emptyCacheCard) {
        emptyCacheCard.replaceWith(card);
        emptyCacheCard = null;
    }else {
        replacedCacheCard.replaceWith(card);
        replacedCacheCard = null; 
    }
    playerFieldCardEvent(card);
}

function showEmptyFieldCards() {
    formationLines.forEach((line, lineIndex) => {
        line.innerHTML = "";
        for (let i = 0; i < allFieldPositions[lineIndex].length; i++) {
            let emptyCard = emptyFieldCard(allFieldPositions[lineIndex][i]);
            line.appendChild(emptyCard);
            emptyFieldCardEvent(emptyCard);
        }
    });
}

function substitutionCard({name, position, rating, photo:playerImage, logo:clubLogo, flag:countryFlag}, isActive) {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML += `
                <div data-name="${name}" class="cursor-pointer flex gap-4 items-center">
                    <i class="${isActive ? "animate-spin" : ""} fa-solid fa-arrows-rotate text-white text-xl cursor-pointer"></i>
                    <div class="player-info relative flex flex-1 px-2 bg-transparent text-secondary overflow-hidden rounded-lg">
                        <img class="absolute left-0 w-full h-full" src="../assets/images/listCard.jpg" alt="" height="100">
                        <div class="relative z-10 flex w-full items-center justify-between">
                            <div class="flex items-center">
                                <div class="position font-bold">
                                    ${position}
                                </div>
                                <div class="w-14 h-14">
                                    <img class="h-full" src="${playerImage || "../assets/images/ano.png"}" alt="${name}">
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <span class="text-secondary text-sm font-semibold">${name}</span>
                                    <div class="flex items-center gap-2">
                                        <img class="w-5" src="${clubLogo}" alt="Club">
                                        <img class="h-4" src="${countryFlag}" alt="Country">
                                    </div>
                                </div>
                            </div>
                            <div class="rating text-secondary text-3xl font-semibold">${rating}</div>
                        </div>
                    </div>
                </div>`;

    return tempDiv.firstElementChild;
}

function playerFieldCard({name, position, rating, photo:playerImage, logo:clubLogo, flag:countryFlag}) {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML = `
    <div data-name="${name}" data-position="${position}" class="cursor-pointer relative card w-22 transition-all hover:-translate-y-1 hover:scale-105">
        <img src="../assets/images/card.webp" alt="Player Card">
        <span class="change-player z-10 absolute left-1/2 -translate-x-1/2 -bottom-1">
            <i class="hover:animate-spin fa-solid fa-arrows-rotate text-white text-base cursor-pointer"></i>
        </span>
        <img src="${playerImage}" alt="Cristiano Ronaldo" class="absolute bottom-[36%] left-1/2 -translate-x-1/2 w-3/5">
        <div class="flex flex-col items-center absolute font-bold top-[20%] left-[12%] text-secondary">
            <div class="text-xs">${rating}</div>
            <span class="text-[.45rem]">${position}</span>
        </div>
        <div class="flex items-center text-secondary flex-col left-0 top-[60%] absolute w-full mt-1.5">
            <div class="text-[.45rem] text-center font-bold">${name}</div>
            <div class="flex w-full items-center justify-center gap-2">
                <img class="w-4" src="${clubLogo}" alt="Club">
                <img class="h-2.5" src="${countryFlag}" alt="Country">
            </div>
        </div>
    </div>`

    return tempDiv.firstElementChild;
}

function playerFieldCardEvent(card) {
    let cardPosition = card.getAttribute("data-position");
    let changePlayerBtn = card.querySelector(".change-player");

    changePlayerBtn.addEventListener("click", function() {
        if (! replacedCacheCard) {
            card.querySelector("i").classList.add("animate-spin");
            replacedCacheCard = card;
            filterSubstitutionsPlayers(cardPosition);
        }
    })
}

function emptyFieldCard(position) {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML = `
                    <div data-position="${position}" class="relative card w-22">
                        <img src="../assets/images/card-informe.webp" alt="Player Card">
                        <span class="add-player absolute cursor-pointer border border-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl py-1 px-2 rounded-full"><i class="fa-solid fa-plus"></i><span/>
                    </div>
                    `
    return tempDiv.firstElementChild;
}

function emptyFieldCardEvent(card){

    card.querySelector(".add-player").addEventListener("click", function() {
        let position = card.getAttribute("data-position");
        let oldPosition = emptyCacheCard?.getAttribute("data-position");
        emptyCacheCard = card;

        if (oldPosition != position) {
            filterSubstitutionsPlayers(position);
            lastPositionClicked = position;
        }
    })
}

function filterSubstitutionsPlayers(position) {
    let availablePositions = getAvailablePositionsFromOnePosition(position);
    
    let filteredArray = substitutions.filter(player => availablePositions.includes(player.position));

    showSubstitutionsPlayers(filteredArray);
}

function substitutionCardEvents(card, isActive) {
    card.addEventListener("click", function() {
        if (isActive) {
            let playerUniqueName = card.getAttribute("data-name");
            let playerIndex = substitutions.findIndex(player => player.name === playerUniqueName);

            let playerData = substitutions.splice(playerIndex, 1)[0];
            fieldPlayers.push(playerData);

            if (replacedCacheCard) { // if there is a card to move it out of the field to the substitutions
                let replacedPlayerIndex = fieldPlayers.findIndex(player => player.name === replacedCacheCard.getAttribute("data-name"));
                let replacedPlayerData = fieldPlayers.splice(replacedPlayerIndex, 1)[0];
                substitutions.push(replacedPlayerData);
            }

            addPlayerToField(playerData);
            showSubstitutionsPlayers();
        }
    })
}

function getAvailablePositionsFromOnePosition(position){ // input: ST -> output -> [LW, ST, RW]
    for (let i = 0; i < allFieldPositions.length; i++) {
        for (let j = 0; j < allFieldPositions[i].length; j++) {
            if (allFieldPositions[i][j] == position) {
                return allFieldPositions[i];
            }
        }
    }
}

function searchInputEvents() {
    const searchInput = document.getElementById("search-player");
    
    searchInput.addEventListener("input", function() {
        let playersElements = Array.from(document.getElementById("substitutions").children);
        let searchValue = searchInput.value.toLowerCase();

        playersElements.forEach(function(playerElement){
            let {name, position, club, nationality} = substitutions.find(player => player.name == playerElement.getAttribute("data-name"));
            
            if (
                name.toLowerCase().search(searchValue) != -1 ||
                position.toLowerCase().search(searchValue) != -1 ||
                club.toLowerCase().search(searchValue) != -1 ||
                nationality.toLowerCase().search(searchValue) != -1
            ) {
                playerElement.classList.remove("hidden");
            }else{
                playerElement.classList.add("hidden");
            }
        })
    })
}