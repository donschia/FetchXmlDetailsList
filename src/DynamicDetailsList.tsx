import * as React from 'react';
import { Fabric, DetailsList, IColumn, DetailsListLayoutMode, Stack, ConstrainMode, SelectionMode, IDetailsListProps, IDetailsRowStyles, DetailsRow, getTheme, Label, Spinner, SpinnerSize, Link, TooltipHost } from '@fluentui/react';
import { GetSampleData } from './GetSampleData';
import { Text } from '@fluentui/react/lib/Text';
import DynamicsWebApi = require('dynamics-web-api');
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react'; //'office-ui-fabric-react';
import { format } from 'date-fns';


const theme = getTheme();

const _LOOKUPLOGICALNAMEATTRIBUTE = "@Microsoft.Dynamics.CRM.lookuplogicalname";
// URL Placeholder is replaced with Dynamics365 Base URL (if available)
const _BASE_D365_URL_PLACEHOLDER = "[BASED365URL]";
// URL Placeholder is replaced with record ID
const _RECORD_ID_URL_PLACEHOLDER = "[ID]";
// USE_VALUE uses the record's text value as the absolute URL
const _USE_VALUE_URL_PLACEHOLDER = "[USE_VALUE]";

// format options are here: https://date-fns.org/v2.29.3/docs/format
const _DEFAULT_DATE_FORMAT = "yyyy-MM-dd hh:mm:ss";

export interface IDynamicDetailsListProps {
    items: any[];
    columns: IColumn[];
    fetchXml?: string;
    rootEntityName?: string;
    announcedMessage?: string;
    baseD365Url?: string;
}


export interface IDynamicDetailsListState {
    columns: IColumn[];
    items: any[]; //Record<string, string>[] //any[];
    fetchXml?: string;
    primaryEntityName?: string;
    announcedMessage?: string;
    baseD365Url?: string;
}


export class DynamicDetailsList extends React.Component<any, IDynamicDetailsListState> {
    private _allItems: any[];
    private _columns: any;
    private _pcfContext: any;
    private _webApi: DynamicsWebApi;

    // private _selection: Selection;
    private _primaryEntityName: string;
    private _fetchXml: string;
    private _announcedMessage: string;
    private _currentPageNumber: number;
    private _isDebugMode: boolean;
    private _baseD365Url?: string;

    //private _fetchXmlIdPlaceholder: string;
    //private _recordId: string;


    constructor(props: any) {
        super(props);

        if (this._isDebugMode) {
            debugger;  // eslint-disable-line no-debugger
        }

        this._pcfContext = props.context;
        this._primaryEntityName = props.primaryEntityName;
        this._fetchXml = props.fetchXml;
        //this._fetchXmlIdPlaceholder = props.fetchXmlIdPlaceholder;
        //this._recordId = props.recordId;
        this._allItems = props.items;
        this._columns = props.columns;
        this._isDebugMode = props.isDebugMode;
        this._baseD365Url = props.baseD365Url;

        this._currentPageNumber = 1;

        let useDynamicsWebApi: boolean = true;

        // Do we actually have a query to run, or are we using the sample data
        // Don't bother with Web Api if we aren't actually fetching data
        // This way we can quickly see changes in the PCF Test harness and not have to burn a full deploy cycle
        if (props.fetchXml) {

            this._columns = this._columns.map((column: IColumn) => ({
                key: column.key,
                name: column.name,
                ariaLabel: column.name,
                fieldName: column.fieldName,
                minWidth: column.minWidth,
                flexGrow: 1,
                data: column.data,
                //maxWidth: 200,
                isResizable: true,
                onColumnClick: this._onColumnClick
            }));

            if (this._isDebugMode) {
                console.log(`useDynamicsWebApi: ${useDynamicsWebApi}`);
            }

            if (useDynamicsWebApi) {
                // 3rd party DynamicsWebApi library allows access to the _Formatted items
                this._webApi = new DynamicsWebApi(
                    {
                        dataApi: { version: '9.0' },
                        useEntityNames: true
                    });

                this._webApi.executeFetchXml(this._primaryEntityName, this._fetchXml, "*", this._currentPageNumber, undefined, undefined)
                    .then((data) => {
                        //debugger;
                        // this._pagingCookie = data["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
                        //this._totalNumberOfRecords =  data.count;
                        // Sometimes data is an array[]                
                        // parentThis.loadGrid(data.length && data.length > 0 ? data[0] : data);
                        if (data && data.value && data.value.length > 0) {
                            this._allItems = data.value;

                            if (this._isDebugMode) {
                                console.log('_webApi.executeFetchXml : this._allItems', this._allItems);
                            }

                            this.setState(
                                {
                                    items: this._allItems,
                                    columns: this._columns,
                                    //announcedMessage: "Actual FetchXml Response used."
                                }
                            );
                        }

                    }).catch((e) => {
                        if (this._isDebugMode) {
                            console.log(e);
                            debugger; // eslint-disable-line no-debugger
                        }
                        this.setState({
                            announcedMessage: "Error fetching records"
                        });
                    });

            }
            else {
                // just use regular out of the box (lacks _Formatted helpers)
                this._pcfContext.webAPI.retrieveMultipleRecords(this._primaryEntityName, "?fetchXml=" + encodeURIComponent(this._fetchXml)).then(
                    (results: any) => {
                        if (results && results.entities && results.entities.length > 0) {
                            //_accountActivitiesItems = this.populateRecords(results);
                            this._allItems = results.entities;
                            if (this._isDebugMode) {
                                console.log('webAPI.retrieveMultipleRecords : this._allItems', this._allItems);
                            }
                            this.setState(
                                {
                                    items: this._allItems,
                                    columns: this._columns,
                                    //announcedMessage: "Actual FetchXml Response used."
                                }
                            );
                        }
                    },
                    (error: any) => {
                        if (this._isDebugMode) {
                            console.log(error);
                            debugger; // eslint-disable-line no-debugger
                        }
                        this.setState({
                            announcedMessage: "Error fetching records"
                        });
                    });
            }
        }
        // If we don't have any data, use sample data
        else if (!props.fetchXml || !props.dataItems || props.dataItems.length < 1) {
            var sampleData = GetSampleData();
            if (sampleData.dataItems && sampleData.dataItems.length > 0) {
                this._allItems = sampleData.dataItems;
                this._columns = sampleData.columns;
                this._primaryEntityName = sampleData.primaryEntityName;

                this._columns = this._columns.map((column: IColumn) => ({
                    key: column.key,
                    name: column.name,
                    ariaLabel: column.name,
                    fieldName: column.fieldName,
                    minWidth: column.minWidth,
                    flexGrow: 1,
                    //maxWidth: 200,
                    isResizable: true,
                    data: column.data,
                    // Sorting
                    onColumnClick: this._onColumnClick,
                    // Handle rendering lookup field links
                    /*
                    onRender: (item: any) => {
                        //if (column.key.indexOf(_LOOKUPLOGICALNAMEATTRIBUTE) > -1) {
                        if (item[column.key]) {
                            if (item[column.key + _LOOKUPLOGICALNAMEATTRIBUTE]) {
                                //let baseFieldName = column.key.replace(_LOOKUPLOGICALNAMEATTRIBUTE, "");
                                <Link key={item} onClick={() => this._pcfContext.navigation.openForm({ entityName: item[column.key + _LOOKUPLOGICALNAMEATTRIBUTE], entityId: item[column.key] })}>
                                    Link: {item[column.key]}
                                </Link>
                            }
                            else {
                                <span>{item[column.key]}</span>
                            }
                        }

                    },
                    */
                }));

                this._announcedMessage = "Using sample data...";
                this.setState({
                    //this.state = {
                    items: this._allItems,
                    columns: this._columns,
                    fetchXml: this._fetchXml,
                    announcedMessage: this._announcedMessage
                });
            }
        }

        this.state = {
            items: this._allItems,
            columns: this._columns,
            fetchXml: this._fetchXml,
            announcedMessage: this._announcedMessage
        };
    }

    public componentDidUpdate(previousProps: any, previousState: IDynamicDetailsListProps) {
    }

    // DetailsList documentation here:
    // https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist
    public render(): JSX.Element {
        const { columns, items, announcedMessage } = this.state;
        // if (this._isDebugMode) { console.log(items); }
        if (items) {
            return (
                <>
                    <Stack>
                        {announcedMessage && (
                            <Stack.Item align="center">
                                <Text color='red'>{announcedMessage}</Text>
                            </Stack.Item>
                        )}
                        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} style={{ top: '10px', zIndex: 0, bottom: '10px' }}>
                            <Stack.Item>
                                <DetailsList
                                    items={items}
                                    columns={columns}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    compact={true}
                                    selectionMode={SelectionMode.none}
                                    isHeaderVisible={true}
                                    constrainMode={ConstrainMode.unconstrained}
                                    onRenderRow={this._onRenderRow}
                                    onRenderDetailsHeader={this._onRenderDetailsHeader}
                                    // Double clicking a row
                                    //onItemInvoked={this._onItemInvoked}
                                    // Custom Rendering to support entity linking
                                    onRenderItemColumn={this._renderItemColumn}

                                    onItemInvoked={(item: any) => {
                                        // debugger;  // eslint-disable-line no-debugger
                                        this._pcfContext.navigation.openForm({
                                            entityName: this._primaryEntityName,
                                            entityId: item[this._primaryEntityName + "id"]
                                        });
                                    }}
                                />
                            </Stack.Item>
                            <Stack.Item align="start" >
                                <Text>Total Records: {items.length}</Text>
                            </Stack.Item>
                        </ScrollablePane>
                    </Stack >
                </>

            );
        }
        else
            return (
                <Stack horizontal={true} verticalAlign={'center'} >
                    <Spinner label="Loading Grid" size={SpinnerSize.medium} />
                </Stack>
            );
    }

    //private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    // _renderItemColumn(item: any, index: number | undefined, column: any) {
    private _renderItemColumn = (item: any, index: number | undefined, column: any): any => {
        // debugger; // eslint-disable-line no-debugger
        //const fieldContent = item[column.fieldName as keyof any] as string;
        let fieldContent = item[column.fieldName];

        if (item[column.key]) {
            // Handle any custom Date Formats via date=fns format string
            // DateFormat string options are here: https://date-fns.org/v2.29.3/docs/format
            // i.e.  "yyyy-dd-MM hh:mm:ss"
            if (column.data && column.data.dateFormat) {
                try {
                    let dateValue = new Date(fieldContent);
                    let dateFormat = column.data.dateFormat || _DEFAULT_DATE_FORMAT;
                    return (<span>{format(dateValue, column.data.dateFormat)}</span>);
                }
                catch (ex) {
                    // ignore
                    return (<span>{fieldContent}</span>);
                }
            }

            if (column.data && column.data.url && column.data.url !== "") {
                let url = column.data.url
                    .replace(_BASE_D365_URL_PLACEHOLDER, this._baseD365Url)
                    .replace(_RECORD_ID_URL_PLACEHOLDER, item[column.key]);
                return (<Link key={item} href={url} target="_blank">{fieldContent}</Link>);
            }
            // URL field handling - open in a new tab/window
            //else if (fieldContent && String(fieldContent).startsWith("http")) {
            else if (column.data && column.data.url === _USE_VALUE_URL_PLACEHOLDER) {
                return (<Link key={item} href={fieldContent} target="_blank">External Link</Link>);
            }
            // Support linking to other entities
            else if (item[column.key + _LOOKUPLOGICALNAMEATTRIBUTE]) {
                if (column.data && column.data.entityLinking && column.data.entityLinking == true) {
                    //let baseFieldName = column.key.replace(_LOOKUPLOGICALNAMEATTRIBUTE, "");
                    return (<Link key={item} onClick={() => this._pcfContext.navigation.openForm({ entityName: item[column.key + _LOOKUPLOGICALNAMEATTRIBUTE], entityId: item[column.key] })}>
                        {fieldContent}
                    </Link>
                    );
                }
                else {
                    return (<span>{fieldContent.toString()}</span>);
                }
            }
            else {
                return (<span>{fieldContent.toString()}</span>);
            }
        }
    }

    private _onItemInvoked(item: any): void {
        // Open the form.
        this._pcfContext.navigation.openForm(
            {
                entityName: this._primaryEntityName,
                entityId: item[this._primaryEntityName + "id"]
            }
        );
    }

    private link_Click(evt: Event): void {
        var currentItem = evt.currentTarget;

        // @ts-ignore
        var data = currentItem.dataset;
        var recordId = data.recordId;
        var recordLogicalName = data.recordLogicalName;

        var entityFormOptions: { entityName?: string, entityId?: string, openInNewWindow?: boolean } = {};
        entityFormOptions.entityName = recordLogicalName;
        entityFormOptions.entityId = recordId;
        //entityFormOptions.openInNewWindow = window.event.ctrlKey;
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, items } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
                if (this._isDebugMode) {
                    console.log(`${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'} `);
                }
                //this.setState({
                //    announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'} `,
                //});
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: newItems,
        });

        function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
            const key = columnKey as keyof T;
            return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
        }
    };


    private _onRenderDetailsHeader(props: any, defaultRender?: any) {
        return defaultRender!({
            ...props,
            onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
                return (
                    <TooltipHost {...tooltipHostProps} />
                )
            }
        });
    }

    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props) {
            if (props.itemIndex % 2 === 0) {
                // Every other row renders with a different background color
                customStyles.root = { backgroundColor: theme.palette.themeLighterAlt };
            }

            return <DetailsRow {...props} styles={customStyles} />;
        }
        return null;
    };
}