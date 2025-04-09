import ImageProcessView from "../components/ImageProcessView";

export default function RemoveBG() {
  const propsData = {
    manipulationProp: "Remove Background of an Image",
    imgResProp: "png",
    apiEndPointProp: "removebg",
  }
  return (
  <>
    <ImageProcessView propsData={propsData}/>
  </>
  );
}
