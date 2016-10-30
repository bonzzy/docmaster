**Installation**

`npm install docmaster -g`



**Usage**

_Steps to create documentation with Postman and docmaster_
_1) Prepare collection in Postman_
_2) Save success and error responses for every request in Postman collection_
_3) Save Postman collection_
_4) Use docmaster package to create Apidoc documentation_

Exporting Postman collection to Apidoc format
`docmaster -i postmanDump.json -o ./exportFolder` 
`apidoc -i ./exportFolder/collectionName -o ./documentation`

Exporting Postman collection to Apidoc format & creating Apidoc documentation 
`docmaster -i postmanDump.json -o ./exportFolder -apidocCollection myApi -apidocOutput localhost/apidocDocumentationFolder`



**Description**

Docmaster exports Postman collection to Apidoc format ( [Apidoc npm package](https://www.npmjs.com/package/apidoc) ).



