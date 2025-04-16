'use client'

import dynamic from 'next/dynamic';

// p5.jsコンポーネントをクライアントサイドでのみ読み込むように設定
const GeometricCanvas = dynamic(() => import('./src'), {
    ssr: false,
    loading: () => <div className="w-[1280px] h-[670px] bg-gray-200 flex items-center justify-center">Loading...</div>
});

export default function GeometricPatternsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Living Patterns</h1>
            <div className="shadow-lg rounded-lg overflow-hidden">
                <GeometricCanvas />
            </div>
        </div>
    );
}
