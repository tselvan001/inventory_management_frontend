import { GroupButton } from '../component/GroupButton.jsx';

export function FirstPage() 
{
    return (
        <>
            <GroupButton button1="Pantry" button2="Retail" />
            <GroupButton button1="Hair" button2="Skin" />
            <GroupButton button1="Oil" button2="Pedicure" />
        </>
    );
}