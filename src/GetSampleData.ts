import * as sampleResponseData from './data/sample.Contracts.Response.webapi.json';
import * as sampleResponseColumnLayout from './data/sample.Contracts.columnLayout.webapi.json';

export function GetSampleData() {
    // For WebApi response with value node
    return { dataItems : sampleResponseData.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };

    // For dynamics-web-api response without value node
    // return { dataItems : sampleResponseData,  columns : sampleResponseColumnLayout,  primaryEntityName : 'account' };

  }