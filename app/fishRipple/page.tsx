import dynamic from 'next/dynamic';
import Link from 'next/link';

const directoryName = 'fishRipple';

export const metadata = {
    title: directoryName,
}

const P5Canvas = dynamic(() => import('./src'), {
    ssr: false
});


export default function Page() {
    return (
        <div className='bg-white'>
            <nav className="text-sm breadcrumbs">
                <ol className="list-none p-1 inline-flex">
                    <li className="flex items-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-800">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-500">/</span>
                    </li>
                    <li className="text-gray-700">{directoryName}</li>
                </ol>
            </nav>

            <h1 className="text-xl text-black font-bold mb-1 p-1">{directoryName}</h1>

            <P5Canvas />
        </div>
    )
}
