export default function (props) {
  return (
    <button
      class="me-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      type="submit"
    >
      {props.passedProps}
    </button>
  )
}
