
'use client'

import { PropLayout } from "@/interface/prop-layout"
import { AntdProvider } from "@/provider/AntdProvider"
import SearchBox from "../tools/SearchBox"
import UnitsToggle from "../tools/UnitsToggle"
import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd"
import { useRouter } from "next/navigation"


function LayoutWrapper({ children }: PropLayout) {
    const router = useRouter()

    return (
        <html lang="en">
            <body>
                <AntdProvider>
                    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500">
                        <div className="container mx-auto px-4 py-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-2">Weather & Forecast App</h1>
                                <p className="text-white">Get current weather and 24-hour forecast</p>
                                <div className="py-4">
                                    <Button icon={<HomeOutlined />} shape="circle" type="default" size='large' onClick={() => router.push('/')} className="mr-2 mb-2" />
                                    <SearchBox />
                                </div>
                                <div className="py-4 flex justify-center ">
                                    <UnitsToggle />
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