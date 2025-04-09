import { A, useLocation } from "@solidjs/router";
import { createSignal } from "solid-js";
import ThemeToggle from "./ThemeToggle";

export default function Navbar(props) {
  const toggleDark = props.toggleDark;
  const [navItems, _setNavItems] = createSignal([
    { name: "Home", path: "/" },
    { name: "Convert", path: "/convert" },
    { name: "RemoveBG", path: "/removebg" },
    { name: "Docs", path: "/docs" },
    { name: "Contact", path: "/contact" },
  ]);

  const location = useLocation();

  return (
    <>
      <nav class="fixed flex flex-row py-3 px-5 justify-between z-50 top-5 left-5 right-5 mx-auto items-center bg-gray-600/20 rounded-md dark:bg-gray-600/30">
        <A class="text-2xl transition-all ease-in-out hover:scale-102 active:scale-95" href="/">
          <span class="font-medium">I</span><span class="font-black">M</span>.
        </A>
        <ul class="flex flex-row gap-10 justify-end items-center">
          <For each={navItems()}>{(item) =>
            <button class="transition-all ease-in-out hover:scale-102  active:scale-95">
              <li><A class={`${location.pathname === item.path ? `underline underline-offset-8 font-bold` : `font-medium`}`} href={item.path}>{item.name}</A></li>
            </button>
          }
          </For>
          <ThemeToggle toggleDark={toggleDark} />
        </ul>
      </nav>
    </>
  )
}
