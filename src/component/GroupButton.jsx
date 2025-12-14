import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function GroupButton({button1, button2})
{
    const navigate = useNavigate();

    return (
        <>
            <div>
                <Button 
                    name={button1} 
                    onClick={ () => navigate(`/stocks?location=${encodeURIComponent(button1)}`) }
                />
                <Button 
                    name={button2} 
                    onClick={ () => navigate(`/stocks?location=${encodeURIComponent(button2)}`) }
                />
            </div>
        </>
    );
}