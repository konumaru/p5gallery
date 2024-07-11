import dynamic from 'next/dynamic';
import Header from '../Header';

export const metadata = {
    title: 'drawLine',
}

const P5Canvas = dynamic(() => import('./src'), {
  ssr: false
});


export default function Page() {
    return (
        <>
            <Header />
            <div>
                <h1>p5.js Circle Example</h1>
                <P5Canvas />
            </div>
        </>
    )
}
