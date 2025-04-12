import { A, useLocation } from '@solidjs/router'
import { createSignal } from 'solid-js'
import ThemeToggle from './ThemeToggle'
import HamburgerSVG from './SVGs/HamburgerSVG'

export default function Navbar(props) {
  // Assign the theme state passed from App.jsx to a constant variable
  const toggleDark = props.toggleDark

  // Stores the mobile navigation popup state
  const [mobileNavState, setMobileNavState] = createSignal(false)

  // Define Navlinks
  const [navItems, _setNavItems] = createSignal([
    { name: 'Home', path: '/' },
    { name: 'Convert', path: '/convert' },
    { name: 'RemoveBG', path: '/removebg' },
    { name: 'Filters', path: '/filters' },
    { name: 'Contact', path: '/contact' },
  ])

  // Instantiate solid's useLocation
  const location = useLocation()

  // Toggle mobileNavState signal
  function toggleNav() {
    setMobileNavState(!mobileNavState())
  }

  return (
    <>
      {/* Mobile navigation open button */}
      <div class="flex w-full justify-end pt-5 transition-transform duration-300 md:hidden">
        <button
          class={`${mobileNavState() ? 'pointer-events-none' : 'pointer-events-auto'} max-w-14 transition-transform duration-300 active:scale-80 active:rotate-6`}
          onClick={toggleNav}
        >
          <HamburgerSVG />
        </button>
      </div>

      {/* Conditionally add hidden or flex Class  based on mobileNavState */}
      <nav
        class={`${mobileNavState() ? 'flex scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'} fixed top-5 right-5 left-5 z-50 mx-auto h-screen flex-col items-center rounded-md bg-gray-300 px-5 py-3 transition-all md:pointer-events-auto md:flex md:h-auto md:scale-100 md:flex-row md:justify-between md:bg-gray-200 md:opacity-100 dark:bg-gray-700 md:dark:bg-gray-800`}
      >
        {/* Mobile Navigation close button */}
        <button
          class={`${mobileNavState() ? 'block' : 'hidden'} mb-4 cursor-pointer self-end pt-2 pr-0 text-xl transition-transform duration-200 active:scale-90 md:hidden`}
          onClick={toggleNav}
        >
          <div class="rounded-full border-2 px-2.5 duration-200 active:bg-gray-700">
            x
          </div>
        </button>

        {/* Navigation bar's LOGO (only visible in Desktop navigation) */}
        <A
          class="hidden text-2xl transition-all ease-in-out hover:scale-102 active:scale-95 md:block"
          href="/"
        >
          <span class="font-medium">I</span>
          <span class="font-black">M</span>.
        </A>
        <ul class="flex h-screen flex-col items-center justify-center gap-10 md:h-auto md:flex-row md:justify-end">
          {/* Loop throgh the navigation items and render the navigation links */}
          <For each={navItems()}>
            {(item) => (
              <button
                class="transition-all ease-in-out hover:scale-102 active:scale-95"
                onClick={toggleNav}
              >
                <li>
                  <A
                    class={`${location.pathname === item.path ? `font-bold underline underline-offset-8` : `font-medium`}`}
                    href={item.path}
                  >
                    {item.name}
                  </A>
                </li>
              </button>
            )}
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
