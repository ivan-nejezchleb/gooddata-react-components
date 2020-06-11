// (C) 2020 GoodData Corporation
import includes = require("lodash/includes");

import {
    ColumnWidthItem,
    IMeasureColumnWidthItem,
    IAttributeColumnWidthItem,
    isAttributeColumnWidthItem,
    isMeasureLocatorItem,
    isMeasureColumnWidthItem,
} from "../../../../interfaces/PivotTable";

import {
    IAttributeFilter,
    IBucketFilter,
    isAttributeFilter,
    IBucketItem,
} from "../../../interfaces/Visualization";

const isAttributeColumnWidthItemVisible = (
    _widthItem: IAttributeColumnWidthItem,
    _filters: IBucketFilter[],
): boolean => true;

const isMeasureWidthItemMatchedByFilter = (
    widthItem: IMeasureColumnWidthItem,
    filter: IAttributeFilter,
): boolean =>
    filter.selectedElements.some(selectedElement =>
        widthItem.measureColumnWidthItem.locators.some(
            locator =>
                !isMeasureLocatorItem(locator) &&
                locator.attributeLocatorItem.element === selectedElement.uri,
        ),
    );

const isMeasureColumnWidthItemVisible = (
    sortItem: IMeasureColumnWidthItem,
    filters: IBucketFilter[],
): boolean =>
    filters.reduce((isVisible, filter) => {
        if (isAttributeFilter(filter)) {
            const shouldBeMatched = !filter.isInverted;
            return isVisible && shouldBeMatched === isMeasureWidthItemMatchedByFilter(sortItem, filter);
        }
        return isVisible;
    }, true);

const isWidthItemVisible = (widthItem: ColumnWidthItem, filters: IBucketFilter[]): boolean =>
    isAttributeColumnWidthItem(widthItem)
        ? isAttributeColumnWidthItemVisible(widthItem, filters)
        : isMeasureColumnWidthItemVisible(widthItem, filters);

const containsMeasureLocator = (widthItem: IMeasureColumnWidthItem): boolean =>
    widthItem.measureColumnWidthItem.locators.some(locator => isMeasureLocatorItem(locator));

const widthItemLocatorsHaveProperLength = (
    widthItem: IMeasureColumnWidthItem,
    measuresCount: number,
    columnAttributesCount: number,
): boolean => {
    return (
        (measuresCount > 0 &&
            containsMeasureLocator(widthItem) &&
            widthItem.measureColumnWidthItem.locators.length === columnAttributesCount + 1) ||
        (measuresCount === 0 &&
            !containsMeasureLocator(widthItem) &&
            widthItem.measureColumnWidthItem.locators.length === columnAttributesCount)
    );
};

// removes attribute widthItems with invalid identifiers
// removes measure widthItems with invalid identifiers and invalid number of locators
function adaptWidthItemsToPivotTable(
    originalColumnWidths: ColumnWidthItem[],
    measureLocalIdentifiers: string[],
    rowAttributeLocalIdentifiers: string[],
    columnAttributeLocalIdentifiers: string[],
    filters: IBucketFilter[],
): ColumnWidthItem[] {
    const attributeLocalIdentifiers = [...rowAttributeLocalIdentifiers, ...columnAttributeLocalIdentifiers];

    return originalColumnWidths.reduce((columnWidths: ColumnWidthItem[], columnWidth: ColumnWidthItem) => {
        if (isMeasureColumnWidthItem(columnWidth)) {
            // filter out invalid locators
            const filteredMeasureColumnWidthItem: IMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    ...columnWidth.measureColumnWidthItem,
                    locators: columnWidth.measureColumnWidthItem.locators.filter(locator => {
                        // filter out invalid measure locators
                        if (isMeasureLocatorItem(locator)) {
                            return includes(
                                measureLocalIdentifiers,
                                locator.measureLocatorItem.measureIdentifier,
                            );
                        }
                        // filter out invalid column attribute locators
                        return includes(
                            columnAttributeLocalIdentifiers,
                            locator.attributeLocatorItem.attributeIdentifier,
                        );
                    }),
                },
            };

            // check the attribute elements vs filters
            // and proper locators length
            // TODO: ONE-4449 - which will create widthItems with empty locators
            if (
                isWidthItemVisible(filteredMeasureColumnWidthItem, filters) &&
                widthItemLocatorsHaveProperLength(
                    filteredMeasureColumnWidthItem,
                    measureLocalIdentifiers.length,
                    columnAttributeLocalIdentifiers.length,
                )
            ) {
                return [...columnWidths, filteredMeasureColumnWidthItem];
            }
        } else {
            if (
                includes(attributeLocalIdentifiers, columnWidth.attributeColumnWidthItem.attributeIdentifier)
            ) {
                return [...columnWidths, columnWidth];
            }
        }

        return columnWidths;
    }, []);
}

export function adaptReferencePointWidthItemsToPivotTable(
    originalColumnWidths: ColumnWidthItem[],
    measures: IBucketItem[],
    rowAttributes: IBucketItem[],
    columnAttributes: IBucketItem[],
    previousRowAttributes: IBucketItem[],
    previousColumnAttributes: IBucketItem[],
    filters: IBucketFilter[],
): ColumnWidthItem[] {
    const measureLocalIdentifiers = measures.map(measure => measure.localIdentifier);
    const rowAttributeLocalIdentifiers = rowAttributes.map(rowAttribute => rowAttribute.localIdentifier);
    const columnAttributeLocalIdentifiers = columnAttributes.map(
        columnAttribute => columnAttribute.localIdentifier,
    );
    const previousRowAttributeLocalIdentifiers = previousRowAttributes.map(
        rowAttribute => rowAttribute.localIdentifier,
    );
    const previousColumnAttributeLocalIdentifiers = previousColumnAttributes.map(
        columnAttribute => columnAttribute.localIdentifier,
    );
    const filteredRowAttributeLocalIdentifiers = rowAttributeLocalIdentifiers.filter(
        rowAttributeLocalIdentifier =>
            !previousColumnAttributeLocalIdentifiers.includes(rowAttributeLocalIdentifier),
    );
    const filteredColumnAttributeLocalIdentifiers = columnAttributeLocalIdentifiers.filter(
        columnAttributeLocalIdentifier =>
            !previousRowAttributeLocalIdentifiers.includes(columnAttributeLocalIdentifier),
    );

    return adaptWidthItemsToPivotTable(
        originalColumnWidths,
        measureLocalIdentifiers,
        filteredRowAttributeLocalIdentifiers,
        filteredColumnAttributeLocalIdentifiers,
        filters,
    );
}
