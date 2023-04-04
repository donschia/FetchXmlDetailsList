import * as React from 'react';
import { Fabric, DetailsList } from '@fluentui/react';

export class BarebonesDetailsList extends React.Component<{}, any> {
    _allItems: any;
    _columns: any;
    constructor(props: {}) {
        super(props);
        //Creating rows data
        this._allItems = [];
        for (let i = 0; i < 10; i++) {
            this._allItems.push({
                key: i,
                name: 'Test Record' + i,
                value: i,
            });
        }
        //defining columns

        this._columns = [
            { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 100 },
            { key: 'column2', name: 'Value', fieldName: 'value', minWidth: 100 },
        ];
        //Adding values to state
        this.state = {
            items: this._allItems,
            columns: this._columns,
        };
    }

    public render() {
        return (
            <DetailsList
                items={this.state.items}
                columns={this.state.columns}
            />

        )

    }

}