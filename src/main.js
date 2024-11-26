let substitutions = [];
let fieldPlayers = [];

async function loadPlayers () {
    let res = await fetch('../players.json');
    let data = await res.json();

    substitutions = data.players;
}

loadPlayers();