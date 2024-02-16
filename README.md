# pdf2image

This repository contains a simple containerized API to convert PDF documents to images
using [Imagemagick](https://imagemagick.org/index.php).

BNy default the container listens on port 3000. The port is configurable using the `PORT` environment variable.

You can test the API by calling `/demo` which displays a simple form to upload a PDF file and convert it to images.


## Usage

All requests must by send in POST to the `/convert` endpoint with a `multipart/form-data` content type. The request must contain a file with the key `file` and the value the PDF file to convert.

Supported POST parameters:
* `format`: The format of the output images. Default is jpg.
* `density`: The density of the output images. Default is 300.
* `height`: The height of the output images. Default is 1000.
* `width`: The width of the output images. Default is 1000.
* `background`: The background color of the output images. Default is white.
* `quality`: The quality of the output images in percentage. Default is 80.
* `page`: The page to convert starting at 0. Default is 0.
