import { Router, Route, } from "@solidjs/router";
import { onMount } from "solid-js";
import Home from "./pages/Home";
import Convert from "./pages/Convert";
import RemoveBG from "./pages/RemoveBG";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  onMount(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  });

  function toggleDark() {
    const html = document.documentElement;
    const isDark =  html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  const Layout = (props) => {
    return (
      <div class="flex flex-col justify-between min-h-screen">
        <header><Navbar toggleDark={toggleDark} /></header>
        <main class="pt-20">
          {props.children}
        </main>
        <footer class="py-6 text-center text-sm"><Footer /></footer>
      </div>
    );
  }
  return (
    <div class="">
      <div class="dark:bg-gray-900 dark:text-gray-200 bg-gray-50">
        <div class="max-w-7xl mx-auto px-5">
          <Router root={Layout}>
            <Route path="/" component={Home} />
            <Route path="/convert" component={Convert} />
            <Route path="/removebg" component={RemoveBG} />
            <Route path="/docs" component={Docs} />
            <Route path="/contact" component={Contact} />
          </Router>
        </div>
      </div>
    </div>
  )
}
