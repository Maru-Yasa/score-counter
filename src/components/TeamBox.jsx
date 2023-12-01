import { useEffect, useState } from "react";
import { Editable } from "./Editable";

const getPositionStyle = (pos) => {
    switch (pos) {
        case 1:
            return "text-yellow-500 text-2xl";
        case 2:
            return "text-zinc-400 text-xl";
        case 3:
            return "text-orange-700 text-lg";
        default:
            return "";
    }
}

export const TeamBox = ({ index = 0, team, updateTeamCallback=null, deleteTeanCallback=null, addAndSubCallback=null, addScore=1 }) => {
    const [teamName, setTeamName] = useState(team.name);

    const handleDelete = () => {
        // user prompt, delete team confirmation
        if (!window.confirm("Are you sure you want to delete this team?")) {
            return;
        }

        // delete team in parent
        if (deleteTeanCallback) {            
            deleteTeanCallback(team);
        }
    }

    const handleAddScore = () => {
        addAndSubCallback(team, 1);
    }

    const handleSubtractScore = () => {
        addAndSubCallback(team, -1);
    }

    useEffect(() => {

        // update team with new data
        team.score = parseInt(team.score);
        team.name = teamName;

        // update team in parent
        // updateTeamCallback(team);

    }, [teamName]);

    return (<>
        <div className="border rounded-lg p-3 pb-10 min-w-[300px] flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between">
                <span className={`font-medium ${getPositionStyle(index)}`}>#{index}</span>
                <button onClick={handleDelete} className="text-red-500 text-xs">❌</button>
            </div>
            <div className="text-center text-2xl font-bold">
                <Editable text={teamName} callback={(value) => setTeamName(value)} />
            </div>
            <h3 className="text-center text-5xl font-black font-mono">
                <Editable text={team.score} type="number" onEditChange={(val) => !val && updateTeamCallback(team)} callback={(value) => setScore(value)} />
            </h3>
            <div className="flex justify-center gap-3">
                <button onClick={handleAddScore} className="btn btn-sm btn-primary">+ {addScore}</button>
                <button onClick={handleSubtractScore} className="btn btn-sm btn-primary">- {addScore}</button>
            </div>
        </div>

    </>)
}