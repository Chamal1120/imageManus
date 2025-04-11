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
      <div class="flex md:hidden w-full justify-end pt-5 transition-transform duration-300">
        <button class={`${mobileNavState() ? "pointer-events-none" : ""} max-w-14 transition-transform duration-300 active:scale-80`} onClick={toggleNav}>
          <HamburgerSVG />
        </button>
      </div>

      {/* Conditionally add hidden or flex Class  based on mobileNavState */}
      <nav class={`${mobileNavState() ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} md:flex fixed flex-col md:flex-row md:opacity-100 md:pointer-events-auto md:scale-100 py-3 px-5 md:justify-between z-50 top-5 left-5 right-5 mx-auto items-center md:bg-gray-200 md:dark:bg-gray-800 bg-gray-300 dark:bg-gray-700 rounded-md h-screen md:h-auto transition-all`}>

        {/* Mobile Navigation close button */}
        <button
          class={`${mobileNavState() ? "block" : "hidden"} self-end md:hidden cursor-pointer text-xl mb-4 pt-2 pr-0 transition-transform duration-200 active:scale-90`}
          onClick={toggleNav}>
          <div class="border-2 rounded-full px-2.5 duration-200 active:bg-gray-700">x</div>
        </button>

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
          <div class="-translate-x-1.5 md:-translate-x-0">
            <ThemeToggle toggleDark={toggleDark} />
          </div>
        </ul>
      </nav>
    </>
  )
}
