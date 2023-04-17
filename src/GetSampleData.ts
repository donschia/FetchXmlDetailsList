import * as sampleResponsedata from './data/KS_Data_3rdparty.json';
import * as sampleResponseColumnLayout from './data/columnLayout.json';


export function GetSampleData() {
    
    // For WebApi resposne with value node
    //return { dataItems : sampleResponsedata.value, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };

    // For 3rd party response without value node
    return { dataItems : sampleResponsedata, columns : sampleResponseColumnLayout, primaryEntityName : 'account' };
  }