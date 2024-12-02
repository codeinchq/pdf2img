/*
 * Copyright 2024 Code Inc. <https://www.codeinc.co>
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import express from 'express';
import multer from 'multer';
import uniqid from 'uniqid';
import * as path from "path";
import * as fs from "fs";
import {execSync} from "child_process";

const port = +(process.env.PORT ?? 3000);
const tempDir = 'temp';

const app = express();
const upload = multer({dest: tempDir});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: "up",
        timestamp: new Date().toISOString()
    });
});

/**
 * Convert a PDF file to an image
 */
app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file?.filename) {
        res.status(400);
        res.send({error: 'No file uploaded'});
        return;
    }

    const format = req.body.format ?? 'webp';
    const pdfPath = `${tempDir}/${req.file.filename}`;
    const imagePath = `${tempDir}/${uniqid()}.${format}`;

    // converting the PDF file to images
    console.log(`Converting PDF ${req.file.originalname} to ${format}`);
    try {
        execSync(`convert `
            + `-density ${+(req.body.density ?? 300)} `
            + `-background '${req.body.background ?? 'white'}' `
            + `-flatten `
            + `-resize ${+(req.body.width ?? 800)}x${+(req.body.height ?? 600)} `
            + `-quality ${+(req.body.quality ?? 80)}% `
            + `pdf:${pdfPath}[${(+(req.body.page ?? 1) - 1)}] `
            + `${req.body.format ?? 'webp'}:${imagePath}`);

        // sending the images as a response
        // await res.download(imagePath);
        res.sendFile(imagePath, {root: path.resolve()}, () => {
            // cleaning up
            fs.unlinkSync(pdfPath);
            fs.unlinkSync(imagePath);
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(400);
        res.send({error: e.message});
        fs.unlinkSync(pdfPath);
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
