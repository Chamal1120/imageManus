import ImageProcessView from "../components/ImageProcessView";

export default function convert() {
  const propsData = {
    manipulationProp: "convert to Webp",
    imgResProp: "webp",
    apiEndPointProp: "convert-to-webp",
  }
  return (
  <>
    <ImageProcessView propsData={propsData}/>
  </>
  );
}
