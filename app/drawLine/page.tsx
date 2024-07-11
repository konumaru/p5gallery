import dynamic from 'next/dynamic';

export const metadata = {
    title: 'My Page',
}


const P5Wrapper = dynamic(() => import('./src'), {
  ssr: false
});
  
export default function Page() {
    return (
        <div>
            <h1>p5.js Circle Example</h1>
            <P5Wrapper />
        </div>
    )
}
