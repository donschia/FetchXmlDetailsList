# FetchXml DetailsList
## Description
This PCF Control generates a FluentUI DetailsList for subgrids loaded via a custom FetchXml query and column layout. This extends what is possible for the Model-Driven App subgrid.  You need to include an ID Placeholder which is replaced with the current record id. 

---
[SCREENSHOT]


## Features
- Dynamic queries can be more complex than views allow.  The query can be as complex as needed with many linked entities.  You can even include links to entities that have been removed such as Contract.
- Look and Feel is similar to out of the box Model Driven App read only subgrid.  Supports sorting and resizing of columns.
- Quick rendering.
- Double clicking the row navigates to the base record.
- Support navigating to linked entities.
- Customization options for each column include date formatting, toggleable entity linking, absolute urls, relative urls, and so on.
- Debug mode to see examine data returned from FetchXml query for building column layout.
- Uses Placeholder to filter by a record id.  This defaults to the current record.  But this can be overridden with another lookup on the current form.
  
***

## Quick Start using Pre-Built Solution
[Managed](solution\bin\Release\FetchXmlDetailsList.Solution_managed.zip) and [Unmanaged](solution\bin\Release\FetchXmlDetailsList.Solution.zip) Solutions are available to download and install in your development environment.  

After installing, you add this new PCF Control to your form via the legacy or modern designer.  Simply add a text field and bind this control to it.  Now you have to set the Input Parameters.


***
## Input Parameters (Properties)
The grid has input parameters which must be set.

- <code>FetchXml</code> is the full FetchXml with a placeholder for the Record Id in place.
  [SHOW FETCHXML EXAMPLES]

- <code>RecordIdPlaceholder</code> is the placeholder text. This will be replaced with the current record id.  
i.e. <code>[RECORDID]</code>

- The <code>RecordId</code> is read from the current record in a bit of a hack at the moment as it's not super easy to get this in the Power Apps framework.  This can also be overridden with another lookup on the current form.  Simply set the <code>OverriddenRecordIdFieldName</code> to a lookup field on the current form and this id will be used instead of the id of the current record.

- <code>ColumnLayoutJson</code> is a collection of columns used for the table layout.
- <code>ItemsPerPage</code> is currently defaulted to 5000 as paging is currently not implemented.  // [NOT SUPPORTED CURRENTLY] ItemsPerPage is how many items to show per page. For now this is set at 5000 since paging and sorting seem to be at odds with eachother.
- <code>DebugMode</code> can be set to <code>On</code> or <code>Off</code>.  When enabled, this will write extra details to console, break when entering the main control, and break on handled exceptions.

## Set Up Notes
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
|dateFormat | No | String | You can force a date into a particular format by specifying this.  This uses [date-fns format strings](https://date-fns.org/v2.29.3/docs/format) i.e. <code>yyyy-MM-dd</code> |
|entityLinking | No | Boolean | Set to <code>False</code> to prevent navigation to linked entities. Otherwise links are enabled. |
|url | No | String | Absolute URL.  Or can be relative from the <code>[BASE_ENVIRONMENT_URL]</code> path.  You can include the current record id by using the <code>[ID]</code> placeholder.|

ColumnLayoutJson Example:
```json
[
  {
    "key": "name",
    "fieldName": "name",
    "name": "Account Name",
    "minWidth": 160
  },
  {
    "key": "createdon",
    "fieldName": "createdon",
    "name": "Created On",
    "minWidth": 70,
    "data": {
      "dateFormat": "yyyy-MM-dd"
    }
  },
  {
    "key": "banneraccount.onegas_contractid",
    "fieldName": "banneraccount.onegas_contractid_Formatted",
    "name": "Contract Name(BA)",
    "minWidth": 100,
    "data": {
      "url": "[BASE_ENVIRONMENT_URL]/main.aspx?etc=1010&pagetype=entityrecord&id=[ID]"
    }
]
````

***
## Initial Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/)

2. Clone this repository

3. Navigate into the project directory in terminal.
   ```bash
   $ cd FetchXmlDetailsList
   ```
4. Install the dependencies
   ```bash
   $ npm install
   ```
5. Demo the subgrid with sample data and column layout in PCF Test Harness. Linking is disabled since this is not allowed in the tester.
   ```bash
   $ npm start  
   ```

## Build and Deploy
You can build and deploy to your currently configured DEVELOPMENT Environment using the CLI [PAC PCF PUSH](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pcf#pac-pcf-push) by running:  <code>buildAndDeploy.ps1</code>.  Note that the CLI requires connecting to your development org first. See the documentation for more details.
You will need to ensure you have installed the [Microsoft PowerApps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction#install-power-apps-cli). 
   - <code>buildAndDeploy.ps1</code> will build the component, add it to a temporary solution (PowerAppsTools_YourOrg) , import to your DEV environment and Publish All.
Prerequitiste is to make sure you can connect to your DEV environment using the CLI tools.
```bash
$ buildAndDeploy.ps1
```


# Issues
## Dynamics-Web-Api library initial set up issue
For ease of use, this control can be switched to use the dynamics-web-api library.  You can reference the field name with the _Formatted suffix.  But the default is to just use the out of the box xrm web api.

There seems to be an issue with the dynamics-web-api 3rd party library. This gives a strange crypto error. You can either use the out of the box Web Api, or you can fix it by hacking the webpackConfig.js for pcf-scripts to tell it to ignore it.

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
If you get runtime errors you may need to use a _Formatted field. For example, here it seems to be having a hard time with the date. <code>
Objects are not valid as a React child (found: Wed Dec 31 9000 00:00:00 GMT-0600 (Central Standard Time)). If you meant to render a collection of children, use an array instead.</code>
Another option if it's a date issue is to be sure to use a dateFormat in the column layout data object.

***

## TODOs:
- Make documentation better!
 
- Paging!  Paging is not implemented yet. Page size is locked at 5000 for now.
  
- Add an example FetchXml using out of the box entities instead of the current one with custom entities.  Try to include a number of entities and solve a real problem.  Could also include the Contract entity to show how you can support the deprecated/removed contract entity links to the old non-UCI interface.

- Perhaps allow styling via input parameter.  i.e. alternate row color endable/disable, etc.

- When not using the Dynamics-Web-Api 3rd party libary, don't include (require) it.  This will make the final bundle.js smaller.
  
- Export is very rudimentary.  It would be much better if the header was the actual column name instead of column fieldName.