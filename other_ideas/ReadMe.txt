This is an attempt to build a generic datagrid that be loaded via FetchXML.

Requires several inputs.
1. FetchXML with Placeholder [TODO]
2. PlaceholderId [TODO]
3. Column Layout json
This is essentially a few of the fields from IColumn.
key is a unique identifier. 
fieldName is the schema name complete with any alias from any linked entities
name is the display name.
minWidth allows for sizing of the columns.

[
    {
     "key": "banneraccount.onegas_bannerstatus",
     "fieldName": "banneraccount.onegas_bannerstatus_formatted",
     "name": "Banr Acct Status",
     "minWidth": 50
     },
     ...
]

Inputs are hardcoded while we work out grid rendering issues.