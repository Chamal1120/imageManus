import ImageProcessView from "../components/ImageProcessView";

// RemoveBG page view (Utilize the reusable ImageProcessView component)
export default function RemoveBG() {
  // Define the props
  const propsData = {
    manipulationProp: "Remove Background of any Image",
    imgResProp: "png",
    apiEndPointProp: "removebg",
    actionProp: "removebg",
    actionButtonNameProp: "Remove the Background"
  }
  return (
  <>
    {/* Pass the props to the component */}
    <ImageProcessView propsData={propsData}/>
  </>
  );
}
