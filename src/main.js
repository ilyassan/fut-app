const positions = ["ST", "LW", "RW", "CM", "CB", "RB", "LB", "GK"];
const allFieldPositions = [["LW", "ST", "RW"], ["CM", "CM", "CM"], ["LB", "CB", "CB", "RB"], ["GK"]];

let substitutions = [];
const fieldPlayers = [];

const formationLines = document.querySelectorAll("#formation .line");

let cacheCard;

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

    if (filteredArray != false) {
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
    cacheCard.replaceWith(card);
    cacheCard = null;
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
    <div class="cursor-pointer relative card w-22">
        <img src="../assets/images/card.webp" alt="Player Card">
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
        let oldPosition = cacheCard?.getAttribute("data-position");
        cacheCard = card;

        if (oldPosition != position) {
            filterSubstitutionsPlayers(position);
            lastPositionClicked = position;
        }
    })
}

function filterSubstitutionsPlayers(position) {
    let filteredArray = substitutions.filter(player => player.position === position);

    showSubstitutionsPlayers(filteredArray);
}

function substitutionCardEvents(card, isActive) {
    card.addEventListener("click", function() {
        if (isActive) {
            let playerUniqueName = card.getAttribute("data-name");
            let playerIndex = substitutions.findIndex(player => player.name === playerUniqueName);

            let playerData = substitutions.splice(playerIndex, 1)[0];
            fieldPlayers.push(playerData);
            addPlayerToField(playerData);
            showSubstitutionsPlayers();
        }
    })
}