import ImageProcessView from "../components/ImageProcessView";

// Filters page view (Utilize the resusable ImageProcessView component)
export default function Filters() {
  // Define the props
  const propsData = {
    manipulationProp: "Apply Beautiful Filters to your Images",
    apiEndPointProp: "filter",
    actionProp: "filter",
    actionButtonNameProp: "Apply the filter"
  }
  return (
  <>
    {/* Pass the props to the component */}
    <ImageProcessView propsData={propsData}/>
  </>
  );
}

