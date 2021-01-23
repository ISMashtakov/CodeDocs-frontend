export const TASK_SELECT_TAB = "SELECT_TAB";



export function selectTab(tab)
{
    return {
    type: TASK_SELECT_TAB,
    tab: tab
    }
}