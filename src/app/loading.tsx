'use client'
import React from 'react'
import { Circles } from 'react-loader-spinner';

function Loading() {
  return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'top', height: '100vh', paddingTop: '100px', width: '100%' }}>
    <Circles
			height="80"
			width="80"
			color="#4fa94d"
			ariaLabel="circles-loading"
			wrapperStyle={{}}
			wrapperClass=""
			visible={true}
			/>
  </div>);
}

export default Loading