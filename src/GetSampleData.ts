import * as sampleResponsedata from './data/KS_Data_XrmWebApi_Formatting.json';
//KS_Data_DynamicsXrmApi.Formatting.json';
import * as sampleResponseColumnLayout from './data/columnLayout copy.json';


export function GetSampleData() {
    // For WebApi resposne with value node
    return { dataItems : sampleResponsedata.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };

    // For dynamics-web-api response without value node
    // return { dataItems : sampleResponsedata,  columns : sampleResponseColumnLayout,  primaryEntityName : 'account' };
  }