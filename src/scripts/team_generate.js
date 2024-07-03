let POSITION_TEMPLATE = new Map([
    ["Outside", []],
    ["Setter", []],
    ["Opposite", []],
    ["Libero", []],
    ["Middle", []],
    ["Fill", []]
]);

const MAX_POSITION_LIB = new Map([
    ["Middle", 1], 
    ["Opposite", 1], 
    ["Libero", 1], 
    ["Setter", 1], 
    ["Outside", 2]
]);

const MAX_POSITION_NO_LIB = new Map([
    ["Middle", 2], 
    ["Opposite", 1], 
    ["Setter", 1], 
    ["Outside", 2]
]);

const MAX_TRIES = 200

function fill_pref(player_data) {
    var pris = structuredClone(POSITION_TEMPLATE)
    var secs = structuredClone(POSITION_TEMPLATE)
    var ters = structuredClone(POSITION_TEMPLATE)
    player_data.forEach((row) => {
        pris.get(row.pri).push(row.name)
        secs.get(row.sec).push(row.name)
        ters.get(row.ter).push(row.name)
    });
    return [pris, secs, ters]
}

const NUM_TEAMS = 3;
const NUM_VERSIONS = 3;

function includes(final, person) {
    let found = false;
    final.forEach((vec, _) => {
        vec.forEach((player, _) => {
            if (person == player) {
                found = true;
                return;
            }
        });
    });
    return found;
}

function run(final, prefs, cucked, is_pri) {
    MAX_POSITION_LIB.forEach((val, pos) => {
        let true_n = val * NUM_TEAMS
        let offset = 0;
        if (final.get(pos) != undefined) {
            if (final.get(pos).length == true_n) return;
            offset = final.get(pos).length
        } 
        let ppl = prefs[pos]
        let to_remove = []
        let count = offset;
        for (let i = 0; i < ppl.length; ++i) {
            if (count == true_n) return;
            if (includes(final, ppl[i])) continue;

            final.get(pos).push(ppl[i])
            to_remove.push(ppl[i])
            ++count;
        }
        for (let i = 0; i < to_remove.length; ++i) {
            if (!is_pri) {
                cucked.push(to_remove[i])
            }
        }
    });
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

function shufflePref(pref) {
    for (let position in pref) {
        pref[position] = shuffleArray(pref[position])
    }
}

function formatTeams(final) {
    let teams = []
    for (let i = 0; i < NUM_TEAMS; ++i) {
        teams.push(structuredClone(POSITION_TEMPLATE))
        MAX_POSITION_LIB.forEach((val, pos) => {
            for (let j = 0; j < val; ++j) {
                teams[i].get(pos).push(final.get(pos)[j + (val * i)]);
            }
        });
    }
    return teams;
}

export function yup(prefs) {
    let teams = []
    let pris = structuredClone(prefs.pri);
    let secs = structuredClone(prefs.sec);
    let ters = structuredClone(prefs.tri);
    for (let i = 0; i < NUM_VERSIONS; ++i) {
        let final = structuredClone(POSITION_TEMPLATE)
        shufflePref(pris)
        shufflePref(secs)
        shufflePref(ters)
        let max_players = NUM_TEAMS * 6;
        let cucked = [];
        let happiness = 0;
        for (let i = 0; i < 3; ++i) {
            if (i == 0) {
                run(final, pris, cucked, true);
            }
            if (i == 1) {
                run(final, secs, cucked, false);
            }
            if (i == 2) {
                run(final, ters, cucked, false);
            }
            let count = 0;
            final.forEach((v, idx) => {
                count += v.length;
            });
            if (i == 0) { happiness = count; }
            if (count == max_players) break;
        }
        console.log("version : ", i, happiness)
        teams.push(formatTeams(final));
    }
    return teams;
}