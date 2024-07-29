import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <link rel="icon" href={process.env.FAVICON_URL} />
      <h1 className="text-4xl text-center font-bold mb-8 text-gray-800 ">konumaru&apos;s P5Gallery</h1>
      <ul className="space-y-4 text-center">
        <li>
          <Link href="/drawLine" className="artwork-link text-2xl">drawLine</Link>
        </li>
      </ul>
    </main>
  )
}
