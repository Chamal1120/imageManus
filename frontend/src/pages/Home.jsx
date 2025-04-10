import HeroSVGDark from "../components/HeroSVGDark";
import HeroSVGLight from "../components/HeroSVGLight";

// Home page view
export default function Home(props) {
  return (
    <div class="flex flex-col lg:flex-row items-center lg:justify-center">
      <div class="w-full lg:w-64 text-center lg:text-left lg:flex-1">
        <h1 class="lg:flex font-souceSans text-6xl lg:text-8xl cursor-default transition-transform duration-300 ease-in-out origin-left">
          <span class="transition-all ease-in-out active:scale-95 font-light">Image</span><span class="font-semibold transition-transform duration-300 lg:hover:-skew-x-12 active:scale-95">Manus</span>
        </h1>
        <p class="text-sm pt-5 cursor-default">-- An Image Manipulation ToolBox --</p>
      </div>

      {/* Render the Hero SVG based on theme */}
      <div class="lg:w-32 flex-1 hidden lg:block mx-5">
        {props.theme === "dark" ? <HeroSVGDark /> : <HeroSVGLight />}
      </div>
    </div>
  );
}

