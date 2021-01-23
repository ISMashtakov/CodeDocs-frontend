import {combineReducers} from 'redux';

import selectData from '../main_page/reducer';
import tableData from '../unmatched_failures/reducer';
import reportData from '../report/reducer';
import tabMenuData from '../tabs_menu/reducer';
import fullReportData from '../full_report/reducer';

const rootReducer = combineReducers({
mainReducer: selectData,
tableData: tableData,
reportData: reportData,
tabMenuData: tabMenuData,
fullReportData: fullReportData});

export default rootReducer;