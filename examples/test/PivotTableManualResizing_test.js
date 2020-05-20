// (C) 2007-2020 GoodData Corporation
import { Selector, ClientFunction } from "testcafe";
import { config } from "./utils/config";
import { checkCellValue, loginUserAndNavigate } from "./utils/helpers";

fixture.only("Pivot Table Manual Resizing").beforeEach(loginUserAndNavigate(`${config.url}/pivot-table`));

async function getCell(t, tableSelectorStr, cellSelectorStr) {
    const tableSelector = Selector(tableSelectorStr);
    await t.expect(tableSelector.exists).eql(true, `${tableSelectorStr} not found`);
    const cell = await tableSelector.find(`.ag-body-viewport ${cellSelectorStr}`);
    await t.expect(cell.exists).eql(true, `${cellSelectorStr} not found in ${tableSelectorStr}`);
    return cell;
}

test("should render pivot table with manual resizing", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    await checkCellValue(t, tableSelectorStr, "Alabama", cellSelectorStr);
});

test("should change width of attribute column to properly value by click on button", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidth = 400;
    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-attribute");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});

test("should change width of measure column to properly value by click on button", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-1";
    const correctCellWidth = 60;
    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-measure");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});
