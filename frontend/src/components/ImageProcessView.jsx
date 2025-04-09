import { createSignal, Show } from "solid-js";

export default function ImageProcessView(props) {

  const propsData = props.propsData;

  const api = import.meta.env.VITE_API_URL;

  const [imageSrc, setImageSrc] = createSignal();
  const [imageRes, setImageRes] = createSignal();
  const [imageResUrl, setImageResUrl] = createSignal();

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(file);
    }
  }

  async function handleFileConvert(e) {
    e.preventDefault();
    if (!imageSrc) {
      return;
    }

    const formData = new FormData();
    formData.append("image", imageSrc());

    if (propsData.imageResProp === "webp") {
      formData.append("quality", "80");
    }

    const res = await fetch(`${api}/${propsData.apiEndPointProp}`, {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    setImageRes(blob);
    setImageResUrl(URL.createObjectURL(blob));
  }

  return (
    <>
      <div class="flex flex-col justify-center text-center">
        <h2 class="text-2xl py-10">{propsData.manipulationProp}</h2>
        <form onSubmit={handleFileConvert}>
          <Show when={!imageSrc()}>
            <label class="cursor-pointer">
              Select an Image File
              <input class="hidden cursor-pointer" type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} />
            </label>
          </Show>
          <Show when={imageSrc()}>
            <p class="text-sm mt-2 text-gray-500">Selected: {imageSrc().name}</p>
            <div class="flex justify-center my-4">
              <img
                class="w-sm"
                src={URL.createObjectURL(imageSrc())}
                alt="user uploaded Image"
              />
            </div>
            <Show when={!imageRes()}>
            <button class="cursor-pointer" type="submit">Convert</button>
            </Show>
          </Show>
        </form>
        <Show when={imageRes()}>
          <div>
            <button
              class="cursor-pointer"
              onClick={() => {
                const link = document.createElement("a");
                link.href = imageResUrl();
                link.download = `converted.${propsData.imgResProp}`
                link.click();
                URL.revokeObjectURL(imageResUrl());
              }}
            >
              Download {propsData.imgResProp} Image
            </button>
          </div>
        </Show>
      </div>
    </>
  );
}

