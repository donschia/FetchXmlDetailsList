import * as React from 'react';
import { Fabric, DetailsList, IColumn, DetailsListLayoutMode, Stack } from '@fluentui/react';
import { GetSampleData } from './GetSampleData';
import { Text } from '@fluentui/react/lib/Text';
import DynamicsWebApi = require('dynamics-web-api');

export interface IDynamicDetailsListProps {
    items: any[];
    columns: IColumn[];

    fetchXml?: string;
    rootEntityName?: string;
    announcedMessage?: string;
    // context: any

}


export interface IDynamicDetailsListState {
    columns: IColumn[];
    items: any[];
    fetchXml?: string;
    primaryEntityName?: string;
    announcedMessage?: string;

    //selectionDetails: string;
    //isModalSelection: boolean;
    //isCompactMode: boolean;

}


export class DynamicDetailsList extends React.Component<any, IDynamicDetailsListState> {
    _allItems: any[];
    _columns: any;
    private _pcfContext: any;
    private _webApi: DynamicsWebApi;

    // private _selection: Selection;
    private _primaryEntityName: string;
    private _fetchXml: string;
    private _announcedMessage: string;
    private _currentPageNumber: number;
    //private _fetchXmlIdPlaceholder: string;
    //private _recordId: string;

    constructor(props: any) {
        super(props);

        debugger;  // eslint-disable-line no-debugger
        this._pcfContext = props.context;
        this._primaryEntityName = props.primaryEntityName;
        this._fetchXml = props.fetchXml;
        //this._fetchXmlIdPlaceholder = props.fetchXmlIdPlaceholder;
        //this._recordId = props.recordId;
        this._allItems = props.items;
        this._columns = props.columns;
        this._currentPageNumber = 1;


        // 

        if (props.fetchXml) {
            // No Web Api if we aren't actually fetching via WebApi
            this._webApi = new DynamicsWebApi(
                {
                    dataApi: { version: '9.1' },
                    useEntityNames: true
                });
            // query via FetchXML
            // TODO: Switch it over to use 3rd party library so we can get the _Formatted items back?
            this._webApi.executeFetchXml(this._primaryEntityName, this._fetchXml, "*", this._currentPageNumber, undefined, undefined)
                .then((data) => {
                    //debugger;
                    // this._pagingCookie = data["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
                    //this._totalNumberOfRecords =  data.count;
                    // Sometimes data is an array[]                
                    // parentThis.loadGrid(data.length && data.length > 0 ? data[0] : data);
                    this._allItems = data.value;
                    this._columns = this._columns.map((column: IColumn) => ({
                        key: column.key,
                        name: column.name,
                        fieldName: column.fieldName,
                        minWidth: column.minWidth,
                        flexGrow: 1,
                        //maxWidth: 200,
                        isResizable: true,
                        onColumnClick: this._onColumnClick
                    }));

                    this.setState(
                        {
                            items: this._allItems,
                            columns: this._columns,
                            announcedMessage: "Actual FetchXml Response used."
                        }
                    );
                }).catch((e) => {
                    debugger; // eslint-disable-line no-debugger
                });


            /*
                       this._pcfContext.webAPI.retrieveMultipleRecords(this._rootEntityName, "?fetchXml=" + encodeURIComponent(this._fetchXml)).then(
                           (results: any) => {
                               if (results && results.entities.length > 0) {
                                   //_accountActivitiesItems = this.populateRecords(results);
                                   this._allItems = results.entities;
                                   this._columns = this._columns.map((column: IColumn) => ({
                                       key: column.key,
                                       name: column.name,
                                       fieldName: column.fieldName,
                                       minWidth: column.minWidth,
                                       flexGrow: 1,
                                       //maxWidth: 200,
                                       isResizable: true,
                                       onColumnClick: this._onColumnClick
                                   }));
           
                                   this.setState(
                                       {
                                           items: this._allItems,
                                           columns: this._columns,
                                           announcedMessage: "Actual FetchXml Response used."
                                       }
                                   );
                               }
                           },
                           (error: any) => {
                               this.setState({
                                   announcedMessage: "Error fetching records"
                               });
                           }
                       );
            */
        }
        // If we don't have any data, then get some sample data
        else if (!props.fetchXml || !props.dataItems || props.dataItems.length < 1) {
            // ({this._allItems, this._columns, this._rootEntityName} = GetSampleData());

            var sampleData = GetSampleData();
            if (sampleData.dataItems && sampleData.dataItems.length > 0) {
                this._allItems = sampleData.dataItems;
                this._columns = sampleData.columns;
                this._primaryEntityName = sampleData.primaryEntityName;

                this._columns = this._columns.map((column: IColumn) => ({
                    key: column.key,
                    name: column.name,
                    fieldName: column.fieldName,
                    minWidth: column.minWidth,
                    flexGrow: 1,
                    //maxWidth: 200,
                    isResizable: true,
                    onColumnClick: this._onColumnClick
                }));

                this._announcedMessage = "Using sample data...";
                // this.setState(
                this.state = {
                    items: this._allItems,
                    columns: this._columns,
                    fetchXml: this._fetchXml,
                    announcedMessage: this._announcedMessage
                };
            }
        }

        /*
        this._columns = this._columns.map((column: IColumn) => ({
            key: column.key,
            name: column.name,
            fieldName: column.fieldName,
            minWidth: column.minWidth,
            flexGrow: 1,
            //maxWidth: 200,
            isResizable: true,
            onColumnClick: this._onColumnClick
        }));
        */
        /*
        this._columns = [
            { key: 'name', name: 'Name', fieldName: 'name', flexGrow: 1, isResizable: true, minWidth: 200, data: 'string', onColumnClick: this._onColumnClick },
            { key: 'accountid', name: 'Account Id', fieldName: 'accountid', flexGrow: 1, isResizable: true, minWidth: 100, onColumnClick: this._onColumnClick },
            { key: 'contr.title', name: 'Contract Title', fieldName: 'contr.title', flexGrow: 1, isResizable: true, minWidth: 200, onColumnClick: this._onColumnClick },
            { key: 'contr.activeon', name: 'Contract Start', fieldName: 'contr.activeon', flexGrow: 1, isResizable: true, minWidth: 100, data: 'string', onColumnClick: this._onColumnClick },
            { key: 'contr.mcaogs_qptm_id', name: 'Contract #', fieldName: 'contr.mcaogs_qptm_id', flexGrow: 1, isResizable: true, minWidth: 100, data: 'string', onColumnClick: this._onColumnClick },
            { key: 'mcaogs_sourcesystemname', name: 'Source', fieldName: 'mcaogs_sourcesystemname', flexGrow: 1, isResizable: true, minWidth: 100, onColumnClick: this._onColumnClick },
            { key: 'mcaogs_sourcesystemid', name: 'Source Id', fieldName: 'mcaogs_sourcesystemid', flexGrow: 1, isResizable: true, minWidth: 100, onColumnClick: this._onColumnClick },
        ];
        */
        /*
         //Adding values to state
         this.state = {
             items: this._allItems,
             columns: this._columns,
             announcedMessage: this._announcedMessage
             //fetchXml: this._fetchXml,
             //rootEntityName: this._rootEntityName,
             //context: this._pcfContext,
             //announcedMessage: ""
         };
         */

        this.state = {
            items: this._allItems,
            columns: this._columns,
            fetchXml: this._fetchXml,
            announcedMessage: this._announcedMessage
        };
    }

    public componentDidUpdate(previousProps: any, previousState: IDynamicDetailsListProps) {
    }

    public render(): JSX.Element {

        const { columns, items, announcedMessage } = this.state;
        if (items) {
            return (
                <>
                    <Stack>
                        {announcedMessage && (
                            <Stack horizontalAlign='center'>
                                <Text color='red'>{announcedMessage}</Text>
                            </Stack>
                        )}
                        <Stack>
                            <DetailsList
                                items={items}
                                columns={columns}
                                layoutMode={DetailsListLayoutMode.justified}
                                compact={true}

                                //onItemInvoked={this._onItemInvoked}
                                onItemInvoked={(item: any) => {
                                    // debugger;  // eslint-disable-line no-debugger
                                    this._pcfContext.navigation.openForm(
                                        {
                                            entityName: this._primaryEntityName,
                                            entityId: item[this._primaryEntityName + "id"]
                                        }
                                    );
                                }}
                            />
                        </Stack>
                    </Stack>
                </>

            );
        }
        else
            return (<Stack><Text>Grid is Loading</Text></Stack>);
    }



    // private replaceFetchXmlPlaceholder(fetchXml: string, placeholder: string, recordId: string) {
    //    return fetchXml.replace(placeholder, recordId);
    //}

    private _onItemInvoked(item: any): void {
        debugger;  // eslint-disable-line no-debugger
        alert(`Item invoked: ${item.name}`);

        // Open the form.
        //Xrm.Navigation.openForm(entityFormOptions);
        this._pcfContext.navigation.openForm({ entityName: item.activitytypecode_Value, entityId: item.key });
        /*
        const record = this_items.records[item.key];
        dataset.openDatasetItem(record.getNamedReference());
        this._context.navigation.openForm({
            entityName: "orb_pcftester",
            entityId: "27a3e4a0-7ad2-ea11-a812-000d3a23cb53"
        })
        */
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

        // Open the form.
        //Xrm.Navigation.openForm(entityFormOptions);
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, items } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
                this.setState({
                    announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'} `,
                });
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

}