import { useLocalStorage } from "./hooks/useLocalStorage";

function History() {
    const [matches, setMatches] = useLocalStorage("matches", []);

    const handleDeleteMatch = (match) => {
        // user prompt, delete match confirmation
        if (!window.confirm("Are you sure you want to delete this match?")) {
            return;
        }
        // delete match
        const index = matches.findIndex(m => m.id === match.id);
        matches.splice(index, 1);
        setMatches([...matches]);
    }

    const sortTeams = (t1, t2) => {
        return t2.score - t1.score
    }

    return <>
        <main className="flex justify-center align-middle min-h-screen flex-col">
            <div className="flex flex-col gap-3 justify-center items-center">
                <h1 className="text-center text-3xl font-bold">Score Counter History</h1>
                <div className="flex gap-3 justify-center">
                      <a href="/" className="btn btn-sm">Back</a>
                </div>
                <div className="flex justify-center">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra border rounded-lg table-sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Teams (score)</th>
                                    <th>Winner</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match, index) => {
                                    return <tr key={match.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <ul>
                                                {match.teams.sort(sortTeams).map((team, index) => {
                                                    return <li key={team.id}>{team.name} ({team.score})</li>
                                                })}
                                            </ul>
                                        </td>
                                        <td>{match.winner.name}</td>
                                        <td>{match.date}</td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleDeleteMatch(match)} className="btn btn-xs btn-danger btn-error">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default History;