//import * as sampleResponseData from './data/sample.Contracts.Response.webapi.json';
//import * as sampleResponseColumnLayout from './data/sample.Contracts.columnLayout.webapi.json';
import * as sampleResponseData from './data/sample.Connections.Response.webapi.json';
import * as sampleResponseColumnLayout from './data/sample.Connections.columnLayout.webapi.json';

export function GetSampleData() {
    // For WebApi response with value node
    // return { dataItems : sampleResponseData.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };
    return { dataItems : sampleResponseData.value, columns : sampleResponseColumnLayout, primaryEntityName : 'connection' };

    // For dynamics-web-api response without value node
    // return { dataItems : sampleResponseData,  columns : sampleResponseColumnLayout,  primaryEntityName : 'account' };

  }