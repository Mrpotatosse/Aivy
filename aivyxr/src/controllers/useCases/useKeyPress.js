import { useCallback, useEffect, useState } from "react";

export default function useKeyPress(targetKey){
    const [result, setResult] = useState(false);
    
    const keydown = useCallback(({ key }) => {
        if (key === targetKey) {
            setResult(true);
        }
    }, [targetKey]);

    const keyup = useCallback(({ key }) => {
        if (key === targetKey) {
            setResult(false);
        }
    }, [targetKey])

    useEffect(_ => {
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);

        return _ => {
            window.removeEventListener('keydown', keydown);
            window.removeEventListener('keyup', keyup);
        };
    }, [keydown, keyup]);

    return result;
}