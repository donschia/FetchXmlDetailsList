/*
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DetailsList, IColumn } from '@fluentui/react';
import { WebApiClient } from 'xrm-webapi-client';
import { IInputs, IOutputs } from './generated/ManifestTypes';
//import { HelloWorld, IHelloWorldProps } from "../SimpleDetailsList/HelloWorld";
// import { FluentUIDetailsListControl } from "../SimpleDetailsList/FluentUIDetailedList";
import ReactDOM = require("react-dom");
// import { DetailsListDocumentsExample } from "../SimpleDetailsList/DetailsListDocumentsExample";
// import { DetailsListSample } from "../SimpleDetailsList/DetailsListSample";

export class FetchXmlTable implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private _container: HTMLDivElement;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Set the context and container variables
        this._context = context;
        this._container = container;
    }

    public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void> {
        // Get the FetchXML query from the input parameters
        const fetchXml = this._context.parameters.fetchXml.raw || '';

        // Execute the FetchXML query using the Web API
        const records = await WebApiClient.retrieveMultipleRecords(fetchXml);

        // Extract the column names and rows from the records
        const columns = Object.keys(records[0]);
        const rows = records.map((record) => Object.values(record));

        // Convert the columns and rows to the DetailsList format
        const items: any[] = rows;
        const columnsData: IColumn[] = columns.map((columnName) => {
            return {
                key: columnName,
                name: columnName,
                fieldName: columnName,
                minWidth: 100,
                maxWidth: 300,
                isResizable: true
            };
        });

        // Render the DetailsList component
        ReactDOM.render(
            <DetailsList columns={columnsData} items={items} />,
            this._container
        );
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Clean up the React component
        ReactDOM.unmountComponentAtNode(this._container);
    }
}
*/