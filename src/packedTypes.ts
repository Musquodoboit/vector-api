import {
    VectorGroup,
    VectorPage,
    VectorPath,
    VectorPathStep,
    VectorPoint,
    VectorResult,
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
    // startingPoint
    PackedVectorPoint,
    // closed
    boolean,
    // steps
    PackedVectorPathStep[],
];

/**
 * The base type for all vector path steps.
 */
export type PackedVectorPathStep = [
    // endPoint
    PackedVectorPoint,
    // controlPoint1
    PackedVectorPoint | undefined,
    // controlPoint2
    PackedVectorPoint | undefined,
];

function unpackPathStep(packedPathStep: PackedVectorPathStep): VectorPathStep {
    if (packedPathStep[1] && packedPathStep[2]) {
        return {
            isBezier: true,
            endPoint: unpackPoint(packedPathStep[0]),
            controlPoint1: unpackPoint(packedPathStep[1]),
            controlPoint2: unpackPoint(packedPathStep[2]),
        };
    } else {
        return {
            isBezier: false,
            endPoint: unpackPoint(packedPathStep[0]),
        };
    }
}

function unpackPath(packedPath: PackedVectorPath): VectorPath {
    return {
        startingPoint: unpackPoint(packedPath[0]),
        closed: packedPath[1],
        steps: packedPath[2].map(unpackPathStep),
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
