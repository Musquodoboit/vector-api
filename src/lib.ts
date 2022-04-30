import { decompress } from "@xingrz/cppzst";
import fs from "fs";
import http from "http";
import https from "https";
import { unpack } from "msgpack";
import path from "path";

import { PackedVectorResult, unpackResult } from "./packedTypes";
import { VectorResult, VectorStatus } from "./types";

interface SimpleRequestOptions {
    useHttp: boolean;
    hostname: string;
    port?: number;
    method: string;
    path: string;
    headers: {
        [key: string]: number | string | string[];
    };
}

function simpleReadFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function simpleRequest(options: SimpleRequestOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const req = (options.useHttp ? http : https).request(
            options,
            (result) => {
                const body: Buffer[] = [];
                result.on("data", (chunk) => {
                    body.push(chunk);
                });
                result.on("end", () => {
                    const fullBody = Buffer.concat(body);
                    if (result.statusCode === 200) {
                        resolve(fullBody);
                    } else {
                        reject(
                            new Error(
                                `Got non-success error code ${
                                    result.statusCode
                                } with body: ${fullBody.toString()}`
                            )
                        );
                    }
                });
            }
        );

        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    });
}

function simpleUpload(
    filePath: string,
    options: SimpleRequestOptions
): Promise<Buffer> {
    return simpleReadFile(filePath).then((fileContents) => {
        const crlf = "\r\n";
        const boundary = `--${Math.random().toString(16).substring(2)}`;
        const delimeter = `${crlf}--${boundary}`;
        const closeDelimeter = `${delimeter}--`;
        const contentDisposition = `form-data; name="file"; filename="${path.basename(
            filePath
        )}"`;
        const multipartBody = Buffer.concat([
            Buffer.from(
                delimeter +
                    crlf +
                    `Content-Disposition: ${contentDisposition}` +
                    crlf +
                    crlf
            ),
            fileContents,
            Buffer.from(closeDelimeter),
        ]);

        const innerOptions = {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
                "Content-Length": multipartBody.length,
            },
        };

        return new Promise((resolve, reject) => {
            const req = (options.useHttp ? http : https).request(
                innerOptions,
                (result) => {
                    const body: Buffer[] = [];
                    result.on("data", (chunk) => {
                        body.push(chunk);
                    });
                    result.on("end", () => {
                        const fullBody = Buffer.concat(body);
                        if (result.statusCode === 200) {
                            resolve(fullBody);
                        } else {
                            reject(
                                new Error(
                                    `Got non-success error code ${
                                        result.statusCode
                                    } with body: ${fullBody.toString()}`
                                )
                            );
                        }
                    });
                }
            );

            req.on("error", (error) => {
                reject(error);
            });

            req.write(multipartBody);
            req.end();
        });
    });
}

/**
 * Describes how the API should connect with an endpoint.
 */
export interface ApiSettings {
    /**
     * The API key to use to authenticate with an endpoint.
     */
    apiKey: string;

    /**
     * If set, the HTTP protocol will be used.
     *
     * @default false
     */
    useHttp?: boolean;

    /**
     * If set, the hostname to connect to.
     *
     * @default "app.construction.ai"
     */
    hostname?: string;

    /**
     * If set, the port to connect to. If unset, the default port for the chosen
     * protocol will be used.
     */
    port?: number;
}

const defaultHostname = "app.construction.ai";

/**
 * Attempts to download the results for the upload identified by the given
 * token.
 *
 * @param settings the API settings used to connect to the construction.ai
 *      endpoint.
 * @param token the token that identifies the upload.
 * @returns promise that will resolve to the vector results of the upload.
 */
export function getData(
    settings: ApiSettings,
    token: string
): Promise<VectorResult> {
    const options = {
        useHttp: !!settings.useHttp,
        hostname: settings.hostname ?? defaultHostname,
        port: settings.port,
        path: `/api/vectors/results/${token}`,
        method: "GET",
        headers: {
            "X-Api-Key": settings.apiKey,
        },
    };

    return simpleRequest(options)
        .then((compressedBody) => decompress(compressedBody))
        .then((msgPackBody) => {
            const packedResult = unpack(msgPackBody) as PackedVectorResult;
            return unpackResult(packedResult);
        });
}

/**
 * Checks on the processing status of the upload identified by the given token.
 *
 * @param settings the API settings used to connect to the construction.ai
 *      endpoint.
 * @param token the token that identifies the upload.
 * @returns promise that will resolve to the status of the upload.
 */
export function getStatus(
    settings: ApiSettings,
    token: string
): Promise<VectorStatus> {
    const options = {
        useHttp: !!settings.useHttp,
        hostname: settings.hostname ?? defaultHostname,
        port: settings.port,
        path: `/api/vectors/status/${token}`,
        method: "GET",
        headers: {
            "X-Api-Key": settings.apiKey,
        },
    };

    return simpleRequest(options).then((body) => {
        return JSON.parse(body.toString());
    });
}

/**
 * Uploads a PDF and returns a promise that will result in a token that can be
 * used to determine the status of the processing of the file and to download
 * the results once the processing is completed
 *
 * @param settings the API settings used to connect to the construction.ai
 *      endpoint.
 * @param pdfPath the path to the PDF file to upload.
 * @returns promise that will resolve to a token.
 */
export function uploadPdf(
    settings: ApiSettings,
    pdfPath: string
): Promise<string> {
    const options = {
        useHttp: !!settings.useHttp,
        hostname: settings.hostname ?? defaultHostname,
        port: settings.port,
        path: "/api/vectors/upload",
        method: "POST",
        headers: {
            "X-Api-Key": settings.apiKey,
        },
    };

    return simpleUpload(pdfPath, options).then((body) => {
        const resultingJson = JSON.parse(body.toString());
        if (resultingJson && typeof resultingJson.token === "string") {
            return resultingJson.token;
        } else {
            throw new Error("Did not recieve token from server.");
        }
    });
}
