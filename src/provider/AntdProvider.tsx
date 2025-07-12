"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { PropLayout } from "../interface/prop-layout";

export const AntdProvider = ({ children }: PropLayout) => {
    return (
        <AntdRegistry>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </AntdRegistry>
    );
};
