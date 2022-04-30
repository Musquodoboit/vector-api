# Node.js library to access APIs for vector processing of PDFs

This library connects to the construction.ai APIs for vector processing.

## Requirements

To use this API, you must have an API key from construction.ai.

## Usage

Typically, you will upload a PDF to the service, wait for it to be ready and
then download the resulting vector data. The three functions to do this are
`uploadPdf`, `getStatus` and `getData`, respectively. These functions each
require an API key and return a promise.

### Functions

-   `uploadPdf(settings: ApiSettings, pdfPath: string): Promise<string>`:
    Uploads a PDF and returns a promise that will result in a token that can be
    used to determine the status of the processing of the file and to download
    the results once the processing is completed.
    -   `settings`: the API settings used to connect to the construction.ai
        endpoint.
    -   `pdfPath` the path to the PDF file to upload.
-   `getStatus(settings: ApiSettings, token: string): Promise<VectorStatus>`:
    Checks on the processing status of the upload identified by the given token.
    -   `settings`: the API settings used to connect to the construction.ai
        endpoint.
    -   `token`: a token returned by `uploadPdf` that identifies a single
        upload.
-   `getData(settings: ApiSettings, token: string): Promise<VectorResult>`:
    Attempts to download the results for the upload identified by the given
    token.
    -   `settings`: the API settings used to connect to the construction.ai
        endpoint.
    -   `token`: a token returned by `uploadPdf` that identifies a single
        upload.

### Types

-   `ApiSettings`: Describes how the API should connect with an endpoint.
    -   `apiKey`: the API key to use to authenticate.
    -   The remainder of the settings exist for internal use.
-   `VectorStatus`: Holds the result of a status check.
    -   `progress`: user-friendly progress message about the vector processing.
    -   `ready`: indicates whether the vector data has been processed and is
        ready to be retrieved.
-   `VectorResult`: Holds all of the vector results from processing a PDF.
    Details for this type and the nested types can be seen [in
    `types.ts`](./src/types.ts).

### Examples

A simple example program in TypeScript and plain JavaScript can be seen in [the
examples directory](./examples/).

## License

This library is released under the ISC License.
