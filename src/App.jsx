import { useEffect, useRef, useState } from "react";
import { TeamBox } from "./components/TeamBox";
import { useForceUpdate } from "./hooks/useForceUpdate";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { v4 as uuidv4 } from 'uuid';
import autoAnimate from "@formkit/auto-animate";
import ReactAudioPlayer from "react-audio-player";

function App() {
  const [teams, setTeams] = useLocalStorage("teams", []) // [{id: uuid, name: "Team Name", score: 0, logs: []}]
  const [globalAddScore, setGlobalAddScore] = useLocalStorage("globalAddScore", 1)
  const [globalSubScore, setGlobalSubScore] = useLocalStorage("globalSubScore", 1)
  const [heartSound, setHeartSound] = useState(false)
  const parentTeamRef = useRef(null);

  const handleAddTeam = () => {
    setTeams([...teams, { id: uuidv4(), name: "Team Name", score: 0, logs: [] }])
  }

  const handleUpdateTeam = (team) => {
    // update team with new data
    const newArr = [...teams];
    const index = newArr.findIndex(t => t.id === team.id);
    newArr[index] = team;
    setTeams(newArr);
  }

  const handleDeleteTeam = (team) => {
    // delete team
    const index = teams.findIndex(t => t.id === team.id);
    teams.splice(index, 1);
    setTeams([...teams]);
  }

  const handleClearAllTeams = () => {
    // prompt user, to confirm deletion
    if (!window.confirm("Are you sure you want to clear all teams and save to history?")) {
      return;
    }

    // get previous matches
    const previousMathces = JSON.parse(window.localStorage.getItem("matches")) ?? [];

    // add new match
    window.localStorage.setItem("matches", JSON.stringify([
      ...previousMathces,
      {
        id: uuidv4(),
        teams: teams,
        date: new Date(),
        winner: teams[0].score > teams[1].score ? teams[0] : teams[1]
      }
    ]));

    // clear teams
    setTeams([]);
  }

  const sortTeams = (t1, t2) => {
    return t2.score - t1.score
  }

  const handleAddAndSubtract = (team, multiply) => {
    // update team with new data
    if (multiply > 0) {      
      team.score += (globalAddScore * multiply);
    } else {
      team.score += (globalSubScore * multiply);
    }
    handleUpdateTeam(team);
  }

  useEffect(() => {
    parentTeamRef.current && autoAnimate(parentTeamRef.current)
  }, [teams])

  return <>
    <main className="flex justify-center align-middle min-h-screen flex-col">
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-center text-3xl font-bold">Score Counter</h1>
        <div className="flex gap-3 justify-center">
          <button className="btn btn-sm btn-primary" onClick={handleAddTeam}>Add</button>
          <a href="/history" className="btn btn-sm">View History</a>
          <button className="btn btn-sm btn-error" onClick={handleClearAllTeams}>Clear All &  Save</button>
          <button className={"btn btn-sm"} onClick={() => setHeartSound(!heartSound)}>
            ❤️
            {heartSound && <ReactAudioPlayer src="/tense.mp3" autoPlay loop />}
          </button>
        </div>
        <div className="max-w-lg flex justify-center gap-3">
          <div className="flex gap-1 items-center">
            <span className="label-text text-2xl">+</span>
            <input type="number" className="input input-bordered input-sm" onChange={(e) => setGlobalAddScore(e.target.value)} value={globalAddScore} />
          </div>
          <div className="flex gap-1 items-center">
            <span className="label-text text-2xl">-</span>
            <input type="number" className="input input-bordered input-sm" onChange={(e) => setGlobalSubScore(e.target.value)} value={globalSubScore} />
          </div>
        </div>
      </div>
      <div ref={parentTeamRef} className="grid lg:grid-cols-3 sm:grid-cols-1 justify-center py-7 px-16 gap-5">
        {teams?.toSorted(sortTeams).map((team, index) => <TeamBox addAndSubCallback={handleAddAndSubtract} deleteTeanCallback={handleDeleteTeam} updateTeamCallback={handleUpdateTeam} team={team} key={team.id} index={index + 1} subScore={globalSubScore} addScore={globalAddScore} />)}
      </div>
    </main>
  </>
}

export default App;