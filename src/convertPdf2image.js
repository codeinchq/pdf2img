/*
 * Copyright (c) 2024 Code Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Visit <https://www.codeinc.co> for more information
 */

import {promisify} from "util";
import {exec} from "child_process";

const execAsync = promisify(exec);

const defaultOptions = {
    format: 'webp',
    density: 300,
    width: 1000,
    height: 1000,
    background: 'white',
    quality: 80,
    page: 0,
};

/**
 * Convert a PDF file to an image using ImageMagick.
 *
 * @param pdfPath
 * @param outputPath
 * @param options
 * @return {Promise<void>}
 */
export default async function convertPdf2image(pdfPath, outputPath, options = defaultOptions) {
    options = {...defaultOptions, ...options};
    await execAsync(`convert `
        + `-density ${options.density ?? 300} `
        + `-background '${options.background ?? 'white'}' `
        + `-flatten `
        + `-resize ${options.width ?? '800'}x${options.height ?? '600'} `
        + `-quality ${options.quality ?? 80}% `
        + `pdf:${pdfPath}[${options.page ?? 0}] `
        + `${options.format ?? 'webp'}:${outputPath}`);
}

