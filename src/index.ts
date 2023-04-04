import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import ReactDOM = require("react-dom");
import { GetSampleData } from "./GetSampleData";
import { DynamicDetailsList } from "./DynamicDetailsList";
import { IColumn } from "@fluentui/react";

export class FetchXmlDetailsList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    private _primaryEntityName: string;
    private _primaryEntityNamePlural: string;
    private _fetchXML: string | null;
    private _fieldLayout: Array<{ Order: number, Name: string, Width: number, FullSchemaName: string } >;
    private _columnLayout: Array<IColumn>;
    private _itemsPerPage: number | null;
    private _totalNumberOfRecords: number;

     /** General */
     private _context: ComponentFramework.Context<IInputs>;
     private _notifyOutputChanged: () => void;
     private _container: HTMLDivElement;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;      
    }

    private initVars(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._itemsPerPage = 5000;

        if (this._context.parameters.ItemsPerPage) {
            this._itemsPerPage = this._context.parameters.ItemsPerPage.raw;
        }
        var fetchXML : string | null = this._context.parameters.FetchXML.raw; // ?? this.DEFAULT_FETCHXML;
        var recordIdPlaceholder : string | null = this._context.parameters.RecordIdPlaceholder.raw; // ?? "";  

        // TODO: We need a supported generic way to get the current record Id for PETESSAKE
        let currentRecordId =  "e1b50ead-1cf0-e811-8172-e0071b6af241"; //this._context.page.entityId;
        //let recordIdParameter = this._context.parameters.RecordId;
        var controlAnchorField : string | null = this._context.parameters.ControlAnchorField.raw;
        // const recordIdLookupValue: ComponentFramework.EntityReference = this._context.parameters.RecordId.raw[0];
        var recordId : string = currentRecordId; //this._context.parameters.RecordId.raw ?? currentRecordId;

        // Other values if we need them
        let entityId = (<any>this._context.mode).contextInfo.entityId;
        let entityTypeName = (<any>this._context.mode).contextInfo.entityTypeName;
        let entityDisplayName = (<any>this._context.mode).contextInfo.entityRecordName;
        let baseUrl = (<any>this._context).page.getClientUrl();

        // Replace the placeholder     
        this._fetchXML = fetchXML != null ? this.replacePlaceholderWithId(fetchXML, recordId, recordIdPlaceholder ?? "") : null;
        
        // Layout provides field ordering, names, and widths
        // let fieldLayoutJson = this._context.parameters.FieldLayoutJson.raw;
        // this._fieldLayout = JSON.parse(fieldLayoutJson); //this.DEFAULT_FIELDLAYOUT);
        let columnLayoutJson = this._context.parameters.ColumnLayoutJson.raw;
        this._columnLayout = columnLayoutJson!= null ? JSON.parse(columnLayoutJson) : null;
        //this._webApi = new DynamicsWebApi({ webApiVersion: '9.0' });
        //this._headers = new Array<string>();
        //this._headerDisplayNames = new Array<{ LogicalName: string, DisplayName: string }>();
        // Configurable via input parameter, defaults to 50
        this._itemsPerPage = 50;
        //this._currentPageNumber = 1;

        //var globalContext = Xrm.Utility.getGlobalContext();
        //var appUrl = globalContext.getCurrentAppUrl();

        this._container.style.overflow = "auto";
    }

    private replacePlaceholderWithId(fetchXML: string, recordId: string, recordIdPlaceholder: string) : string {
        if (recordId && recordIdPlaceholder) {
            if (fetchXML.indexOf(recordIdPlaceholder) > -1) {
                return fetchXML.replace(recordIdPlaceholder, recordId);
            }
        }
        return fetchXML;
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        debugger;  // eslint-disable-line no-debugger
        //this.renderControl(context);
        //let dataAndLayout: any;
    
        //ReactDOM.render(React.createElement(FluentUIDetailsListControl, data, {}), this.container);
        //ata = require("../data/fetchXML.Response.json");
        if (this._fetchXML && this._fetchXML != "") {
            //let dataAndLayout = GetSampleData();
            let props = { rootEntityName: "account", fetchXml: this._fetchXML, context: context }         
            
            return React.createElement(DynamicDetailsList, props, {});
        }
        else{
            // Get some sample data while testing
            let dataAndLayout = GetSampleData();
            let props = { dataItems: dataAndLayout.dataItems, columns: dataAndLayout.columns, rootEntityName: "account", fetchXml: "", context: context }         
            
            return React.createElement(DynamicDetailsList, props, {});
        }
        //return React.createElement(DetailsListSample, data, {})

        //const props: IHelloWorldProps = { name: 'Hello, World!' };
        //return React.createElement(
        //    HelloWorld, props
        //);
    }
    //used to render the DetailsListBasicExample Componant

    private renderControl(context: ComponentFramework.Context<IInputs>) {

        let data: any = context;
        
        //ReactDOM.render(React.createElement(FluentUIDetailsListControl, data, {}), this.container);
        //React.createElement(FluentUIDetailsListControl, data, {})
        // React.createElement(FluentUIDetailsListControl, data, {})

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
