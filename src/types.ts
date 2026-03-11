import { TableColumnDefinition, TableRowId } from '@fluentui/react-components';
import { CustomIconType } from './icons/CustomIcons';

// Interface for FluentUI v8 style column (what we receive from JSON)
export interface ILegacyColumn {
    key: string;
    fieldName: string;
    name: string;
    minWidth?: number;
    maxWidth?: number;
    data?: {
        joinValuesFromTheseFields?: string[];
        dateFormat?: string;
        entityLinking?: boolean;
        url?: string;
        urlLinkText?: string;
    };
}

// Type for the column data structure that comes from JSON parsing
export interface IColumnDataStructure {
    default?: ILegacyColumn[];
    [key: string]: any;
}

// Configuration for custom ribbon button
export interface ICustomButtonConfig {
    buttonText: string;
    functionName: string;
    customPageName: string;
    webResourceName?: string; // Web resource containing the function (e.g., "gli_projectribbon.js")
    dialogTitle?: string;
    dialogWidth?: number;
    dialogHeight?: number;
    showWhenSelectedMin?: number;
    showWhenSelectedMax?: number;
    icon?: CustomIconType; // Optional icon name (defaults to 'Add' if not specified)
    autoRefreshDataOnComplete?: boolean; // If true, automatically refreshes the grid data after the button action completes successfully
    showOnEmptyResults?: boolean; // If true, button will be visible even when query returns no results (defaults to false)
}

// Component that combines button configuration with its click handler
export interface ICustomButtonComponent {
    config: ICustomButtonConfig;
    onClick: () => void;
}

export interface IDynamicDetailsListProps {
    items?: any[];
    columns: IColumnDataStructure | ILegacyColumn[] | TableColumnDefinition<any>[];
    fetchXml?: string | null;
    rootEntityName?: string;
    announcedMessage?: string;
    baseEnvironmentUrl?: string;
    context?: any;
    primaryEntityName?: string;
    baseD365Url?: string;
    dataItems?: any[];
    CustomButtonConfig?: string | null; // JSON string containing ICustomButtonConfig
    recordId?: string;
    hideNewButton?: boolean;
    hideRefreshButton?: boolean;
    hideExportButton?: boolean;
    hideBulkEditButton?: boolean;
}

export interface IDynamicDetailsListState {
    columns: TableColumnDefinition<any>[];
    items: any[];
    fetchXml?: string;
    primaryEntityName?: string;
    announcedMessage?: string;
    baseEnvironmentUrl?: string;
    selectedRowIds: Set<TableRowId>;
    focusedCellId?: string;
}

