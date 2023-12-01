import { useEffect, useRef } from "react";
import { TeamBox } from "./components/TeamBox";
import { useForceUpdate } from "./hooks/useForceUpdate";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { v4 as uuidv4 } from 'uuid';
import autoAnimate from "@formkit/auto-animate";

function App() {
  const [teams, setTeams] = useLocalStorage("teams", []) // [{id: uuid, name: "Team Name", score: 0, logs: []}]
  const [globalAddScore, setGlobalAddScore] = useLocalStorage("globalAddScore", 1)
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
    team.score += (globalAddScore * multiply);
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
        </div>
        <div className="max-w-lg flex justify-center">
          <input type="number" className="input input-bordered input-sm" onChange={(e) => setGlobalAddScore(e.target.value)} value={globalAddScore} />
        </div>
      </div>
      <div ref={parentTeamRef} className="grid lg:grid-cols-3 sm:grid-cols-1 justify-center py-7 px-16 gap-5">
        {teams?.toSorted(sortTeams).map((team, index) => <TeamBox addAndSubCallback={handleAddAndSubtract} deleteTeanCallback={handleDeleteTeam} updateTeamCallback={handleUpdateTeam} team={team} key={team.id} index={index + 1} addScore={globalAddScore} />)}
      </div>
    </main>
  </>
}

export default App;