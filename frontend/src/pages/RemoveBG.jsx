import ImageProcessView from "../components/ImageProcessView";

export default function RemoveBG() {
  const propsData = {
    manupulationProp: "Remove Background of an Image",
    imgResProp: "png",
    apiEndPointProp: "removebg",
  }
  return (
  <>
    <ImageProcessView propsData={propsData}/>
  </>
  );
}
