import ImageProcessView from '../components/ImageProcessView'

// Convert page view (Utilize the resusable ImageProcessView component)
export default function convert() {
  // Define the props
  const propsData = {
    manipulationProp: 'Convert any Image to any Type',
    apiEndPointProp: 'convert',
    actionProp: 'convert',
    actionButtonNameProp: 'Convert Image to',
  }
  return (
    <>
      {/* Pass the props to the component */}
      <ImageProcessView propsData={propsData} />
    </>
  )
}
