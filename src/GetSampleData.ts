/*
import fs from 'fs'
declare module "*.json" {
  const value: any;
  export default value;
}
*/


//import {default as yourPreferredName} from '../data/fetchXML.Response.json';
//import {IColumn } from '@fluentui/react';

import * as sampleResponsedata from './data/KS_Data.json';
import * as sampleResponseColumnLayout from './data/columnLayout.json';


export function GetSampleData() {
    //return require('../data/fetchXML.Response.json')
    //const sampleResponsedata = require("../data/fetchXML.Response.json");

    return { dataItems : sampleResponsedata.value, columns : sampleResponseColumnLayout, rootEntityIdField : 'accountid'};
    //var dataArray = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
  }