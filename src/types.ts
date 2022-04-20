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
 * Holds a single path drawn in a PDF.
 */
export interface VectorPath {

    /**
     * Indicates whether this path forms a closed shape.
     *
     * If this is true, then the first and last points in the path should be
     * identical.
     */
    closed: boolean;

    /**
     * The starting point of this path.
     */
    startingPoint: VectorPoint;

    /**
     * The steps of this path.
     */
    steps: VectorPathStep[];

}


/**
 * The base type for all vector path steps.
 */
 export interface VectorPathStepBase {

    /**
     * The end point of this step.
     */
     endPoint: VectorPoint;

}


/**
 * Holds a single straight line step along a vector path in a PDF.
 */
export interface VectorPathStepSimple extends VectorPathStepBase {

    /**
     * Indicates that this step is not a bezier curve.
     */
     isBezier: false;

}


/**
 * Holds a single bezier curve step along a vector path in a PDF.
 */
export interface VectorPathStepBezier extends VectorPathStepBase {

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
 * Holds a single step along a vector path in a PDF.
 */
export type VectorPathStep = VectorPathStepSimple | VectorPathStepBezier;


export interface VectorStatus {

    ready: boolean;

    progress: string;

}
