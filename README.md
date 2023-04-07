# FetchXmlDetailsList
Open VS Code to this folder.
Open Terminal.

To install dependencies run:
	npm install

To build and deploy using PAC PCF PUSH run
	buildAndDeploy.ps1

This will build and put in temporary solution to get to a DEV environment.


The grid has input parameters which must be set.
FetchXML is the full FetchXml with the placeholder for the Record Id in place.

RecordIdPlaceholder is the placeholder.  
I.e. [RECORDID]

RecordId is read from the parent at the moment as it's not super easy to get this.

ColumnLayoutJson is a collection of columns used for the table layout.

// [NOT SUPPORTED CURRENTLY] ItemsPerPage is how many items to show per page.  For now this is set at 5000 since paging and sorting seem to be at odds with eachother.

SETUP NOTE:
Both the new and legacy designers will not allow you to paste in text long enough to be useful so you have to use a workaround.
https://powerusers.microsoft.com/t5/Power-Apps-Pro-Dev-ISV/Problem-with-maximum-length-of-Input-parameters-which-are-of/td-p/288295

Essentially you need to use the legacy designer and hack the input box via F11 dev tools set the maxlength to something like 9999 instead of the default 2000 if your text doesn't fit.

-----
Issues:
There seems to be an issue with the dynamics-web-api 3rd party library.  This gives a strange crypto error.  I was able to fix it by hacking the webpackConfig for pcf-scripts to tell it to ignore it.
https://github.com/donschia/FetchXmlDetailsList/blob/master/node_modules/pcf-scripts/webpackConfig.js#L61

Change this:
 resolve: {
            // Tell webpack which extensions to try when it is looking for a file.
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },

to this:
 resolve: {
            // Tell webpack which extensions to try when it is looking for a file.
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            fallback: {
				"crypto": false
			},
        },


------------
Errors:
If you get this runtime error you may need to use a _Formatted field.  For example, here it seems to be having a hard time with the date. 

Objects are not valid as a React child (found: Wed Dec 31 9000 00:00:00 GMT-0600 (Central Standard Time)). If you meant to render a collection of children, use an array instead.
