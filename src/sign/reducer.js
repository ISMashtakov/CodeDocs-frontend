import {TASK_SELECT_TAB} from './actions';


function getStartState()
{
    return {
        select_tab: 0
    }
}

const START_STATE = getStartState();

export default function tabMenuData(state=START_STATE, action)
{
    switch(action.type)
    {
        case TASK_SELECT_TAB:
        return{...state, select_tab: action.tab}
        default:
        return state;
    }
}