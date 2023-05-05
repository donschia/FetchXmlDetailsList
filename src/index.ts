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
    private _isDebugMode: boolean;
    private _baseD365Url?: string;
    

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
        state: ComponentFramework.Dictionary, 
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;      
        this.initVars(context, notifyOutputChanged, container);
    }

    private initVars(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._isDebugMode = false;
        // Someday this will be configurable via input parameter, defaults to 5000
        this._itemsPerPage = 5000;
        
        if (this._context.parameters.DebugMode) {
            this._isDebugMode = this._context.parameters.DebugMode.raw == "1";
        }
        if (this._isDebugMode) { 
            debugger;  // eslint-disable-line no-debugger
        }
        if (this._context.parameters.ItemsPerPage) {
            this._itemsPerPage = this._context.parameters.ItemsPerPage.raw;
        }
        
        // TODO: Validate the input parameters to make sure we get a friendly error instead of wierd errors
        var fetchXML : string | null = this._context.parameters.FetchXML.raw; // ?? this.DEFAULT_FETCHXML;
        var recordIdPlaceholder : string | null = this._context.parameters.RecordIdPlaceholder.raw; // ?? "";  

        //let recordIdParameter = this._context.parameters.RecordId;
        var controlAnchorField : string | null = this._context.parameters.ControlAnchorField.raw;
        // const recordIdLookupValue: ComponentFramework.EntityReference = this._context.parameters.RecordId.raw[0];
       
        // TODO: We need a supported generic way to get the current record Id for PETESSAKE
        // let sampleRec =  "e1b50ead-1cf0-e811-8172-e0071b6af241"; //this._context.page.entityId;

        // Other values if we need them
        let entityId = (<any>this._context.mode).contextInfo.entityId;
        let entityTypeName = (<any>this._context.mode).contextInfo.entityTypeName;
        let entityDisplayName = (<any>this._context.mode).contextInfo.entityRecordName;
        // This breaks when you use the PCF Test Harness.  Neat!
        try{
            this._baseD365Url = (<any>this._context)?.page?.getClientUrl();
        }
        catch(ex){
            this._baseD365Url = "";
        }
        var recordId : string = entityId; //this._context.parameters.RecordId.raw ?? currentRecordId;

        // See if we can use and Id from a field specified on the form
        // Wish we could use the Lookup property type
        // https://butenko.pro/2021/03/21/pcf-lookup-attribute-lets-take-look-under-the-hood/
        //  This may not work
        // TODO you are going to have to webapi fetch the id 
        // https://github.com/shivuparagi/GenericLookupPCFControl/blob/main/GenericLookupPCFComponent/components/CalloutControlComponent.tsx
        // Look at LoadData  function
        var overriddenRecordIdFieldName : string | null = this._context.parameters.OverriddenRecordIdFieldName.raw; // ?? "";
        if (overriddenRecordIdFieldName) {
            try{
                // Hack to get the field value from parent Model Driven App
                 // @ts-ignore
                let tmpLookupField = Xrm.Page.getAttribute(overriddenRecordIdFieldName);
                if (tmpLookupField && tmpLookupField.getValue() && tmpLookupField.getValue()[0] && tmpLookupField.getValue()[0].id) {
                    recordId = tmpLookupField.getValue()[0].id;
                    if (this._isDebugMode){
                        console.log(`overriddenRecordIdFieldName '${overriddenRecordIdFieldName}' value used: ${recordId}.`)
                    }
                }
                else {
                    if (this._isDebugMode){
                        console.log(`Could not find id from overriddenRecordIdFieldName '${overriddenRecordIdFieldName}'.`)
                    }
                }
                //let control = (<any>this._context)?.page.getControl(overriddenRecordIdFieldName);
                //if (control && control.id){
                //    recordId = control.id;
                //}
            }
            catch(ex){
                if (this._isDebugMode){
                    console.log(`Error trying to find id from overriddenRecordIdFieldName '${overriddenRecordIdFieldName}'. ${ex}`)
                }
            }
        }

        // Test harness always passes in "val"
        if (fetchXML != null && fetchXML != "val") {
            fetchXML =  fetchXML.replace(/"/g, "'");
            this._primaryEntityName = this.getPrimaryEntityName(fetchXML);
            // Replace the placeholder     
            this._fetchXML = this.replacePlaceholderWithId(fetchXML, recordId, recordIdPlaceholder ?? "");
        }

        // Layout provides field ordering, names, and widths
        // let fieldLayoutJson = this._context.parameters.FieldLayoutJson.raw;
        // this._fieldLayout = JSON.parse(fieldLayoutJson); //this.DEFAULT_FIELDLAYOUT);
        let columnLayoutJson = this._context.parameters.ColumnLayoutJson.raw;
        this._columnLayout = columnLayoutJson!= null && columnLayoutJson != "val"? JSON.parse(columnLayoutJson) : null;


        //this._currentPageNumber = 1;

        //var globalContext = Xrm.Utility.getGlobalContext();
        //var appUrl = globalContext.getCurrentAppUrl();

        // this blows up
        // this._container.style.overflow = "auto";
    }

    private replacePlaceholderWithId(fetchXML: string, recordId: string, recordIdPlaceholder: string) : string {
        if (recordId && recordIdPlaceholder) {
            if (fetchXML.indexOf(recordIdPlaceholder) > -1) {
                return fetchXML.replace(recordIdPlaceholder, recordId);
            }
        }
        return fetchXML;
    }

    private getPrimaryEntityName(fetchXml: string): string {
        let primaryEntityName: string = "";
        // @ts-ignore
        let filter = fetchXml.matchAll(/<entity name='(.*?)'>/g).next();
        if (filter && filter.value && filter.value[1]) {
            primaryEntityName = filter.value[1];
        }
        
        return primaryEntityName;
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // debugger;  // eslint-disable-line no-debugger
        //this.renderControl(context);
        //let dataAndLayout: any;
    
        //ReactDOM.render(React.createElement(FluentUIDetailsListControl, data, {}), this.container);
        //ata = require("../data/fetchXML.Response.json");

        let props = {  columns: this._columnLayout, primaryEntityName: this._primaryEntityName, fetchXml: this._fetchXML, isDebugMode: this._isDebugMode, context: context, baseD365Url: this._baseD365Url };
        return React.createElement(DynamicDetailsList, props, {});

        // TODO: Can we support a grid without a columnlayout?
        // ie. Just use the fields in the dataset as the layout...
        /*
        if (this._fetchXML && this._fetchXML != "" && this._columnLayout) {
            let props = {  columns: this._columnLayout, primaryEntityName: this._primaryEntityName, fetchXml: this._fetchXML, context: context }                     
            return React.createElement(DynamicDetailsList, props, {});
        }
        else{
            // Get some sample data while testing
            let sampleData = GetSampleData();
            let props = { dataItems: sampleData.dataItems, columns: sampleData.columns, primaryEntityName: sampleData.primaryEntityName, fetchXml: "", context: context }                     
            return React.createElement(DynamicDetailsList, props, {});
        }
        */

        //const props: IHelloWorldProps = { name: 'Hello, World!' };
        //return React.createElement(
        //    HelloWorld, props
        //);
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
