// require "@construction-ai/vector-api" if used outside of this repo
const { getData, getStatus, uploadPdf } = require("..");

function printResults(data) {
    console.log(
        `Got results for file ${data.fileName} with ${data.pages.length} pages`
    );

    let pageNum = 0;
    for (const page of data.pages) {
        const points = page.groups.reduce(
            (acc, group) => acc + group.points.length,
            0
        );
        const paths = page.groups.reduce(
            (acc, group) => acc + group.paths.length,
            0
        );
        console.log(
            `Page ${++pageNum} has ${
                page.groups.length
            } groups with ${points} points and ${paths} paths`
        );
        // console.log(`Example path:\n${JSON.stringify(page.groups[0].paths[0], undefined, 4)}`);
        // console.log("Page data", page);
    }
}

function waitAndDownload(apiKey, token) {
    function checkOnce() {
        getStatus(apiKey, token)
            .then((data) => {
                console.log("Got progress:", data.progress);
                if (data.ready) {
                    getData(apiKey, token).then((data) => {
                        printResults(data);
                    });
                } else {
                    setTimeout(checkOnce, 200);
                }
            })
            .catch((err) => console.error("Got status error:", err));
    }

    setTimeout(checkOnce, 200);
}

function main() {
    if (!process.env.API_KEY) {
        console.error(
            "Please set the 'API_KEY' environment variable to use the command line tester."
        );
        return;
    }

    if (process.argv.length < 3) {
        console.error(
            "Please give the filename to upload to use the command line tester."
        );
        return;
    }

    const apiKey = process.env.API_KEY;
    const filePath = process.argv[2];

    uploadPdf(apiKey, filePath)
        .then((token) => {
            console.log("Got token:", token);
            waitAndDownload(apiKey, token);
        })
        .catch((err) => console.error("Got upload error:", err));
}

main();
