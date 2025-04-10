import { A, useLocation } from "@solidjs/router";
import { createSignal } from "solid-js";
import ThemeToggle from "./ThemeToggle";
import HamburgerSVG from "./HamburgerSVG";

export default function Navbar(props) {

  // Assign the theme state passed from App.jsx to a constant variable
  const toggleDark = props.toggleDark;

  // Stores the mobile navigation popup state
  const [mobileNavState, setMobileNavState] = createSignal(false);

  // Define Navlinks
  const [navItems, _setNavItems] = createSignal([
    { name: "Home", path: "/" },
    { name: "Convert", path: "/convert" },
    { name: "RemoveBG", path: "/removebg" },
    { name: "Filters", path: "/filters" },
    { name: "Contact", path: "/contact" },
  ]);

  // Instantiate solid's useLocation
  const location = useLocation();

  // Toggle mobileNavState signal
  function toggleNav() {
    setMobileNavState(!mobileNavState());
  }

  return (
    <>
      {/* Mobile navigation open button */}
      <div class="md:hidden flex w-full justify-end pt-5 transition-transform duration-300">
        <div class="max-w-14 transition-transform duration-300 active:scale-80" onClick={toggleNav}>
          <HamburgerSVG />
        </div>
      </div>

      {/* Conditionally add hidden or flex Class  based on mobileNavState */}
      <nav class={`${mobileNavState() ? "flex" : "hidden"} md:flex fixed flex-col md:flex-row py-3 px-5 md:justify-between z-50 top-5 left-5 right-5 mx-auto items-center md:bg-gray-600/20 md:dark:bg-gray-600/30 bg-gray-300 dark:bg-gray-700  rounded-md h-screen md:h-auto`}>

        {/* Mobile Navigation close button */}
        <div class="self-end md:hidden cursor-pointer text-xl mb-4 pt-2 pr-0 transition-transform duration-300 active:scale-90" onClick={toggleNav}>
          <div class="border-2 rounded-full px-3 py-1">x</div>
        </div>

        {/* Navigation bar's LOGO (only visible in Desktop navigation) */}
        <A class="hidden md:block  text-2xl transition-all ease-in-out hover:scale-102 active:scale-95" href="/">
          <span class="font-medium">I</span><span class="font-black">M</span>.
        </A>
        <ul class="flex flex-col md:flex-row gap-10 justify-center md:justify-end items-center h-screen md:h-auto">

          {/* Loop throgh the navigation items and render the navigation links */}
          <For each={navItems()}>{(item) =>
            <button class="transition-all ease-in-out hover:scale-102  active:scale-95" onClick={toggleNav}>
              <li><A class={`${location.pathname === item.path ? `underline underline-offset-8 font-bold` : `font-medium`}`} href={item.path}>{item.name}</A></li>
            </button>
          }
          </For>

          {/* Pass the theme state to the ThemeToggle component */}
          <ThemeToggle toggleDark={toggleDark} />
        </ul>
      </nav>
    </>
  )
}
