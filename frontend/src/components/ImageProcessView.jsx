import { createSignal, Show } from 'solid-js'
import LoadingButton from './LoadingButton'
import StaticButton from './StaticButton'
import RightArrowSketchSVG from './SVGs/RightArrowSketchSVG'

export default function ImageProcessView(props) {
  // Asign the propsData passed from the parent view to a const variable
  const propsData = props.propsData

  // Import API base url using a VITE environment variable
  const api = import.meta.env.VITE_API_URL

  // Define allowed convert formats
  const convertFormats = ['webp', 'jpeg', 'png', 'bmp', 'tiff']

  // Define available filters
  const filters = ['grayscale', 'saturated', 'sepia']

  // State variables (aka signals in Solid.js terminology)
  const [isLoading, setIsLoading] = createSignal(false)
  const [imageSrc, setImageSrc] = createSignal()
  const [imageRes, setImageRes] = createSignal()
  const [imageResUrl, setImageResUrl] = createSignal()
  const [selectedFormat, setSelectedFormat] = createSignal('webp')
  const [selectedFilter, setSelectedFilter] = createSignal('grayscale')
  const [imageResName, setImageResName] = createSignal('converted')

  // Grab and store the Uploaded image in setImageSrc
  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (file) {
      setImageSrc(file)
    }
  }

  // Convert the image to the defined format using the backend API
  async function handleFileProcessing(e) {
    setIsLoading(true) // Set isLoading to true

    e.preventDefault()

    // Abort the operation if imageSrc is null
    if (!imageSrc) {
      return
    }

    // Prepare the form data for sending the http request
    const formData = new FormData()
    formData.append('image', imageSrc())

    if (propsData.actionProp === 'convert') {
      formData.append('format', selectedFormat())
    }

    if (propsData.actionProp === 'filter') {
      formData.append('filter', selectedFilter())
    }

    if (propsData.imageResProp === 'webp') {
      formData.append('quality', '80')
    }

    // Send the http request to backend API and wait till response is complete
    const res = await fetch(`${api}/${propsData.apiEndPointProp}`, {
      method: 'POST',
      body: formData,
    })

    // Get the File name from the custom header and update imageResName
    setImageResName(res.headers.get('X-Filename'))

    // Get the processed image's binary data
    const blob = await res.blob()

    // Update imageRes with processed binary data
    setImageRes(blob)

    // Create a url for the binaray data blob
    setImageResUrl(URL.createObjectURL(blob))
    setIsLoading(false) // Set loading to false
  }

  return (
    <>
      <div class="flex flex-col justify-center text-center">
        <h2 class="py-10 text-4xl font-black">{propsData.manipulationProp}</h2>

        {/* Show a preview based on the action */}
        <Show when={propsData.actionProp === 'convert' && !imageSrc()}>
          <div class="flex flex-row justify-center gap-4 pt-10 pb-15">
            <div class="relative w-full max-w-md">
              <img
                src="/cat-4098058_640.jpg"
                alt="Background"
                class="h-auto w-full"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-2xl font-bold text-white">.png</h1>
              </div>
            </div>
            <div class="max-w-[1rem] sm:max-w-[4rem]">
              <RightArrowSketchSVG />
            </div>
            <div class="relative w-full max-w-md">
              <img
                src="/cat-4098058_640.jpg"
                alt="Background"
                class="h-auto w-full"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <h1 class="text-2xl font-bold text-white">.webp</h1>
              </div>
            </div>
          </div>
        </Show>
        <Show when={propsData.actionProp === 'removebg' && !imageSrc()}>
          <div class="flex flex-row justify-center gap-4 pt-10 pb-15">
            <div class="relative max-w-md transition-transform duration-500 ease-in-out lg:hover:scale-105">
              <img
                src="/cat-4098058_640.jpg"
                class="h-auto w-full"
                alt="reference-image-nobg"
              ></img>
            </div>
            <div class="max-w-[1rem] sm:max-w-[4rem]">
              <RightArrowSketchSVG />
            </div>
            <div class="relative max-w-md bg-gray-700 transition-transform duration-500 ease-in-out lg:hover:scale-105 dark:bg-gray-200">
              <img
                class="h-auto w-full"
                src="/cat-4098058_640_nobg.webp"
                alt="reference-image-nobg"
              ></img>
            </div>
          </div>
        </Show>
        <Show when={propsData.actionProp === 'filter' && !imageSrc()}>
          <div class="flex w-full -translate-x-12 items-center justify-center md:-translate-x-0">
            <div class="relative h-40 w-64 items-center pt-10 pb-15 md:flex md:h-auto md:w-auto md:flex-row md:justify-center md:gap-4">
              <For
                each={[
                  'grayscale left-0',
                  'saturate-150 left-24',
                  'sepia left-48',
                ]}
              >
                {(item) => (
                  <img
                    src="/cat-4098058_640.jpg"
                    class={`absolute top-0 w-40 rotate-6 transition-transform duration-500 ease-in-out md:static md:w-64 lg:hover:scale-105 lg:hover:rotate-7 ${item}`}
                    alt={`reference-image-${item}`}
                  ></img>
                )}
              </For>
            </div>
          </div>
        </Show>

        <form onSubmit={handleFileProcessing}>
          {/* Show select an image button when no image is loaded */}
          <Show when={!imageSrc()}>
            <label
              class="me-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              for="input-image"
            >
              Select an Image File
              <input
                class="hidden cursor-pointer"
                type="file"
                accept="image/*"
                id="input-image"
                onChange={(e) => handleFileUpload(e)}
              />
            </label>
          </Show>
          {/* Show Image and it's name when an image is loaded */}
          <Show when={imageSrc()}>
            <p class="mt-2 text-sm text-gray-500">
              Selected: {imageSrc().name}
            </p>
            <div class="my-4 flex justify-center">
              <img
                class="w-sm"
                src={URL.createObjectURL(imageSrc())}
                alt="user uploaded Image"
              />
            </div>
            {/* Show a conversion button not processed yet */}
            <Show when={!imageRes()}>
              {/* Show a loading spinner while processing the request */}
              {isLoading() ? (
                <LoadingButton passedProps={'processing...'} />
              ) : (
                <StaticButton passedProps={propsData.actionButtonNameProp} />
              )}

              {/* Show the coversion selection dropdown 
              if parent component passes actionProp as convert */}
              <Show when={propsData.actionProp === 'convert'}>
                <select
                  name="format"
                  id="format"
                  onInput={(e) => setSelectedFormat(e.currentTarget.value)}
                >
                  <For each={convertFormats}>
                    {(format) => <option value={format}>{format}</option>}
                  </For>
                </select>
              </Show>
              <Show when={propsData.actionProp === 'filter'}>
                <select
                  name="filter"
                  id="filter"
                  onInput={(e) => setSelectedFilter(e.currentTarget.value)}
                >
                  <For each={filters}>
                    {(filter) => <option value={filter}>{filter}</option>}
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
              class="me-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => {
                const link = document.createElement('a')
                link.href = imageResUrl()
                link.download = imageResName()
                link.click()
              }}
            >
              Download Image
            </button>
            {/* Show a "Do another button" that reset the state variables to their initial states */}
            <button
              class="me-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => {
                URL.revokeObjectURL(imageResUrl())
                setImageSrc()
                setImageRes()
                setImageResUrl()
                setSelectedFilter('grayscale')
                setSelectedFormat('webp')
                setImageResName('converted')
              }}
            >
              Do another one
            </button>
          </div>
        </Show>
      </div>
    </>
  )
}
