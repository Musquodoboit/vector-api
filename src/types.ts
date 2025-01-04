/**
 * Holds all of the vector results from processing a PDF.
 */
export interface VectorResult {
    /**
     * The original filename of the PDF.
     */
    fileName: string;

    /**
     * The data extracted from each page of the PDF.
     */
    pages: VectorPage[];
}

/**
 * Holds the vector data extracted from a single PDF page.
 */
export interface VectorPage {
    /**
     * All of the vector groups on this page.
     */
    groups: VectorGroup[];
}

/**
 * Holds a group of vector data collected from a PDF page.
 */
export interface VectorGroup {
    /**
     * The color of the fills in this group, if any.
     */
    fillColor?: string;

    /**
     * The line width of lines in this group.
     */
    lineWidth: number;

    /**
     * The PDF layer where this group was found, if any.
     */
    pdfLayerName?: string;

    /**
     * All of the paths in this group.
     */
    paths: VectorPath[];

    /**
     * All of the points in this group.
     */
    points: VectorPoint[];

    /**
     * The color of the strokes in this group, if any.
     */
    strokeColor?: string;
}

/**
 * Holds a single point in a PDF.
 */
export interface VectorPoint {
    /**
     * The X coordinate of this point.
     */
    x: number;

    /**
     * The Y coordinate of this point.
     */
    y: number;
}

/**
 * Holds a single path drawn with possibly multiple curves in a PDF.
 */
export interface VectorPath {
    /**
     * The curves within this path.
     */
    curves: VectorCurve[];
}

/**
 * Holds a single curve drawn in a PDF.
 */
export interface VectorCurve {
    /**
     * Indicates whether this curve forms a closed shape.
     *
     * If this is true, then the first and last points in the curve should be
     * identical.
     */
    closed: boolean;

    /**
     * The starting point of this curve.
     */
    startingPoint: VectorPoint;

    /**
     * The steps of this curve.
     */
    steps: VectorCurveStep[];
}

/**
 * The base type for all vector curve steps.
 */
export interface VectorCurveStepBase {
    /**
     * The end point of this step.
     */
    endPoint: VectorPoint;
}

/**
 * Holds a single straight line step along a vector curve in a PDF.
 */
export interface VectorCurveStepSimple extends VectorCurveStepBase {
    /**
     * Indicates that this step is not a bezier curve.
     */
    isBezier: false;
}

/**
 * Holds a single bezier curve step along a vector curve in a PDF.
 */
export interface VectorCurveStepBezier extends VectorCurveStepBase {
    /**
     * The first control point of the Bezier curve to the end point.
     */
    controlPoint1: VectorPoint;

    /**
     * The second control point of the Bezier curve to the end point.
     */
    controlPoint2: VectorPoint;

    /**
     * Indicates that this step is a bezier curve.
     */
    isBezier: true;
}

/**
 * Holds a single step along a vector curve in a PDF.
 */
export type VectorCurveStep = VectorCurveStepSimple | VectorCurveStepBezier;

/**
 * Holds the result of a status check.
 */
export interface VectorStatus {
    /**
     * A user-friendly progress message about the vector processing.
     */
    progress: string;

    /**
     * Indicates whether the vector data has been processed and is ready to be retrieved.
     */
    ready: boolean;
}
