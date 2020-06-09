// (C) 2020 GoodData Corporation
import {
    ColumnWidthItem,
    IMeasureColumnWidthItem,
    IAttributeColumnWidthItem,
    isAttributeColumnWidthItem,
    isMeasureLocatorItem,
} from "../../../../interfaces/PivotTable";

import { IAttributeFilter, IBucketFilter, isAttributeFilter } from "../../../interfaces/Visualization";

const isAttributeColumnWidthItemVisible = (
    _widthItem: IAttributeColumnWidthItem,
    _filters: IBucketFilter[],
): boolean => true;

const isMeasureSortItemMatchedByFilter = (
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
            return isVisible && shouldBeMatched === isMeasureSortItemMatchedByFilter(sortItem, filter);
        }
        return isVisible;
    }, true);

export const isWidthItemVisible = (widthItem: ColumnWidthItem, filters: IBucketFilter[]): boolean =>
    isAttributeColumnWidthItem(widthItem)
        ? isAttributeColumnWidthItemVisible(widthItem, filters)
        : isMeasureColumnWidthItemVisible(widthItem, filters);
