'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
          Something went wrong!
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => reset()}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
