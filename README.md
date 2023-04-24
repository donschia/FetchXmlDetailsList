# FetchXml DetailsList
## Description
PCF Control for showing subgrids from FetchXml queries.  The query can be a complex as needed with many linked entities.  This will allow getting around the limits of most Model Driven App views.  You will include an ID Placeholder to replace with the current record id.
[SCREENSHOT]

Also you need to provide a columnLayout json to define all column details. 
## Features
- Dynamic queries can be more complex than views allow.  
- Uses Placeholder to filter by current record id.
- Look and Feel is similar to out of the box Model Driven App read only subgrid.  Supports sorting and resizing of columns.
- Quick rendering.
- Double clicking the row navigates to the base record.
- Support navigating to linked entities.
- Customization options for each column include date formatting, toggleable entity linking, absolute urls, relative urls, and so on.
- Debug mode to see examine data returned from FetchXml query for building column layout.
  
***
## Initial Setup
1. Open VS Code to this folder.
2. Open Terminal (Control + Shift + ~)
3. Run <code>npm install</code>
   
## Build and Deploy
Simply run <code> npm start</code> to launch the FetchXmlDetailsList in the PCF Test Harness.  This loads sample data along with a sample columnLayout.  Linking is disabled since this is not allowed in the tester.

You can build and deploy to your currently configured DEVELOPMENT Environment using the CLI [PAC PCF PUSH](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pcf#pac-pcf-push) by running:  <code>buildAndDeploy.ps1</code>.  Note that the CLI requires connecting to your development org first. See the documentation for more details.
You will need to ensure you have installed the [Microsoft PowerApps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction#install-power-apps-cli). 
   - <code>buildAndDeploy.ps1</code> will build the component, add it to a temporary solution (PowerAppsTools_YourOrg) , import to your DEV environment and Publish All.
Prerequitiste is to make sure you can connect to your DEV environment using the CLI tools.

## Input Parameters (Properties)
The grid has input parameters which must be set.

- <code>FetchXml</code> is the full FetchXml with a placeholder for the Record Id in place.

- <code>RecordIdPlaceholder</code> is the placeholder text. This will be replaced with the current record id.  
i.e. <code>[RECORDID]</code>

- The <code>RecordId</code> is read from the parent in a bit of a hack at the moment as it's not super easy to get this in the Power Apps framework.

- <code>ColumnLayoutJson</code> is a collection of columns used for the table layout.
- <code>ItemsPerPage</code> is current defaulted to 5000 as paging is currently not implemented.  // [NOT SUPPORTED CURRENTLY] ItemsPerPage is how many items to show per page. For now this is set at 5000 since paging and sorting seem to be at odds with eachother.
- <code>DebugMode</code> can be set to <code>On</code> or <code>Off</code>.  When enabled, this will write extra details to console, break when entering the main control, and break on handled exceptions.

## Set Up Note
Both the new and legacy designers will likely not allow you to paste in text long enough to be useful so you have to use a [workaround to extend the field length](https://powerusers.microsoft.com/t5/Power-Apps-Pro-Dev-ISV/Problem-with-maximum-length-of-Input-parameters-which-are-of/td-p/288295).

Essentially you use the legacy designer and hack the input box via F11 dev tools to set the maxlength to something like 9999 instead of the default 2000 if your text doesn't fit.

## ColumnLayoutJson
This is a list of [IColumn](https://learn.microsoft.com/en-us/javascript/api/sp-listview-extensibility/icolumn?view=sp-typescript-latest) from the [FluentUI DetailsList]( https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist).  Simply include all of the required fields for each column your data grid.  The options <code>data</code> object can be helpful for extra customization.


| Field Name | Required | Type | Description |
| --- | --- | -- | -- |
| key | Yes | String |  Unique key for data item |
| fieldName | Yes |  String |  Column Label |
| name | Yes |  String |  Field name matched from the returned Xrm Data |
| minWidth | Yes |  Number |  Minimum field width (ie. 50) |
| data | No | Object| Data Object with special stuff.  See defination below. |

### data Object
| Field Name | Required | Type | Description |
| --- | --- | -- | -- |
|dateFormat | No | String | You can force a date into a particular format by specifying this.  This uses [date-fns placeholders](https://date-fns.org/v2.29.3/docs/format) i.e. "yyyy-MM-dd" |
|entityLinking | No | Boolean | Set to False to prevent linkign to linked entities. Otherwise links are enabled. |
|url | No | String | Absolute URL.  Or can be relative from the [BASED365URL] path. |

Sample:
<code>
"key": "banneraccount.onegas_contractid",
    "fieldName": "banneraccount.onegas_contractid_Formatted",
    "name": "Contract Name(BA)",
    "minWidth": 100,
    "data": {
      "url": "[BASED365URL]/main.aspx?etc=1010&pagetype=entityrecord&id=[ID]"
    }
</code>

# Issues
There seems to be an issue with the dynamics-web-api 3rd party library. This gives a strange crypto error. I was able to fix it by hacking the webpackConfig for pcf-scripts to tell it to ignore it.
../FetchXmlDetailsList/blob/master/node_modules/pcf-scripts/webpackConfig.js#L61

Change this:
```javascript
resolve: {
        // Tell webpack which extensions to try when it is looking for a file.
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
},

```

to this:
```javascript
resolve: {
        // Tell webpack which extensions to try when it is looking for a file.
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: { "crypto": false },
},
```
---

## Errors
If you get this following runtime error you may need to use a \_Formatted field. For example, here it seems to be having a hard time with the date.
Objects are not valid as a React child (found: Wed Dec 31 9000 00:00:00 GMT-0600 (Central Standard Time)). If you meant to render a collection of children, use an array instead.
Another option to format the output.

***

## TODOs:
No paging support currently. Page size is locked at 5000 for now.
