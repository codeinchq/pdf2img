/*
 * Copyright (c) 2024 Code Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Visit <https://www.codeinc.co> for more information
 */

import express from 'express';
import multer from 'multer';
import convertPdf2image from "./src/convertPdf2image.js";
import uniqid from 'uniqid';
import * as path from "path";
import * as fs from "fs";

const port = +(process.env.PORT ?? 3000);
const tempDir = 'temp';

const app = express();
const upload = multer({dest: tempDir});

app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file.filename) {
        throw new Error('Missing required parameter: file');
    }

    const format = req.body.format ?? 'webp';
    const pdfPath = `${tempDir}/${req.file.filename}`;
    const imagePath = `${tempDir}/${uniqid()}.${format}`;

    // converting the PDF file to images
    await convertPdf2image(pdfPath, imagePath, {
        format,
        density: req.body.density,
        background: req.body.background,
        width: req.body.width,
        height: req.body.height,
        quality: req.body.quality,
        page: req.body.page,
    });

    // sending the images as a response
    // await res.download(imagePath);
    res.sendFile(imagePath, {root: path.resolve()}, () => {
        // cleaning up
        fs.unlinkSync(pdfPath);
        fs.unlinkSync(imagePath);
    });
});

app.get('/demo', async (req, res) => {
    res.sendFile('assets/demo-form.html', {root: path.resolve()});
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
