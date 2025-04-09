import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

export default function Navbar(props) {
  const [navItems, _setNavItems] = createSignal([
    { name: "Home", path: "/" },
    { name: "Convert", path: "/convert" },
    { name: "RemoveBG", path: "/removebg" },
    { name: "Docs", path: "/docs" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <>
      <nav class="fixed flex flex-row py-6 px-5 justify-between z-50 top-0 left-0 right-0 max-w-7xl mx-auto items-center">
        <A href="/">
          <span class="text-2xl font-black">IM.</span>
        </A>
        <ul class="flex flex-row gap-10 justify-end items-center">
          <For each={navItems()}>{(item) =>
            <li class=""><A href={item.path}>{item.name}</A></li>
          }
          </For>
          <div class="flex flex-col justify-center ml-3" onClick={props.toggleDark}>
            <input type="checkbox" name="light-switch" class="light-switch sr-only" />
            <label class="relative cursor-pointer p-2" for="light-switch">
              <svg class="dark:hidden" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path class="fill-slate-300" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z" />
                <path class="fill-slate-400" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
              </svg>
              <svg class="hidden dark:block" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path class="fill-slate-400" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
                <path class="fill-slate-500" d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z" />
              </svg>
              <span class="sr-only">Switch to light / dark version</span>
            </label>
          </div>
        </ul>
      </nav>
    </>
  )
}
