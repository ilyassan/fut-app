const positions = ["ST", "LW", "RW", "CB", "RB", "LB", "GK"];
let substitutions = [];
let fieldPlayers = [];

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

showSubstitutionsPlayers();