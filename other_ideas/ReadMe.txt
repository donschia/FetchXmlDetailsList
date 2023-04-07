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

This would not compile with the dynamics-
since it uses > 5 webpack.
giving an error 
ERROR in ./node_modules/dynamics-web-api/lib/utilities/Utility.js 2:14-31
Module not found: Error: Can't resolve 'crypto' in 'C:\Projects\react\FetchXmlDetailsList\node_modules\dynamics-web-api\lib\utilities'

So edited this file... and added fallback: { "crypto": false },
C:\Projects\react\FetchXmlDetailsList\node_modules\pcf-scripts\webpackConfig.js

BEFORE:
resolve: {
            // Tell webpack which extensions to try when it is looking for a file.
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },

AFTER:
resolve: {
            // Tell webpack which extensions to try when it is looking for a file.
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            fallback: {
				"crypto": false
			},
        },
And added 
