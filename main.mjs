/*
 * Copyright (c) 2025 Joan Fabrégat <j@fabreg.at>
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, subject to the conditions in the full MIT License.
 * The Software is provided "as is", without warranty of any kind.
 */

import express from 'express';
import multer from 'multer';
import uniqid from 'uniqid';
import * as path from "path";
import * as fs from "fs";
import {execSync} from "child_process";

const PORT = +(process.env.PORT ?? 3000);
const VERSION = process.env.VERSION ?? null;
const BUILD_ID = process.env.BUILD_ID ?? null;
const COMMIT_SHA = process.env.COMMIT_SHA ?? null;
const TEMP_DIR = 'temp';
const UP_SINCE = new Date().toISOString();

const app = express();
const upload = multer({dest: TEMP_DIR});


/**
 * Version endpoint
 */
app.get('/', (req, res) => {
    res.json({
        upSince: UP_SINCE,
        version: VERSION,
        buildId: BUILD_ID,
        commitSha: COMMIT_SHA,
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
    const pdfPath = `${TEMP_DIR}/${req.file.filename}`;
    const imagePath = `${TEMP_DIR}/${uniqid()}.${format}`;

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

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});
