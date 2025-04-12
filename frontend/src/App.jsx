import { Router, Route } from '@solidjs/router'
import { createSignal, onMount } from 'solid-js'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Convert from './pages/Convert'
import RemoveBG from './pages/RemoveBG'
import Filters from './pages/Filters'
import Contact from './pages/Contact'

// Main component
export default function App() {
  // State variable to hold the theme state
  const [theme, setTheme] = createSignal('dark')

  // Check the theme state on component mount and switch the theme based on it
  onMount(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  })

  // Toggle the theme between light and dark
  function toggleDark() {
    const html = document.documentElement
    const isDark = html.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    setTheme(localStorage.getItem('theme'))
  }

  // Define the layout component that will share for it's childrens
  const Layout = (props) => {
    return (
      <div class="flex min-h-screen flex-col justify-between">
        <header>
          <Navbar toggleDark={toggleDark} />
        </header>
        <main class="pt-20">{props.children}</main>
        <footer class="py-6 text-center text-sm">
          <Footer />
        </footer>
      </div>
    )
  }
  return (
    <div class="">
      <div class="bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
        <div class="font-souceSans mx-auto max-w-7xl px-5">
          {/* Wrap routes inside the layout with Solid.js Router components */}
          <Router root={Layout}>
            <Route path="/" component={() => <Home theme={theme()} />} />
            <Route path="/convert" component={Convert} />
            <Route path="/removebg" component={RemoveBG} />
            <Route path="/filters" component={Filters} />
            <Route path="/contact" component={Contact} />
          </Router>
        </div>
      </div>
    </div>
  )
}
