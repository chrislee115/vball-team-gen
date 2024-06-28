import { For, createSignal } from "solid-js";
import { yup } from "~/scripts/team_generate.js";
import "./Table.css";

const valid_headers = {
  "Name": "Name", 
  "Status": "Status",
  "Setter (1, 2, 3, X)": "Setter",
  "MB (1, 2, 3, X)": "Middle",
  "OH (1, 2, 3, X)": "Outside",
  "Oppo (1, 2, 3, X)": "Opposite",
  "Lib (1, 2, 3, X)": "Libero"};

function getMapping(csv_data) {
  let mapping = new Map();
  let header = csv_data[0];
  for (let i = 0; i < header.length; ++i) {
    console.log(header[i])
    if (Object.keys(valid_headers).includes(header[i])) {
      mapping.set(valid_headers[header[i]], i)
    }
  }
  return mapping
}

const TEMPLATE = {
  "Middle": [],
  "Setter": [],
  "Outside": [],
  "Opposite": [],
  "Libero": [],
}

function fillPrefs(csv_data, mapping) {
  let prefs = { pri: structuredClone(TEMPLATE), sec: structuredClone(TEMPLATE), tri: structuredClone(TEMPLATE)};
  for (let i = 1; i < csv_data.length; ++i) {
    let row = csv_data[i];
    if (row[mapping.get("Status")] != "Going") continue;
    let name = row[mapping.get("Name")]

    Object.values(valid_headers).forEach((position) => {
      if (position == "Name" || position == "Status") return;
      let prio = row[mapping.get(position)]
      if (prio == 1) {
        prefs.pri[position].push(name)
        if (position == "Outside") {
          prefs.sec["Opposite"].push(name)
        }
      } else if (prio == 2) {
        prefs.sec[position].push(name)
      } else {
        prefs.tri[position].push(name)
      }
    });
  }
  console.log(prefs)
  return prefs;
}

function padString(str, desired) {
  let offset = desired - str.length;
  let is_even = offset % 2 == 0
  str = str.padEnd(Math.floor(offset / 2) + str.length, "`")
  str = str.padStart(Math.floor(offset / 2) + str.length, "`")
  if (!is_even) {
    str = str.padStart(1 + str.length, "`");
  }
  return str
}

function getMaxLen(arr) {
  let max_len = 0;
  for (let i = 0; i < arr.length; ++i) {
    let team_map = arr[i]
    team_map.forEach((v, _) => {
      v.forEach((v2, _) => {
        for (let j = 0; j < v2.length; ++j) {
          if (v2[j].length > max_len) {
            max_len = v2[j].length;
          }
        }
      });
    });
  }
  return max_len
}

function thislanguagesucks(setMaxLen, setTeams, teams) {
  setTeams(teams);
  setMaxLen(getMaxLen(teams))
}

function prettyString(player_map, max_len) {
  let ans = "|";
  let headers = ["Setter", "Outside", "Middle", "Opposite"]
  let head_len = [1, 2, 2, 1]
  for (let i = 0; i < headers.length; ++i) {
    for (let j = 0; j < head_len[i]; ++j) {
      const test = padString(player_map.get(headers[i])[j], max_len)
      ans += test + "|"
    }
  }
  return ans;
}

function prettyHeader(headers, max_len) {
  let ans = "|";
  for (let i = 0; i < headers.length; ++i) {
    const test = padString(headers[i], max_len)
    ans += test + "|"
  }
  return ans;
}

function prettyLine(max_len) {
  let ans = "";
  ans = ans.padStart(max_len * 6 + 6, "-")
  return ans;
}

export default function Table({fake_csv}) {
  const [getTeams, setTeams] = createSignal([]);
  const [getMaxLen, setMaxLen] = createSignal(0);
  let prefs = {};
  let num_ppl = 0;
  let yur2 = [];
  if (fake_csv != undefined && fake_csv.data != undefined) {
    let temp = fake_csv.data
    console.log(temp)
    let csv_data = Object.values(temp)
    prefs = fillPrefs(csv_data, getMapping(csv_data))
    num_ppl = csv_data.length - 2;
  }
  let num_teams = num_ppl / 3;
  var array = Array.from({length: num_ppl}, (_, i) => i + 1)
  var headers = ["S", "OH1", "OH2", "M1", "M2", "RS"];
  return (
    <div>
    <For each={getTeams()}>{(item, index) =>
      <div>
        <div>Set {index() + 1}</div>
        <p>{prettyLine(getMaxLen())}</p>
        <p>{prettyHeader(headers, getMaxLen())}</p>
        <For each={item}>{(item2, index2) =>
          <div>
            <p>{prettyLine(getMaxLen())}</p>
            <p>{prettyString(item2, getMaxLen())}</p>
          </div>
        }</For>
        <p>{prettyLine(getMaxLen())}</p>
        <br />
      </div>
    }</For>
    <button class="generate" type="button" onClick={() => thislanguagesucks(setMaxLen, setTeams, yup(prefs))}>Generate Teams</button>
    </div>
  );
}
