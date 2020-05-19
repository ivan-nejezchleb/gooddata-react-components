// (C) 2007-2020 GoodData Corporation
import { Selector, ClientFunction } from "testcafe";
import { config } from "./utils/config";
import { checkCellValue, loginUserAndNavigate } from "./utils/helpers";

fixture("Pivot Table Manual Resizing").beforeEach(loginUserAndNavigate(`${config.url}/pivot-table`));

test.only("should render pivot table with manual resizing", async t => {
    const firstCellSelector = ".s-cell-0-0";
    await checkCellValue(t, ".s-pivot-table-manual-resizing", "Alabama", firstCellSelector);
});
