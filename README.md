# PDF to Image Converter API

[![Docker Image CI](https://github.com/codeinchq/pdf2img/actions/workflows/docker-image.yml/badge.svg)](https://github.com/codeinchq/pdf2img/actions/workflows/docker-image.yml)
[![Docker Image Version](https://img.shields.io/docker/v/joanfabregat/pdf2img?sort=semver&label=Docker%20Hub&color=red)](https://hub.docker.com/r/joanfabregat/pdf2img/tags)

A lightweight Express.js service that converts PDF files to various image formats base
on [ImageMagick](https://imagemagick.org/).

## Features

- Convert PDF files to images (webp, jpg, png, etc.)
- Configure conversion parameters (density, quality, dimensions, etc.)
- Simple REST API interface

## Requirements

- Node.js (v14 or higher recommended)
- ImageMagick (`convert` command must be available in your PATH)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jfabregat/pdf-to-image.git
cd pdf-to-image
```

2. Install dependencies:

```bash
npm install
```

3. Ensure ImageMagick is installed:
    - **Linux**: `sudo apt-get install imagemagick`
    - **macOS**: `brew install imagemagick`
    - **Windows**: Download from [ImageMagick website](https://imagemagick.org/script/download.php)

## Usage

### Starting the server

```bash
npm start
```

The server will start on port 3000 by default. You can configure the port using the `PORT` environment variable.

### Environment Variables

- `PORT`: Server port (default: 3000)
- `VERSION`: Application version
- `BUILD_ID`: Build identifier
- `COMMIT_SHA`: Git commit SHA

### API Endpoints

#### GET /

Returns version and uptime information.

**Response:**

```json
{
  "upSince": "2025-03-16T10:00:00.000Z",
  "version": "1.0.0",
  "buildId": "12345",
  "commitSha": "abc123"
}
```

#### POST /convert

Converts a PDF file to an image.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body:
    - `file`: PDF file (required)
    - `format`: Output image format (default: webp)
    - `density`: DPI for conversion (default: 300)
    - `background`: Background color (default: white)
    - `width`: Output width in pixels (default: 800)
    - `height`: Output height in pixels (default: 600)
    - `quality`: Output image quality (default: 80%)
    - `page`: PDF page to convert (default: 1)

**Example:**

```bash
curl -X POST http://localhost:3000/convert \
  -F "file=@document.pdf" \
  -F "format=jpg" \
  -F "density=200" \
  -F "width=1200" \
  -F "page=2"
```

## Docker Support

A Dockerfile is provided to containerize the application:

```bash
docker build -t pdf-to-image .
docker run -p 3000:3000 pdf-to-image
```

## Security Considerations

- This service uses temporary files that are automatically cleaned up after processing
- No authentication is implemented - consider adding authentication for production use
- Verify and validate all input parameters as needed for your environment

## License

Copyright (c) 2025 Joan Fabrégat <j@fabreg.at>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, subject to the conditions in the MIT
License.

The Software is provided "as is", without warranty of any kind.