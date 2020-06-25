// (C) 2020 GoodData Corporation

import {
    IMeasureColumnWidthItem,
    IAttributeColumnWidthItem,
    IAllMeasureColumnWidthItem,
} from "../../../../../interfaces/PivotTable";

export const validMeasureColumnWidthItem: IMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 100 },
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const validAllMeasureColumnWidthItem: IAllMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 400 },
    },
};

export const validAttributeColumnWidthItem: IAttributeColumnWidthItem = {
    attributeColumnWidthItem: {
        width: { value: 100 },
        attributeIdentifier: "a1",
    },
};

export const invalidAttributeColumnWidthItem: IAttributeColumnWidthItem = {
    attributeColumnWidthItem: {
        width: { value: 100 },
        attributeIdentifier: "invalid",
    },
};

export const invalidMeasureColumnWidthItem: IMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 100 },
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "invalid", // this measure is not in buckets
                },
            },
        ],
    },
};

export const invalidMeasureColumnWidthItemInvalidAttribute: IMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 100 },
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a1", // this identifier doesn't exist on second dimension
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const invalidMeasureColumnWidthItemTooManyLocators: IMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 100 },
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const invalidMeasureColumnWidthItemLocatorsTooShort: IMeasureColumnWidthItem = {
    measureColumnWidthItem: {
        width: { value: 100 },
        locators: [
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};
