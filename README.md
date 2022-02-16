# Azure-function-avviksskjema

## This Azure function does the following

1. Accepts a POST request containing a form submission
2. Gets an authentication token from Salesforce
3. POSTs the form submission to Salesforce with the attached authentication token

## Requirements

You will need to supply environment variables in a file called `local.settings.json` in the project root. Copy this and fill in the blanks:

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "TOKEN_CLIENT_ID": "___CLIEND_ID_HERE___",
    "TOKEN_CLIENT_SECRET": "__CLIENT_SECRET_HERE__",
    "TOKEN_USERNAME": "__SALESFORCE_USERNAME_HERE__",
    "TOKEN_PASSWORD": "__SALESFORCE_PASSWORD_HERE__",
    "TOKEN_URL": "__TOKEN_ENDPOINT_URL_HERE__",
    "FORM_URL": "__FORM_SUBMISSION_ENDPOINT_HERE__"
  }
}
```
