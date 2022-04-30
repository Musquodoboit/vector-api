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

-   `uploadPdf(apiKey: string, pdfPath: string): Promise<string>`: Uploads a PDF
    and returns a promise that will result in a token that can be used to
    determine the status of the processing of the file and to download the results
    once the processing is completed.
    -   `apiKey`: the API key to pass to the construction.ai endpoint.
    -   `pdfPath` the path to the PDF file to upload.
-   `getStatus(apiKey: string, token: string): Promise<VectorStatus>`: Checks on
    the processing status of the upload identified by the given token.
    -   `apiKey`: the API key to pass to the construction.ai endpoint.
    -   `token`: a token returned by `uploadPdf` that identifies a single upload.
-   `getData(apiKey: string, token: string): Promise<VectorResult>`: Attempts to
    download the results for the upload identified by the given token.
    -   `apiKey`: the API key to pass to the construction.ai endpoint.
    -   `token`: a token returned by `uploadPdf` that identifies a single upload.

A simple example program in TypeScript and plain JavaScript can be seen in [the
examples](./examples/).

## License

This library is released under the ISC License.
