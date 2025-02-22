export default function Changelog() {
    return (
      <div className="pt-24 container mx-auto px-4 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Changelog</h1>
        <p className="mb-8">
          Here you&apos;ll find a record of all the changes made to the project.
        </p>
        <a
          href="https://github.com/kewonit/mevents/commits/main/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View full commit history on GitHub
        </a>
      </div>
    )
  }
  