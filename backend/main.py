from io import BytesIO
from typing import Optional
import cv2
import numpy as np
import logging
from env_config import Settings
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image, ImageEnhance, ImageOps


app = FastAPI(
    title="ImageManus API",
    description="API for manipulating various things on images.",
    version="0.1.0"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("imageManusAPI")

settings = Settings()

# Define the allowed origins
origins = [
    settings.SOLID_DEV_SERVER   # Solid.js dev server
]

# Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allows requests from origins
    allow_credentials=True,         # Allow cookies or other credentials to be sent
    allow_methods=["*"],            # Allow all HTTP methods
    allow_headers=["*"],            # Allow all headers
    expose_headers=["X-Filename"],  # Expose the custom header
)


@app.post(
    "/convert",
    summary="Convert image to defined format",
    response_description="image with specified quality"
)
async def convert(
    image: UploadFile = File(...),
    quality: Optional[int] = Form(80),  # Default quality is 80
    format: str = Form(...),
):
    """
    Convert an uploaded image to request defined format with the specified quality.

    This endpoint accepts any image format (JPG, PNG, etc.) and converts it
    to the defined format in the request with the specified compression quality.

    Parameters:
    - **image**: The image file to convert
    - **quality**: Compression quality (1-100)

    Returns:
    - An image in the format defined in the request as a streaming response

    Raises:
    - 400: If quality parameter is outside the valid range (1-100)
    - 500: If there's an error during image conversion
    """

    # Validate quality parameter
    if quality < 1 or quality > 100:
        raise HTTPException(status_code=400, detail="Quality must be between 1 and 100")

    # Allowed formats
    allowed_formats = {"webp", "jpeg", "png", "bmp", "tiff"}
    if format.lower() not in allowed_formats:
        raise HTTPException(status_code=400, detail=f"Invalid format. Allowed: {', '.join(allowed_formats)}")

    try:
        contents = await image.read()
        input_img = BytesIO(contents)

        # Convert to the given format
        img = Image.open(input_img)

        output_img = BytesIO()
        img.save(output_img, format.upper(), quality=quality)

        # Reset the pointer to start
        output_img.seek(0)

        # Return the converted file
        headers = {
            "X-Filename": f"{image.filename.split('.')[0]}_converted.{format.lower()}",
            "Content-Type": f"image/{format.upper()}"
        }

        return StreamingResponse(output_img, media_type=f"image/{format.lower()}", headers=headers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")


@app.post(
    "/removebg",
    summary="Removes the background",
    response_description="PNG image with background removed."
)
async def remove_bg(image: UploadFile = File(...)):
    """
    Remove the background from an uploaded image using OpenCV's GrabCut algorithm.

    This endpoint applies automatic background removal using the GrabCut algorithm
    with an automatically generated rectangle (margin of 10% from each edge).

    The algorithm works best on images where:
    - The subject is centered in the frame
    - There's good contrast between subject and background
    - The background is relatively uniform

    Parameters:
    - **image**: The input image file

    Returns:
    - A PNG image with transparent background as a streaming response

    Raises:
    - 500: If there's an error during image processing or reading
    """

    # Read the uploaded image as bytes
    try:
        img_bytes = await image.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading the image: {str(e)}")

    # ** I used chatgpt to read and understand the libraries to use numpy,
    # OpenCV to remove the background of an image ***

    # Convert bytes to numpy array for OpenCV
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Get image dimensions
    height, width = img.shape[:2]

    # Calculate rectangle - use 10% margin from each edge
    margin_x = int(width * 0.1)
    margin_y = int(height * 0.1)

    # Create the rectangle (x, y, width, height)
    rect = (
        margin_x,                    # x - start 10% from left
        margin_y,                    # y - start 10% from top
        width - 2 * margin_x,        # width - 80% of image width
        height - 2 * margin_y        # height - 80% of image height
    )

    # Create a mask initialized to 'probable background'
    mask = np.zeros(img.shape[:2], np.uint8) + cv2.GC_PR_BGD

    # Initialize background and foreground models
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    try:
        # Apply GrabCut with default 5 iterations
        cv2.grabCut(
            img,
            mask,
            rect,
            bgdModel,
            fgdModel,
            5,
            cv2.GC_INIT_WITH_RECT
        )

        # Create mask where 0 and 2 are background, 1 and 3 are foreground
        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

        # Create alpha channel based on the mask
        alpha_channel = mask2 * 255

        # Convert BGR to BGRA (adding alpha channel)
        bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        bgra[:, :, 3] = alpha_channel

        # Convert to PIL image in RGBA format for saving with transparency
        pil_img = Image.fromarray(cv2.cvtColor(bgra, cv2.COLOR_BGRA2RGBA))

        # Convert to bytes
        output_img = BytesIO()
        pil_img.save(output_img, format='PNG')
        output_img.seek(0)

        # Return the image with proper headers
        headers = {
            "X-Filename": f"{image.filename.split('.')[0]}_nobg.png",
            "Content-Type": "image/png"
        }

        return StreamingResponse(output_img, media_type="image/png", headers=headers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.post(
    "/filter",
    summary="Apply the requested filter",
    response_description="Image with filter applied",
)
async def filter_image(
    image: UploadFile = File(...),
    filter: str = Form(...),
):
    """
    Applies filters to the requested images.

    This endpoint applies filters as requested to the requested images using pillow's
    image manipulation capabilites.

    Parameters:
    - **image**: The input image file
    - **format**: Format for the output image (optional)
    - **filter**: The filter needs to be applied

    Returns:
    - A PNG image with requested filter applied as a streaming response

    Raises:
    - 400: If an invalid filter.
    - 500: If there's an error during image processing or reading
    """

    # Read the uploaded image as bytes
    try:
        img_bytes = await image.read()
        input_img = BytesIO(img_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading the image: {str(e)}")

    # Validate format
    allowed_filters = {"grayscale", "saturated", "sepia"}
    if filter.lower() not in allowed_filters:
        raise HTTPException(status_code=400, detail=f"Invalid filter. Allowed: {', '.join(allowed_filters)}")

    try:
        img = Image.open(input_img)

        # Define a bytes variable for the ouput
        output_img = BytesIO()

        # Apply the requested filter

        # ** I used chatgpt to read and understand how the ImageOps and
        # ImageEnhance in pillow works to save time and effort on browsing
        # the official documentation **

        try:
            match filter:
                case "grayscale":
                    filtered = ImageOps.grayscale(img)
                    logger.info("grayscale filter applied")
                case "saturated":
                    filtered = ImageEnhance.Color(img).enhance(2.0)
                    logger.info("saturated filter applied")
                case "sepia":
                    # Greyscale the iamge
                    filtered = ImageOps.grayscale(img).convert("RGB")
                    # Change the grayscaled R, G, B values to mimic sepia
                    # (Utilizes the same concept learned in cs50 filter problem)
                    sepia_data = [
                        (int(r * 240 / 255), int(r * 200 / 255), int(r * 145 / 255))
                        for (r, g, b) in filtered.getdata()
                    ]
                    filtered.putdata(sepia_data)
                    logger.info("sepia filter applied")
        except Exception as e:
            logger.info(f"Filter application failed: {str(e)}")

        # Save the image to the bytes variable
        filtered.save(output_img, "JPEG")

        # Reset the pointer to start
        output_img.seek(0)

        # Return the converted file
        headers = {
            "X-Filename": f"{image.filename.split('.')[0]}_filtered.jpeg",
            "Content-Type": f"image/JPEG"
        }

        return StreamingResponse(output_img, media_type=f"image/jpeg", headers=headers)

    except Exception as e:
        logger.info(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
