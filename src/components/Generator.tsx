import { Show, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import "./Generator.css";
import Table from "./Table";
import Papa from "papaparse";

function isValidNumber(value: string) {
  return Number.isInteger(value);
}

export default function Generator() {
  // const [teamCount, setTeamCount] = createSignal(3);
  // const [playerCount, setPlayerCount] = createSignal(6);
  const [csvData, setCsvData] = createSignal([]);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("L+RATIO");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvData(Papa.parse(text));
    }
    reader.readAsText(file);
  }
  return (
    <div>
      <label for="input-csv">Please choose a CSV file. <br/><br/></label>
      <input type="file" onChange={handleFileUpload} accept=".csv"/>
      <form class="generator">
        <hr/>
        <Show when={csvData()} keyed>
          <Table fake_csv={csvData()} />
        </Show>
      </form>
    </div>
  );
}
