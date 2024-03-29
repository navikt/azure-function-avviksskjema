import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios, { AxiosError } from "axios";

const getToken = async function () {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', process.env.TOKEN_CLIENT_ID);
    params.append('client_secret', process.env.TOKEN_CLIENT_SECRET);
    params.append('username', process.env.TOKEN_USERNAME);
    params.append('password', process.env.TOKEN_PASSWORD);
    const response = await axios.post(
        process.env.TOKEN_URL, params,
        {
            headers: {
                'X-PrettyPrint': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        },
    );
    return response.data['access_token'];
}

const getRequestURI = function (mode: string) {
    let uri = process.env.API_BASE_URL;
    switch (mode) {
        case 'post':
            uri += 'Avviksskjema/'
        case 'get':
            uri += 'avvik/getCase'
        default:
            break;
    }

    return uri;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const mode = req.query.mode
    try {
        // Get token
        const access_token = await getToken();

        try {
            // Check if post body is valid JSON
            const data = JSON.parse(req.rawBody);

            try {
                // Send form with attached token
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                };
                const url = getRequestURI(mode);
                if (url !== "") {
                    const result = await axios.post(url, data, { headers });
                    context.res = {
                        status: result.status,
                        body: result.data,
                    };
                } else {
                    context.res = {
                        status: 400,
                        body: "Missing or invalid parameter: 'mode'"
                    };
                }

            } catch (error) {
                // Try to return error as is from Salesforce (response statuses for errors seem to always be 500)
                const body = error.isAxiosError ? (error as AxiosError).response.data : 'Internal server error.';
                context.log(body.toString());
                context.res = {
                    status: error.isAxiosError ? (error as AxiosError).response.status : 500,
                    body
                };
            }

        } catch {
            context.res = {
                status: 400,
                body: 'Request body is not valid JSON'
            };
        }

    } catch {
        context.res = {
            status: 500,
            body: 'Could not get a valid token'
        };
    }
};

export default httpTrigger;