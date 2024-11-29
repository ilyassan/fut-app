const overlay = document.getElementById("player-details-overlay");
const playerDetailsContainer = overlay.querySelector("#player-details");


function showPlayerDetails(playerData) {
    openDetailsPopup();
    
    playerDetailsContainer.innerHTML = "";
    playerDetailsContainer.appendChild(getDetailsElementHtml(playerData));
}


function getDetailsElementHtml(playerData) {

    let {name, photo:playerImage, position, club, logo, nationality, flag, rating} = playerData;

    let stats = getStatsBasedOnPlayerPosition(playerData);

    let tempDiv = document.createElement("div");

    tempDiv.innerHTML = `
            <div class="flex">
                <div class="relative card select-none w-56">
                    <img src="../assets/images/card.webp" alt="Player Card">
                    <img src="${playerImage || "../assets/images/ano.png"}" alt="${name}" alt="${name}" class="absolute bottom-[36%] left-1/2 -translate-x-1/2 w-3/5">
                    <div class="flex flex-col items-center absolute font-bold top-[20%] left-[15%] text-secondary">
                        <div class="text-2xl">${rating}</div>
                        <span>${position}</span>
                    </div>
                    <div class="absolute left-[15%] top-[40%] flex flex-col items-center w-fit gap-2">
                        <img class="w-7" src="${logo}" alt="${club}">
                        <img class="h-4" src="${flag}" alt="${nationality}">
                    </div>
                    <div class="flex items-center text-secondary flex-col left-0 top-[65%] absolute w-full">
                        <div class="text-sm text-center font-bold">${name}</div>
                        <div class="flex w-full items-center justify-center gap-2">
                            <div class="flex flex-col text-xs font-semibold">
                                ${ stats.slice(0, 3).map(stat =>
                                    `<div>${stat.value} <span>${stat.name}</span></div>`
                                    ).join("")
                                }
                            </div>
                            <div class="h-[50px] w-[1px] bg-secondary"></div>
                            <div class="flex flex-col text-xs font-semibold">
                                ${ stats.slice(3).map(stat =>
                                    `<div>${stat.value} <span>${stat.name}</span></div>`
                                    ).join("")
                                }
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="flex flex-col gap-3 pt-8 pb-4 px-2">
                    <div class="flex gap-6">
                        <div class="flex flex-col gap-1">
                            <label>Full Name</label>
                            <input type="text" name="name" value="${name}" class="outline-none bg-white px-2 py-1 rounded-md" disabled>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label>Position</label>
                            <input type="text" name="name" value="${position}" class="outline-none bg-white px-2 py-1 rounded-md" disabled>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label>Club</label>
                        <input type="text" name="name" value="${club}" class="outline-none bg-white px-2 py-1 rounded-md" disabled>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label>Country</label>
                        <input type="text" name="name" value="${nationality}" class="outline-none bg-white px-2 py-1 rounded-md" disabled>
                    </div>
                </div>
            </div>`

    return tempDiv.firstElementChild;
}

function getStatsBasedOnPlayerPosition(playerData) {
    return playerData.position === "GK"
        ? [
            { name: "DIV", value: playerData.diving },
            { name: "HAN", value: playerData.handling },
            { name: "KIC", value: playerData.kicking },
            { name: "REF", value: playerData.reflexes },
            { name: "SPE", value: playerData.speed },
            { name: "POS", value: playerData.positioning },
        ]
        : [
            { name: "PAC", value: playerData.pace },
            { name: "SHO", value: playerData.shooting },
            { name: "PAS", value: playerData.passing },
            { name: "DRI", value: playerData.dribbling },
            { name: "DEF", value: playerData.defending },
            { name: "PHY", value: playerData.physical },
        ];
}

function openDetailsPopup() {
    overlay.classList.remove("hidden");
    setTimeout(() => {
        playerDetailsContainer.classList.remove("-left-full");
        playerDetailsContainer.classList.add("left-1/2");
    }, 0);

    overlay.onclick = function(e) {
        if (overlay == e.target) {
            closeDetailsPopup();
        }
    }
}

function closeDetailsPopup() {
    playerDetailsContainer.classList.add("-left-full");
    playerDetailsContainer.classList.remove("left-1/2");
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 400);
}