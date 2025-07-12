
'use client'

import { PropLayout } from "@/interface/prop-layout"
import { AntdProvider } from "@/provider/AntdProvider"
import SearchBox from "../tools/SearchBox"

function LayoutWrapper({ children }: PropLayout) {

    return (
        <html lang="en">
            <body>
                <AntdProvider>
                    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-400">
                        <div className="container mx-auto px-4 py-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-2">Weather & Forecast App</h1>
                                <p className="text-blue-100">Get current weather and 24-hour forecast</p>
                                <div className="py-8">
                                    <SearchBox />
                                </div>
                            </div>
                            <div>
                                {children}
                            </div>
                        </div>
                    </div>
                </AntdProvider>
            </body>
        </html >
    )
}

export default LayoutWrapper