const positions = ["ST", "LW", "RW", "CM", "CB", "RB", "LB", "GK"];
const allFieldPositions = [["LW", "ST", "RW"], ["CM", "CM", "CM"], ["LB", "CB", "CB", "RB"], ["GK"]];

let substitutions = [];
let fieldPlayers = [];

const formationLines = document.querySelectorAll("#formation .line");


showSubstitutionsPlayers();
showEmptyFieldCards();


async function loadPlayers () {
    if (substitutions.length > 0) return;

    let res = await axios('../players.json');
    substitutions = res.data;
}

async function showSubstitutionsPlayers() {
    await loadPlayers();

    let container = document.getElementById('substitutions');

    substitutions.forEach( (player) => {
        let card = substitutionCard(player);
        container.appendChild(card);
    })
}

function showEmptyFieldCards() {
    formationLines.forEach((line, lineIndex) => {
        line.innerHTML = "";
        for (let i = 0; i < allFieldPositions[lineIndex].length; i++) {
            let emptyCard = emptyFieldCard(allFieldPositions[lineIndex][i]);
            line.appendChild(emptyCard);
        }
    });
}

function substitutionCard({name, position, rating, photo:playerImage, logo:clubImage, flag:countryImage}) {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML += `
                <div class="flex gap-4 items-center">
                    <i class="fa-solid fa-arrows-rotate text-white text-xl cursor-pointer"></i>
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
                                        <img class="w-5" src="${clubImage}" alt="Club">
                                        <img class="h-4" src="${countryImage}" alt="Country">
                                    </div>
                                </div>
                            </div>
                            <div class="rating text-secondary text-3xl font-semibold">${rating}</div>
                        </div>
                    </div>
                </div>`;

    return tempDiv.firstElementChild;
}


function playerFieldCard() {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML = `
    <div class="relative card w-22">
        <img src="../assets/images/card.webp" alt="Player Card">
        <img src="https://cdn.sofifa.net/players/020/801/25_120.png" alt="Cristiano Ronaldo" class="absolute bottom-[36%] left-1/2 -translate-x-1/2 w-3/5">
        <div class="flex flex-col items-center absolute font-bold top-[20%] left-[12%] text-secondary">
            <div class="text-xs">87</div>
            <span class="text-[.45rem]">CF</span>
        </div>
        <div class="flex items-center text-secondary flex-col left-0 top-[60%] absolute w-full mt-1.5">
            <div class="text-[.45rem] text-center font-bold">Cristiano Ronaldo</div>
            <div class="flex w-full items-center justify-center gap-2">
                <img class="w-4" src="https://cdn.sofifa.net/meta/team/2506/120.png" alt="Club">
                <img class="h-2.5" src="https://cdn.sofifa.net/flags/pt.png" alt="Club">
            </div>
        </div>
    </div>`

    return tempDiv.firstElementChild;
}

function emptyFieldCard(id) {
    let tempDiv = document.createElement("div");

    tempDiv.innerHTML = `
                    <div id=${id} class="relative card w-22">
                        <img src="../assets/images/card-informe.webp" alt="Player Card">
                    </div>
                    `
    return tempDiv.firstElementChild;
}