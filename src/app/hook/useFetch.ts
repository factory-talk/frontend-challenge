'use client'

import { useCallback, useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

export default function useFetch<T>(
  url: string,
  initialParams: Record<string, any> = {}
) {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [params, setParams] = useState(initialParams)

  const fetchData = useCallback(
    async (customParams?: Record<string, any>) => {
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get<T>(url, {
          params: customParams ?? params,
        })
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [url, params]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = () => fetchData()
  const refetchWithParams = (newParams: Record<string, any>) => {
    setParams(newParams)
    fetchData(newParams)
  }

  return { data, loading, error, refetch, refetchWithParams }
}
