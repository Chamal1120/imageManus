import HeroSVGDark from '../components/SVGs/HeroSVGDark'
import HeroSVGLight from '../components/SVGs/HeroSVGLight'

// Home page view
export default function Home(props) {
  return (
    <div class="flex flex-col items-center lg:flex-row lg:justify-center">
      <div class="w-full text-center lg:w-64 lg:flex-1 lg:text-left">
        <h1 class="origin-left cursor-default text-6xl transition-transform duration-300 ease-in-out lg:flex lg:text-8xl">
          <span class="font-light transition-all ease-in-out active:scale-95">
            Image
          </span>
          <span class="font-semibold transition-transform duration-300 active:scale-95 lg:hover:-skew-x-12">
            Manus
          </span>
        </h1>
        <p class="cursor-default pt-5 text-sm">
          -- An Image Manipulation ToolBox --
        </p>
      </div>

      {/* Render the Hero SVG based on theme */}
      <div class="mx-5 hidden flex-1 lg:block lg:w-32">
        {props.theme === 'dark' ? <HeroSVGDark /> : <HeroSVGLight />}
      </div>
    </div>
  )
}
