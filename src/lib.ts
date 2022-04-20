import fs from "fs";
import http, { RequestOptions } from "http";
import msgpack from "msgpack";
import path from "path";

import { VectorResult, VectorStatus } from "./types";


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


function simpleRequest(options: RequestOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const req = http.request(
            options,
            result => {
                const body: Buffer[] = [];
                result.on("data", chunk => {
                    body.push(chunk);
                });
                result.on("end", () => {
                    const fullBody = Buffer.concat(body);
                    if (result.statusCode === 200) {
                        resolve(fullBody);
                    } else {
                        reject(new Error(`Got non-success error code ${result.statusCode} with body: ${fullBody.toString()}`));
                    }
                });
            });

        req.on("error", error => {
            reject(error);
        });

        req.end();
    });
}


function simpleUpload(filePath: string, options: RequestOptions): Promise<Buffer> {
    return simpleReadFile(filePath)
        .then(fileContents => {
            const crlf = "\r\n";
            const boundary = `--${Math.random().toString(16).substring(2)}`;
            const delimeter = `${crlf}--${boundary}`;
            const closeDelimeter = `${delimeter}--`;
            const contentDisposition = `form-data; name="file"; filename="${path.basename(filePath)}"`;
            const multipartBody = Buffer.concat([
                Buffer.from(delimeter + crlf + `Content-Disposition: ${contentDisposition}` + crlf + crlf),
                fileContents,
                Buffer.from(closeDelimeter)]
            );

            const innerOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": `multipart/form-data; boundary=${boundary}`,
                    "Content-Length": multipartBody.length
                }
            };

            return new Promise((resolve, reject) => {
                const req = http.request(
                    innerOptions,
                    result => {
                        const body: Buffer[] = [];
                        result.on("data", chunk => {
                            body.push(chunk);
                        });
                        result.on("end", () => {
                            const fullBody = Buffer.concat(body);
                            if (result.statusCode === 200) {
                                resolve(fullBody);
                            } else {
                                reject(new Error(`Got non-success error code ${result.statusCode} with body: ${fullBody.toString()}`));
                            }
                        });
                    });

                req.on("error", error => {
                    reject(error);
                });

                req.write(multipartBody);
                req.end();
            });
        });

}


export function getData(apiKey: string, token: string): Promise<VectorResult> {
    const options = {
        hostname: "localhost",
        port: 3000,
        path: `/api/vectors/results/${token}`,
        method: "GET",
        headers: {
            "X-Api-Key": apiKey
        }
    };

    return simpleRequest(options)
        .then(body => {
            return msgpack.unpack(body);
        });
}


export function getStatus(apiKey: string, token: string): Promise<VectorStatus> {
    const options = {
        hostname: "localhost",
        port: 3000,
        path: `/api/vectors/status/${token}`,
        method: "GET",
        headers: {
            "X-Api-Key": apiKey
        }
    };

    return simpleRequest(options)
        .then(body => {
            return JSON.parse(body.toString());
        });
}


export function uploadPdf(apiKey: string, pdfPath: string): Promise<string> {
    const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/vectors/upload",
        method: "POST",
        headers: {
            "X-Api-Key": apiKey
        }
    };

    return simpleUpload(pdfPath, options)
        .then(body => {
            const resultingJson = JSON.parse(body.toString());
            if (resultingJson && typeof resultingJson.token === "string") {
                return resultingJson.token;
            } else {
                throw new Error("Did not recieve token from server.");
            }
        });
}
