import * as sampleResponsedata from './data/sample_Response.webapi.json';
//KS_Data_DynamicsXrmApi.Formatting.json';
import * as sampleResponseColumnLayout from './data/sample_columnLayout.webapi.json';


export function GetSampleData() {
    // For WebApi resposne with value node
    return { dataItems : sampleResponsedata.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };

    // For dynamics-web-api response without value node
    // return { dataItems : sampleResponsedata,  columns : sampleResponseColumnLayout,  primaryEntityName : 'account' };
  }