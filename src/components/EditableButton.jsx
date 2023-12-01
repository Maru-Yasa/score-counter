export const EditableButton = ({ children, type = "text", callback = null, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    useEffect(() => {
        if (callback) {
            callback(text);
        }
    }, [text]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };
    const textHandleChange = (e) => {
        setText(e.target.value);
    };
    const textHandleBlur = () => {
        setIsEditing(false);
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
            </div>) : (<button className="btn btn-sm btn-primary">{{ children }}</button>)}
        </div>
    </>);
}