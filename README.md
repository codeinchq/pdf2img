# Pdf2Img

[![Code Inc.](https://img.shields.io/badge/Code%20Inc.-Document%20Cloud-blue)](https://www.codeinc.co)
[![Docker Image CI](https://github.com/codeinchq/pdf2img/actions/workflows/docker-image.yml/badge.svg)](https://github.com/codeinchq/pdf2img/actions/workflows/docker-image.yml)
[![Docker Image Version](https://img.shields.io/docker/v/codeinchq/pdf2img?sort=semver&label=Docker%20Hub&color=red)](https://hub.docker.com/r/codeinchq/pdf2img/tags)

This repository contains a simple containerized API to convert PDF documents to images
using [Imagemagick](https://imagemagick.org/).

The image is available on [Docker Hub](https://hub.docker.com/r/codeinchq/pdf2img) under the name `codeinchq/pdf2img`.

## Configuration

By default, the container listens on port 3000. The port is configurable using the `PORT` environment variable.

## Usage

All requests must by send in POST to the `/convert` endpoint with a `multipart/form-data` content type. The request must contain a PDF file with the key `file`. Additional parameters can be sent to customize the conversion process:
* `format`: The format of the output images. Default is jpg.
* `density`: The density of the output images. Default is 300.
* `height`: The height of the output images. Default is 1000.
* `width`: The width of the output images. Default is 1000.
* `background`: The background color of the output images. Default is white.
* `quality`: The quality of the output images in percentage. Default is 80.
* `page`: The page to convert starting at 1. Default is 1.

The server returns `200` if the conversion was successful and the images are available in the response body. In case of error, the server returns a `400` status code with a JSON object containing the error message (format: `{error: string}`).

### Example

#### Step 1: run the container using Docker
```bash
docker run -p "3000:3000" codeinchq/pdf2img 
```

#### Step 2: convert a PDF file to images
First page conversion to the default format (WebP)
```bash
curl -X POST -F "file=@/path/to/file.pdf" http://localhost:3000/convert -o example.webp
```
Conversion with custom params (page 2 to JPEG with an orange background):
```bash
curl -X POST -F "file=@/path/to/file.pdf" -F "page=2" -F "format=jpg" -F "background=#F60" http://localhost:3000/convert -o example.jpg
```

### Health check

A health check is available at the `/health` endpoint. The server returns a status code of `200` if the service is healthy, along with a JSON object:
```json
{ "status": "up" }
```

## Client

A PHP 8 client is available at on [GitHub](https://github.com/codeinchq/document-cloud-php-client) and [Packagist](https://packagist.org/packages/codeinc/document-cloud-client).


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/codeinchq/pdf2img?tab=MIT-1-ov-file) file for details.
