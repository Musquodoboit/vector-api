import {
    VectorGroup,
    VectorPage,
    VectorPath,
    VectorCurveStep,
    VectorPoint,
    VectorResult,
    VectorCurve,
} from "./types";

export interface PackedVectorResult {
    fileName: string;
    pages: PackedVectorPage[];
}

export interface PackedVectorPage {
    groups: PackedVectorGroup[];
}

export interface PackedVectorGroup {
    fillColor?: string;
    lineWidth: number;
    pdfLayerName?: string;
    paths: PackedVectorPath[];
    points: PackedVectorPoint[];
    strokeColor?: string;
}

export type PackedVectorPoint = [
    // x
    number,
    // y
    number,
];

export type PackedVectorPath = [
    // curves
    PackedVectorCurve[],
];

export type PackedVectorCurve = [
    // startingPoint
    PackedVectorPoint,
    // closed
    boolean,
    // steps
    PackedVectorCurveStep[],
];

/**
 * The base type for all vector path steps.
 */
export type PackedVectorCurveStep = [
    // endPoint
    PackedVectorPoint,
    // controlPoint1
    PackedVectorPoint | undefined,
    // controlPoint2
    PackedVectorPoint | undefined,
];

function unpackCurve(packedCurve: PackedVectorCurve): VectorCurve {
    return {
        startingPoint: unpackPoint(packedCurve[0]),
        closed: packedCurve[1],
        steps: packedCurve[2].map(unpackCurveStep),
    };
}

function unpackCurveStep(
    packedCurveStep: PackedVectorCurveStep,
): VectorCurveStep {
    if (packedCurveStep[1] && packedCurveStep[2]) {
        return {
            isBezier: true,
            endPoint: unpackPoint(packedCurveStep[0]),
            controlPoint1: unpackPoint(packedCurveStep[1]),
            controlPoint2: unpackPoint(packedCurveStep[2]),
        };
    } else {
        return {
            isBezier: false,
            endPoint: unpackPoint(packedCurveStep[0]),
        };
    }
}

function unpackPath(packedPath: PackedVectorPath): VectorPath {
    return {
        curves: packedPath[0].map(unpackCurve),
    };
}

function unpackPoint(packedPoint: PackedVectorPoint): VectorPoint {
    return {
        x: packedPoint[0],
        y: packedPoint[1],
    };
}

function unpackGroup(packedGroup: PackedVectorGroup): VectorGroup {
    return {
        ...packedGroup,
        points: packedGroup.points.map(unpackPoint),
        paths: packedGroup.paths.map(unpackPath),
    };
}

function unpackPage(packedPage: PackedVectorPage): VectorPage {
    return {
        groups: packedPage.groups.map(unpackGroup),
    };
}

export function unpackResult(packedResult: PackedVectorResult): VectorResult {
    return {
        ...packedResult,
        pages: packedResult.pages.map(unpackPage),
    };
}
