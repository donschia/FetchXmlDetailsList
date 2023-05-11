//import * as sampleResponsedata from './data/sample.Onegas.Response.webapi.json';
//import * as sampleResponseColumnLayout from './data/sample.Onegas.columnLayout.webapi.json';
import * as sampleResponsedata from './data/sample.Contracts.Response.webapi.json';
import * as sampleResponseColumnLayout from './data/sample.Contracts.columnLayout.webapi.json';

export function GetSampleData() {
    // For WebApi resposne with value node
    return { dataItems : sampleResponsedata.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };

    // For dynamics-web-api response without value node
    // return { dataItems : sampleResponsedata,  columns : sampleResponseColumnLayout,  primaryEntityName : 'account' };
  }