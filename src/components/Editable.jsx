import { useEffect, useState } from "react";

const noop = () => {};

export const Editable = ({ text, type="text", callback=null, onEditChange=noop, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
        onEditChange(true);
    };
    const textHandleChange = (e) => {
        callback?.(e.target.value);
    };
    const textHandleBlur = () => {
        setIsEditing(false);
        onEditChange(false);
    };

    return (<>
        <div onDoubleClick={handleDoubleClick} {...props}>
            {isEditing ? (<div onBlur={textHandleBlur}>
                <input
                    className="border rounded-lg p-3 max-w-[300px] flex flex-col gap-3"
                    type={type}
                    value={text}
                    onChange={textHandleChange}
                    onBlur={textHandleBlur}
                />
            </div>) : (<span>
                {text}
            </span>)}
        </div>
    </>);
}