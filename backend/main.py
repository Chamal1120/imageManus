from io import BytesIO
from typing import Optional
import cv2
import numpy as np
from env_config import Settings
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image

app = FastAPI(
    title="Image manupulation API",
    description="API for manupulating various things on images.",
    version="0.1.0"
)

settings = Settings()

# Define the allowed origins
origins = [
    settings.SOLID_DEV_SERVER   # Solid.js dev server
]

# Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allows requests from origins
    allow_credentials=True,     # Allow cookies or other credentials to be sent
    allow_methods=["*"],        # Allow all HTTP methods
    allow_headers=["*"],        # Allow all headers
)


@app.post(
    "/convert-to-webp/",
    summary="Convert image to WebP format",
    response_description="WebP image with specified quality"
)
async def convert_to_webp(
    image: UploadFile = File(...),
    quality: Optional[int] = Form(80)  # Default quality is 80
):
    """
    Convert an uploaded image to WebP format with the specified quality.

    This endpoint accepts any image format (JPG, PNG, etc.) and converts it
    to WebP format with the specified compression quality.
    The conversion is done in-memory without writing to disk.

    Parameters:
    - **image**: The image file to convert
    - **quality**: WebP compression quality (1-100)

    Returns:
    - A WebP image as a streaming response

    Raises:
    - 400: If quality parameter is outside the valid range (1-100)
    - 500: If there's an error during image conversion
    """

    # Validate quality parameter
    if quality < 1 or quality > 100:
        raise HTTPException(status_code=400, detail="Quality must be between 1 and 100")

    try:
        contents = await image.read()
        input_img = BytesIO(contents)

        # Convert to WebP
        img = Image.open(input_img)

        output_img = BytesIO()
        img.save(output_img, "WEBP", quality=quality)

        # Reset the pointer to start
        output_img.seek(0)

        # Return the converted file
        headers = {
            "Content-Disposition": f"attachment; filename={image.filename.split('.')[0]}_converted.webp",
            "Content-Type": "image/png"
        }

        return StreamingResponse(output_img, media_type="image/webp", headers=headers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")


@app.post(
    "/remove_bg/",
    summary="Removes the background",
    response_description="PNG image with background removed."
)
async def remove_bg(image: UploadFile = File(...)):
    """
    Remove the background from an uploaded image using OpenCV's GrabCut algorithm.

    This endpoint applies automatic background removal using the GrabCut algorithm
    with an automatically generated rectangle (margin of 10% from each edge).
    The process is done entirely in-memory.

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
            "Content-Disposition": f"attachment; filename={image.filename.split('.')[0]}_nobg.png",
            "Content-Type": "image/png"
        }

        return StreamingResponse(output_img, media_type="image/png", headers=headers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
