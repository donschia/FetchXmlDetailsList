import * as React from 'react';
//import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, } from '@fluentui/react/lib/DetailsList';

import { Link } from '@fluentui/react/lib/Link';
//import { initializeIcons } from '@uifabric/icons';
import Stack from '@fluentui/react/lib/components/Stack/Stack';
import { Text } from '@fluentui/react/lib/Text';

//initializeIcons();

export interface IDetailsListState {
    columns: IColumn[];
    items: IDetailsListItem[];
    announcedMessage?: string;
}

export interface IDetailsListItem {
    key: string;
    subject: string;
    regardingobjectid: string;
    activitytypecode: string;
    statecode: string;
    ownerid: string;
    scheduledend: string;
    createdon: string;
    modifiedon: string;
}
export class ActivitiesGrid extends React.Component<any, IDetailsListState> {
    private _allItems: IDetailsListItem[];
    private _pcfContext: any;
    private _accountid: string;
    private _announcedMessage: string = "loading....";

    constructor(props: any) {
        super(props);
        this._pcfContext = props.pcfContext;
        this._accountid = props.accountid;

        const _relatedContactActivitiesfetchXml: string = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            "   <entity name='activitypointer'>" +
            "      <attribute name='subject' />" +
            "      <attribute name='ownerid' />" +
            "      <attribute name='regardingobjectid' />" +
            "      <attribute name='activitytypecode' />" +
            "      <attribute name='statecode' />" +
            "      <attribute name='scheduledstart' />" +
            "      <attribute name='scheduledend' />" +
            "      <attribute name='instancetypecode' />" +
            "      <attribute name='modifiedon' />" +
            "      <attribute name='createdon' />" +
            "      <attribute name='activityid' />" +
            "      <order attribute='modifiedon' descending='true' />" +
            "      <filter type='and'>" +
            "        <condition attribute='isregularactivity' operator='eq' value='1' />" +
            "      </filter>" +
            "      <link-entity name='contact' from='contactid' to='regardingobjectid' link-type='inner' alias='ldc'>" +
            "        <filter type='and'>" +
            "          <condition attribute='parentcustomerid' operator='eq' value='" + this._accountid + "' />" +
            "        </filter>" +
            "      </link-entity>" +
            "    </entity>" +
            "  </fetch>";

        const _accountActivitiesfetchXml: string = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            "   <entity name='activitypointer'>" +
            "      <attribute name='subject' />" +
            "      <attribute name='ownerid' />" +
            "      <attribute name='regardingobjectid' />" +
            "      <attribute name='activitytypecode' />" +
            "      <attribute name='statecode' />" +
            "      <attribute name='scheduledstart' />" +
            "      <attribute name='scheduledend' />" +
            "      <attribute name='instancetypecode' />" +
            "      <attribute name='modifiedon' />" +
            "      <attribute name='createdon' />" +
            "      <attribute name='activityid' />" +
            "      <order attribute='modifiedon' descending='true' />" +
            "      <filter type='and'>" +
            "        <condition attribute='isregularactivity' operator='eq' value='1' />" +
            "        <condition attribute='regardingobjectid' operator='eq'  value='" + this._accountid + "' />" +
            "      </filter>" +
            "    </entity>" +
            "  </fetch>";

        let _accountActivitiesItems: any[] = [];
        let _relatedContactActivitiesItems: any[] = [];
        let _allActivities: any[] = [];

        this._pcfContext.webAPI.retrieveMultipleRecords('activitypointer', "?fetchXml=" + encodeURIComponent(_accountActivitiesfetchXml)).then(
            (results: any) => {
                _accountActivitiesItems = this.populateRecords(results);
                this._pcfContext.webAPI.retrieveMultipleRecords('activitypointer', "?fetchXml=" + encodeURIComponent(_relatedContactActivitiesfetchXml)).then(
                    (results: any) => {
                        _relatedContactActivitiesItems = this.populateRecords(results);
                        _allActivities = _relatedContactActivitiesItems.concat(_accountActivitiesItems);
                        this._allItems = _allActivities.sort((a: { modifiedon_Value: number; }, b: { modifiedon_Value: number; }) => b.modifiedon_Value - a.modifiedon_Value);
                        if (this._allItems == null || this._allItems.length > 0) {
                            this.setState({ items: this._allItems });
                        } else {
                            this.setState({ announcedMessage: "No data found" });
                        }
                    },
                    (error: any) => {
                        this.setState({ announcedMessage: "Error while fetching records" });
                    }
                );
            },
            (error: any) => {
                this.setState({
                    announcedMessage: "Error while fetching records"
                });
            }
        );
        this._allItems = _allActivities;
        const columns: IColumn[] = [
            {
                key: 'subject', name: 'Subject', fieldName: 'subject', isRowHeader: true, minWidth: 100, maxWidth: 200, isResizable: true,
                onRender: item => (
                    <Link key={item} onClick={() => this._pcfContext.navigation.openForm({ entityName: item.activitytypecode_Value, entityId: item.key })}>
                        {item.subject}
                    </Link>
                ), onColumnClick: this._onColumnClick
            },

            {
                key: 'regardingobjectid', name: 'Regarding', fieldName: 'regardingobjectid', minWidth: 100, maxWidth: 200, isResizable: true,
                onRender: item => (
                    <Link key={item} onClick={() => this._pcfContext.navigation.openForm({ entityName: item.regardingobjectid_LookupLogicalName, entityId: item.regardingobjectid_Guid })}>
                        {item.regardingobjectid}
                    </Link>
                ), onColumnClick: this._onColumnClick
            },

            { key: 'activitytypecode', name: 'Activity Type', fieldName: 'activitytypecode', minWidth: 100, maxWidth: 200, isResizable: true, onColumnClick: this._onColumnClick },
            { key: 'statecode', name: 'Activity Status', fieldName: 'statecode', minWidth: 100, maxWidth: 200, isResizable: true, onColumnClick: this._onColumnClick },

            {
                key: 'ownerid', name: 'Owner', fieldName: 'ownerid', minWidth: 100, maxWidth: 200, isResizable: true,
                onRender: item => (
                    <Link key={item} onClick={() => this._pcfContext.navigation.openForm({ entityName: item.ownerid_LookupLogicalName, entityId: item.ownerid_Guid })}>
                        {item.ownerid}
                    </Link>
                ), onColumnClick: this._onColumnClick
            },


            {
                key: 'scheduledend', name: 'Due Date', fieldName: 'scheduledend_Value', minWidth: 100, maxWidth: 200, isResizable: true,
                data: 'number', onRender: (item: IDetailsListItem) => { return <span>{item.scheduledend}</span>; }, onColumnClick: this._onColumnClick
            },

            {
                key: 'createdon', name: 'Created On', fieldName: 'createdon_Value', minWidth: 100, maxWidth: 200, isResizable: true,
                data: 'number', onRender: (item: IDetailsListItem) => { return <span>{item.createdon}</span>; }, onColumnClick: this._onColumnClick
            },

            {
                key: 'modifiedon', name: 'Last Modified', fieldName: 'modifiedon_Value', minWidth: 100, maxWidth: 200, isResizable: true, isSorted: true, isSortedDescending: true, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A',
                data: 'number', onRender: (item: IDetailsListItem) => { return <span>{item.modifiedon}</span>; }, onColumnClick: this._onColumnClick
            }
        ];

        this.state = {
            items: this._allItems,
            columns: columns,
            announcedMessage: this._announcedMessage
        };
    }

    public render(): JSX.Element {
        const { columns, items, announcedMessage } = this.state;
        return (
            <>
                <div style={{ position: 'relative', maxHeight: '400px', overflow: "auto" }}>
                    <DetailsList
                        items={items}
                        columns={columns}
                        selectionMode={SelectionMode.none}
                        getKey={this._getKey}
                        setKey="none"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        onItemInvoked={(item: any) => {
                            this._pcfContext.navigation.openForm(
                                {
                                    entityName: item.activitytypecode_Value,
                                    entityId: item.key
                                }
                            );
                        }
                        }
                    />
                    {!this.state.items.length && (
                        <Stack horizontalAlign='center'>
                            <Text>{announcedMessage}</Text>
                        </Stack>
                    )}
                </div>
            </>
        );
    }

    public componentDidUpdate(previousProps: any, previousState: IDetailsListState) {

    }

    private populateRecords(results: any): any {
        let _allItems: any[] = [];
        for (let i = 0; i < results.entities.length; i++) {
            let e = results.entities[i];
            _allItems.push({
                key: e.activityid,
                subject: e.subject,
                regardingobjectid_Guid: e["_regardingobjectid_value"],
                regardingobjectid: e["_regardingobjectid_value@OData.Community.Display.V1.FormattedValue"],
                regardingobjectid_LookupLogicalName: e["_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname"],

                activitytypecode_Value: e.activitytypecode,
                activitytypecode: e["activitytypecode@OData.Community.Display.V1.FormattedValue"],

                statecode: e["statecode@OData.Community.Display.V1.FormattedValue"],

                ownerid_Guid: e["_ownerid_value"],
                ownerid: e["_ownerid_value@OData.Community.Display.V1.FormattedValue"],
                ownerid_LookupLogicalName: e["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"],


                scheduledstart: (e.scheduledstart != null ? new Date(e.scheduledstart).toLocaleDateString() : ""),
                scheduledstart_Value: (e.scheduledstart != null ? new Date(e.scheduledstart).getTime() : 0),

                scheduledend: (e.scheduledend != null ? new Date(e.scheduledend).toLocaleDateString() : ""),
                scheduledend_Value: (e.scheduledend != null ? new Date(e.scheduledend).getTime() : 0),

                createdon: (e.createdon != null ? new Date(e.createdon).toLocaleDateString() : ""),
                createdon_Value: (e.createdon != null ? new Date(e.createdon).getTime() : 0),

                modifiedon: (e.modifiedon != null ? new Date(e.modifiedon).toLocaleDateString() : ""),
                modifiedon_Value: (e.modifiedon != null ? new Date(e.modifiedon).getTime() : 0)
            });
        }
        return _allItems;
    }

    private _getKey(item: any, index?: number): string {
        return item.key;
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
                    announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'
                        }`,
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
    };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
} 