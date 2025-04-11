import { createSignal, Show } from "solid-js";
import LoadingButton from "./LoadingButton";
import StaticButton from "./StaticButton";
import RightArrowSketchSVG from "./RightArrowSketchSVG";

export default function ImageProcessView(props) {
  // Asign the propsData passed from the parent view to a const variable
  const propsData = props.propsData;

  // Import API base url using a VITE environment variable
  const api = import.meta.env.VITE_API_URL;

  // Define allowed convert formats
  const convertFormats = ["webp", "jpeg", "png", "bmp", "tiff"];

  // Define available filters
  const filters = ["grayscale", "saturated", "sepia"];

  // State variables (aka signals in Solid.js terminology)
  const [isLoading, setIsLoading] = createSignal(false);
  const [imageSrc, setImageSrc] = createSignal();
  const [imageRes, setImageRes] = createSignal();
  const [imageResUrl, setImageResUrl] = createSignal();
  const [selectedFormat, setSelectedFormat] = createSignal("webp");
  const [selectedFilter, setSelectedFilter] = createSignal("grayscale");
  const [imageResName, setImageResName] = createSignal("converted");

  // Grab and store the Uploaded image in setImageSrc
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(file);
    }
  }

  // Convert the image to the defined format using the backend API
  async function handleFileProcessing(e) {
    setIsLoading(true); // Set isLoading to true

    e.preventDefault();

    // Abort the operation if imageSrc is null
    if (!imageSrc) {
      return;
    }

    // Prepare the form data for sending the http request
    const formData = new FormData();
    formData.append("image", imageSrc());

    if (propsData.actionProp === "convert") {
      formData.append("format", selectedFormat());
    }

    if (propsData.actionProp === "filter") {
      formData.append("filter", selectedFilter());
    }

    if (propsData.imageResProp === "webp") {
      formData.append("quality", "80");
    }

    // Send the http request to backend API and wait till response is complete
    const res = await fetch(`${api}/${propsData.apiEndPointProp}`, {
      method: "POST",
      body: formData,
    });

    // Get the File name from the custom header and update imageResName
    setImageResName(res.headers.get("X-Filename"));

    // Get the processed image's binary data
    const blob = await res.blob();

    // Update imageRes with processed binary data
    setImageRes(blob);

    // Create a url for the binaray data blob
    setImageResUrl(URL.createObjectURL(blob));
    setIsLoading(false); // Set loading to false
  }

  return (
    <>
      <div class="flex flex-col justify-center text-center">
        <h2 class="text-4xl py-10 font-black">{propsData.manipulationProp}</h2>

        <Show when={propsData.actionProp === "convert" && !imageSrc()}>
          <div class="flex flex-row gap-4 pt-10 pb-15 justify-center">
            <div class="relative w-full max-w-md">
              <img src="/cat-4098058_640.jpg" alt="Background" class="w-full h-auto" />
              <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-white text-2xl font-bold">.png</h1>
              </div>
            </div>
            <div class="max-w-[1rem] sm:max-w-[4rem]">
              <RightArrowSketchSVG />
            </div>
            <div class="relative w-full max-w-md">
              <img src="/cat-4098058_640.jpg" alt="Background" class="w-full h-auto" />
              <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-white text-2xl font-bold">.webp</h1>
              </div>
            </div>
          </div>
        </Show>

        <Show when={propsData.actionProp === "removebg" && !imageSrc()}>
          <div class="flex flex-row justify-center pt-10 pb-15 gap-4">
            <div class="relative transition-transform ease-in-out duration-500 max-w-md lg:hover:scale-105">
              <img
                src="/cat-4098058_640.jpg"
                class="w-full h-auto"
                alt="reference-image-nobg">
              </img>
            </div>
            <div class="max-w-[1rem] sm:max-w-[4rem]">
              <RightArrowSketchSVG />
            </div>
            <div class="relative transition-transform ease-in-out duration-500 max-w-md lg:hover:scale-105 bg-gray-700 dark:bg-gray-200">
              <img
                class="w-full h-auto"
                src="/cat-4098058_640_nobg.webp"
                alt="reference-image-nobg">
              </img>
            </div>
          </div>
        </Show>

        <Show when={propsData.actionProp === "filter" && !imageSrc()}>
          <div class="flex justify-center items-center w-full -translate-x-12 md:-translate-x-0">
            <div class="relative w-64 h-40 items-center md:w-auto md:h-auto md:flex md:flex-row md:gap-4 md:justify-center pt-10 pb-15">
              <For each={["grayscale left-0", "saturate-150 left-24", "sepia left-48"]}>{(item) =>
                <img
                  src="/cat-4098058_640.jpg"
                  class={`absolute md:static top-0 w-40 md:w-64 rotate-6 transition-transform ease-in-out duration-500 lg:hover:scale-105 lg:hover:rotate-7 ${item}`}
                  alt={`reference-image-${item}`}>
                </img>
              }
              </For>
            </div>
          </div>
        </Show>

        <form onSubmit={handleFileProcessing}>
          {/* Show select an image button when no image is loaded */}
          <Show when={!imageSrc()}>
            <label class="cursor-pointer py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-700 focus:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center" for="input-image">
              Select an Image File
              <input class="hidden cursor-pointer" type="file" accept="image/*" id="input-image" onChange={(e) => handleFileUpload(e)} />
            </label>
          </Show>
          {/* Show Image and it's name when an image is loaded */}
          <Show when={imageSrc()}>
            <p class="text-sm mt-2 text-gray-500">Selected: {imageSrc().name}</p>
            <div class="flex justify-center my-4">
              <img
                class="w-sm"
                src={URL.createObjectURL(imageSrc())}
                alt="user uploaded Image"
              />
            </div>
            {/* Show a conversion button not processed yet */}
            <Show when={!imageRes()}>
              {/* Show a loading spinner while processing the request */}
              {isLoading() ?
                <LoadingButton passedProps={"processing..."} />
                :
                <StaticButton passedProps={propsData.actionButtonNameProp} />
              }

              {/* Show the coversion selection dropdown 
              if parent component passes actionProp as convert */}
              <Show when={propsData.actionProp === "convert"}>
                <select
                  name="format"
                  id="format"
                  onInput={(e) => setSelectedFormat(e.currentTarget.value)}
                >
                  <For each={convertFormats}>{(format) =>
                    <option value={format}>{format}</option>
                  }
                  </For>
                </select>
              </Show>
              <Show when={propsData.actionProp === "filter"}>
                <select
                  name="filter"
                  id="filter"
                  onInput={(e) => setSelectedFilter(e.currentTarget.value)}
                >
                  <For each={filters}>{(filter) =>
                    <option value={filter}>{filter}</option>
                  }
                  </For>
                </select>
              </Show>
            </Show>
          </Show>
        </form>
        {/* Show the Download button when response image is ready */}
        <Show when={imageRes()}>
          <div>
            <button
              class="cursor-pointer py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-700 focus:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
              onClick={() => {
                const link = document.createElement("a");
                link.href = imageResUrl();
                link.download = imageResName();
                link.click();
                URL.revokeObjectURL(imageResUrl());
              }}
            >
              Download Image
            </button>
          </div>
        </Show>
      </div>
    </>
  );
}

