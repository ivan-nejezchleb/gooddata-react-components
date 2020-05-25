// (C) 2007-2020 GoodData Corporation

import { convertColumnWidthsToMap, getColumnWidthsFromMap } from "../agGridColumnSizing";
import { ColumnWidthItem, ColumnEventSourceType, ColumnWidth } from "../../../../interfaces/PivotTable";
import { Execution } from "@gooddata/typings";

describe("agGridColumnSizing", () => {
    const columnWidths: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 60,
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: "m1",
                        },
                    },
                ],
            },
        },
        {
            attributeColumnWidthItem: {
                width: 400,
                attributeIdentifier: "a1",
            },
        },
    ];

    const executionResponse: Execution.IExecutionResponse = {
        links: {
            executionResult: "resultUrl",
        },
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            identifier: "4.df",
                            uri: "/gdc/md/storybook/obj/4.df",
                            name: "Colours",
                            localIdentifier: "a1",
                            formOf: {
                                uri: "/gdc/md/storybook/obj/4",
                                identifier: "4",
                                name: "Colours",
                            },
                        },
                    },
                ],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        identifier: "1",
                                        uri: "/gdc/md/storybook/obj/1",
                                        localIdentifier: "m1",
                                        format: "#,##0.00",
                                        name: "Amount",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        identifier: "2",
                                        uri: "/gdc/md/storybook/obj/2",
                                        localIdentifier: "m2",
                                        format: "#,##0.00",
                                        name: "Bigger Amount",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const MIN_WIDTH = 100;
    const MAX_WIDTH = 300;

    const widthValidator = (width: ColumnWidth): ColumnWidth => {
        if (typeof width === "number") {
            return Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);
        }
        return width;
    };

    const expectedColumnMap = {
        m_0: {
            width: 60,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        a_4DOTdf: {
            width: 400,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };

    const expectedColumnMapValidated = {
        m_0: {
            width: MIN_WIDTH,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        a_4DOTdf: {
            width: MAX_WIDTH,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };

    describe("convertColumnWidthsToMap", () => {
        it("should return correct IResizedColumns map", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse);
            expect(expectedColumnMap).toEqual(result);
        });

        it("should return correct IResizedColumns map and validate range of widths", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse, widthValidator);
            expect(expectedColumnMapValidated).toEqual(result);
        });
    });

    describe("getColumnWidthsFromMap", () => {
        it("should return correct ColumnWidthItem array", async () => {
            const result = getColumnWidthsFromMap(expectedColumnMap, {
                executionResponse,
                executionResult: null,
            });
            expect(columnWidths).toEqual(result);
        });
    });
});
