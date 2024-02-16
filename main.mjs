/*
 * Copyright (c) 2024 Code Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Visit <https://www.codeinc.co> for more information
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

app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file.filename) {
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
            + `pdf:${pdfPath}[${+(req.body.page ?? 0)}] `
            + `${req.body.format ?? 'webp'}:${imagePath}`);

        // sending the images as a response
        // await res.download(imagePath);
        res.sendFile(imagePath, {root: path.resolve()}, (err) => {
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

app.get('/demo', async (req, res) => {
    res.sendFile('assets/demo-form.html', {root: path.resolve()});
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
