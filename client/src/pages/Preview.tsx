import { useEffect, useState } from "react"
import {  useParams } from "react-router-dom"
import { Loader2Icon } from "lucide-react"
import api from "@/configs/axios"
import type {  Version } from "../types"
import { authClient } from "@/lib/auth-client"

const Preview = () => {
  const { projectId, versionId } = useParams()
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const {data: session, isPending} = authClient.useSession()

  const fetchCode = async () => {
      try {

        const { data } = await api.get(`/api/project/preview/${projectId}`)
        setCode(data.project.current_code)
        if(versionId) {
          data.project.versions.forEach((version: Version) => {
            if(version.id === versionId) {
              setCode(version.code)
            }
          })
        }
        setLoading(false)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load preview")
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
        if(!isPending && session?.user) {
          fetchCode();
        }
      }, [session?.user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-300" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        {error}
      </div>
    )
  }

  return (
    <iframe
      title="Project Preview"
      srcDoc={code}
      className="w-screen h-screen border-none bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}

export default Preview
