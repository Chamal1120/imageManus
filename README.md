<div align="center">

# ImageManus
-- An Online Image Manipulation Tool --

</div>

## Tech Stack

#### Frontend
1. **Solid.js** - A reactive JavaScript framework
2. **TailwindCSS** - A utility based CSS framework
3. **Node.js** - JavaScript runtime environment

#### Backend
1. **FastAPI** - Python Web framework
2. **UV** - Python package manager
3. **Pillow** - Image manipulation and handling library for Python
4. **OpenCV** - Computer vision library for Python
5. **Numpy** - Multi-dimentional array and matrices calculation library for Python

## Video Demo

## Screenshots
<div align="center">
    <img src="/readme-assets/image-manus-screenshot-1.webp" width="420px"></img>
    <img src="/readme-assets/image-manus-screenshot-3.webp" width="112px"></img>
</div>

<div align="center">
    <img src="/readme-assets/image-manus-screenshot-2.webp" width="420px"></img>
    <img src="/readme-assets/image-manus-screenshot-4.webp" width="112px"></img>
</div>

## High level Architecture

![Image Manus architecuture](/readme-assets/image-manus-architecture.svg)

#### >> Flow
1. User uploads an image to the frontend through an input grabber (an html input element).
2. Depends on the page user is on, frontend will present the available actions.
3. User select the action and press on process button.
4. Frontend collects the infomration and then sends a request with the image and the action needed to be performed for that image.
5. Backend recieves the request, processes the image based on action and sends back a response to the backend.
6. Frontend recieves the reponse, extracts the image from it and prepare a download button for the user to download the image.

## Backend
The backend utiilizes FastAPI. A python web framework that helps to create fast and efficient web servers with easy and maintainable code.

#### Folder Structure
This sub section explains the folder strcuture of the FastAPI appliation.

1. .venv/ - Python virtual environment.
2. .env - Environment variables.
3. .env_example - Example file for the .env.
4. .gitignore - File to mark files needed to be ignored from git.
5. .python-version - Specify the python version for the virtual environment.
6. env_config.py - Loader function to load env with type safety.
7. main.py - Main file that contains the FastAPI routes.
8. pyproject.toml - Records of the packages required to run the app. (UV compatible)
9. requirements.txt - Records of the packages and their versions required to run the app. (pip compatible)
10. uv.lock - Records of the exact versions of the packages.

#### Image Processing
This sub section will explain the image processsing techniques happenining on each route of the FastAPI backend.

1. **/convert** – Accepts an image and target format (jpeg, png, webp, bmp, or tiff) along with optional quality (1–100).
    1. Open the uploaded image using Pillow.
    2. Save it in the new format with the specified quality level using Pillow.

2. **/removebg** – Accepts an image and removes its background using OpenCV’s GrabCut algorithm (rectangle mode).
    1. Image is decoded into a NumPy array using OpenCV.
    2. A rectangular region (10% margin from edges) is used as the initial foreground for GrabCut.
    3. Background and foreground models are computed automatically.
    4. A binary mask is created to isolate the foreground.
    5. An alpha channel is added to the image based on the mask to achieve transparency.
    6. Final image is converted to RGBA and returned in PNG format using Pillow.

3. **/filter** – Accepts an image, applies a specified visual filter to the uploaded image.
    1. Apply the filter based on the the given filter:
        1. Grayscale: Converts image to grayscale using `ImageOps.grayscale()`.
        2. Saturated: Enhances color saturation by 2x using `ImageEnhance.Color()`.
        3. Sepia: Applies sepia effect by first transforming into grayscale, and then those pixels into warm sepia tones.
    2. Filtered image is saved in the specified format using Pillow.

![NOTE]
> All routes will recieve the image as a bytestream and sends the reponse as a bytestream.

## Frontend
This section will explain how frontend is working as a solid.js web application.

1. Solid.js is a reactive javaScript framework that re-renders only the updated DOM nodes of the HTML DOM(Document Object Model) tree.
2. Solid.js uses an extended version of JavaScript called JavaScript XML that allows to use html directly inside JavaScript functions.
3. All the requests and responses are handles through JavaScript's `fetch` functions using asynchronous programming.

#### Folder strucuture

1. node_modules/ - Libraries for solid.js
2. public/ - Static contents like images are stored here
3. src/ - Solid.js code for the views of the app.  
    1. components/ - Reusable components for the views and other components.
    2. pages/ - Views of the app.
    3. App.jsx - Component that wraps all views of the app.
    4. index.jsx - Root solid.js component that links to the index.html.
    5. styles.css - Style sheet of the application. (works with tailwind css)
4. .env - Environment variables
5. .env_example - Just an example file as a reference for the .env.
6. .gitignore - File to mark files needed to be ignored from git.
7. index.html - HTML file that act as the root of the solid.js app.
8. package.json - Records of the packages nad libraries installed for the solid.js application.
9. pnpm-lock.yaml - Records of the exact versions of the packages.
10. vite.config.js - Configuration specific to the build system. (Vite act as a wrapper around javaScript bunlder to bundle the Solid.js code to the browser runnable static HTML, CSS and JS).

## Links and References

1. OpenCV's Grabcut alogorithm - [https://docs.opencv.org/3.4/d8/d83/tutorial_py_grabcut.html](https://docs.opencv.org/3.4/d8/d83/tutorial_py_grabcut.html)
