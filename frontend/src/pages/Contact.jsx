import StaticButton from "../components/StaticButton";

// Contact page view
export default function Contact() {
  return (
    <div class="flex flex-col items-center justify-center gap-4">
      <h2 class="text-center text-4xl font-bold">Notice a Bug?</h2>
      <p>Let me know ASAP.</p>
      <StaticButton passedProps={<a href="mailto:kenway213beep@gmail.com">Mail Me</a>} />
    </div>
  )
}
