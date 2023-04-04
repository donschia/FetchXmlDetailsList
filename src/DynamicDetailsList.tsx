import * as React from 'react';
import { Fabric, DetailsList, IColumn, DetailsListLayoutMode, Stack } from '@fluentui/react';
import { GetSampleData } from './GetSampleData';
import { Text } from '@fluentui/react/lib/Text';

export interface IDynamicDetailsListProps {
    items: any[];
    columns: IColumn[];

    fetchXml: string;
    rootEntityName: string;
    // announcedMessage: string;
    // context: any

}

/*
export interface IDynamicDetailsListState {
    columns: IColumn[];
    items: any[];
    selectionDetails: string;
    isModalSelection: boolean;
    isCompactMode: boolean;
    announcedMessage?: string;
}
*/

export class DynamicDetailsList extends React.Component<any, any> {
    _allItems: any;
    _columns: any;
    private _pcfContext: any;

    // private _selection: Selection;
    private _rootEntityName: string;
    private _fetchXml: string;
    private _announcedMessage: string;
    private _fetchXmlIdPlaceholder: string;
    private _recordId: string;

    constructor(props: any) {
        super(props);

        debugger;  // eslint-disable-line no-debugger
        this._pcfContext = props.context;
        this._rootEntityName = props.rootEntityName;
        this._fetchXml = props.fetchXml;
        this._fetchXmlIdPlaceholder = props.fetchXmlIdPlaceholder;
        this._recordId = props.recordId;
        this._allItems = props.items;
        this._columns = props.columns;

        // 

        if (props.fetchXml) {
            // Replace placeholder with Id
            this._fetchXml = this.replaceFetchXmlPlaceholder(this._fetchXml, this._fetchXmlIdPlaceholder, this._recordId);

            // query via FetchXML
            this._pcfContext.webAPI.retrieveMultipleRecords(this._rootEntityName, "?fetchXml=" + encodeURIComponent(this._fetchXml)).then(
                (results: any) => {
                    //_accountActivitiesItems = this.populateRecords(results);
                    this.state = {
                        items: this._allItems,
                        columns: this._columns,
                        fetchXml: this._fetchXml,
                        //rootEntityName: this._rootEntityName,
                        //context: this._pcfContext,
                        //announcedMessage: ""
                    };
                },
                (error: any) => {
                    this.setState({
                        announcedMessage: "Error while fetching records"
                    });
                }
            );
        }
        // If we don't have any data, then get some sample data
        else if (!props.fetchXml || !props.dataItems || props.dataItems.length < 1) {
            // ({this._allItems, this._columns, this._rootEntityName} = GetSampleData());

            var sampleData = GetSampleData();
            this._allItems = sampleData.dataItems;
            this._columns = sampleData.columns;
            this._rootEntityName = sampleData.rootEntityIdField;

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
    }

    public render() {

        //const { columns, items, announcedMessage } = this.state;

        return (
            <>
                {this.state.announcedMessage && (
                    <Stack horizontalAlign='center'>
                        <Text color='red'>{this.state.announcedMessage}</Text>
                    </Stack>
                )}
                <DetailsList
                    items={this.state.items}
                    columns={this.state.columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    compact={true}

                    //onItemInvoked={this._onItemInvoked}
                    onItemInvoked={(item: any) => {
                        // debugger;  // eslint-disable-line no-debugger
                        this._pcfContext.navigation.openForm(
                            {
                                entityName: this._rootEntityName,
                                entityId: item[this._rootEntityName + "id"]
                            }
                        );
                    }}
                />

            </>

        );

    }

    private replaceFetchXmlPlaceholder(fetchXml: string, placeholder: string, recordId: string) {
        return fetchXml.replace(placeholder, recordId);
    }

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
                    announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'}`,
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