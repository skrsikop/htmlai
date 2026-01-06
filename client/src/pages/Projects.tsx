import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Project } from "../types"
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from "lucide-react"
import Sidebar from "../components/Sidebar"
import ProjectPreview, { type ProjectPreviewRef } from "../components/ProjectPreview"
import { toast } from "sonner"
import api from "@/configs/axios"
import { authClient } from "@/lib/auth-client"

const Projects = () => {
  const {projectId} = useParams()
  const navigate =  useNavigate()
  const previewRef = useRef<ProjectPreviewRef>(null)
  const {data: session, isPending} = authClient.useSession()
  // states 
  const [ project, setProject] = useState<Project | null>(null)
  const [ loading , setLoading] = useState(true)
  const [ isGenerating, setIsGenerating] = useState(true)
  const [ device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')
  const [ isMenuOpen, setIsMenuOpen] = useState(false)
  const [ isSaving, setIsSaving] = useState(false)

  // funtions 
  const fetchProject = async () => {
      try {
          const {data} = await api.get(`/api/user/project/${projectId}`)
          setProject(data.project)
          setIsGenerating(data.project.current_code ? false : true)
          setLoading(false)
      } catch (error: any) {
                toast.error(error?.response?.data?.message || error.message)
                console.log(error)
      }
  }

  // const previewProject = async () => {
  //   try {
  //     const {data} = await api.get(`/api/project/preview/${projectId}`)
  //     setProject(data.project)
  //     setIsGenerating(false)
  //     setLoading(false)
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || error.message)
  //     console.log(error)
  //   }
  // }
  const saveProject = async () => {
    if(!previewRef.current) return;
    const code = previewRef.current.getCode();
    if(!code) return;
    setIsSaving(true)
    try {
      const {data} = await api.put(`/api/project/save/${projectId}`, {code})
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)  
    } finally {
      setIsSaving(false)
    }
  }
  // download code (index.html)
  const downloadCode = () => {
    const code = previewRef.current?.getCode() || project?.current_code
    if(!code) {
      if(isGenerating) {
        return
      }
      return
    }
    const element = document.createElement('a')
    const file = new Blob([code], {type: "text/html"})
    element.href = URL.createObjectURL(file)
    element.download = 'index.html'
    document.body.appendChild(element)
    element.click()
  }

  const togglePublish = async () => {
    try {
      const {data} = await api.get(`/api/user/publish-toggle/${projectId}`)
      toast.success(data.message)
      setProject((prev) => prev? ({...prev, isPublished: !prev.isPublished}) : null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)  
    }
  }

  useEffect(() => {
    if(session?.user) {
      fetchProject()
    } else if(!isPending &&  !session?.user) {
      navigate('/')
      toast('Please sign in to view your projects')
    }
  }, [session?.user])
  useEffect(() => {
    if(project && !project?.current_code) {
      const intervlId = setInterval(() => {
        fetchProject
      }, 1000);
      return () => clearInterval(intervlId);
    }
  }, [project])

  // loading 
  if(loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Loader2Icon className="size-7 animate-spin  text-violet-200" />
        </div>
      </>
    )
  }

  // component main 
  return project ? (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
        {/* builder navbar  */}
        <div className="flex max-sm:flex-col sm:items-center gap-4 no-scrollbar px-4 py-2">
          {/* left */}
          <div className="flex gap-2 items-center accent-red-200 sm:min-w-90 text-nowrap">
            {/* logo  */}
            <img src='/favicon.svg' alt="favicon" className="h-6 cursor-pointer" onClick={() => navigate('/')} />
            {/* project name & description */}
            <div className="max-w-64 sm:max-w-xs">
              <p className="text-sm font-medium capitalize truncate">{project.name}</p>
              <p className="text-xs text-gray-400 -mt-0.5">Previewing last saved version.</p>
            </div>
            {/* menu button  */}
            <div className="sm:hidden flex-1 flex justify-end">
              {isMenuOpen ? <MessageSquareIcon onClick={() => setIsMenuOpen(false)} className="size-6 cursor-pointer" /> : <XIcon onClick={() => setIsMenuOpen(true)}  className="size-6 cursor-pointer" />}
            </div>
          </div>
          {/* middle  */}
          <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
            <SmartphoneIcon className={`size-6 p-1 rounded cursor-pointer ${device === 'phone' ? "bg-gray-700" : ""}`} onClick={() => setDevice('phone')} />
            <TabletIcon className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? "bg-gray-700" : ""}`} onClick={() => setDevice('tablet')} />

            <LaptopIcon className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? "bg-gray-700" : ""}`} onClick={() => setDevice('desktop')} />
          </div>
          {/* right  */}
          <div className="flex items-center justify-end sm:text-sm gap-3 flex-1 text-xs">
            {/* save button  */}
              <button onClick={saveProject} disabled={isSaving} className="max-sm:hidden  bg-gray-800 hover:bg-gray-700 rounded text-white px-3.5 py-1 sm:rounded-sm transition-colors flex items-center gap-2 border border-gray-700">
                {isSaving ? <Loader2Icon size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                 Save
              </button>
              {/* preview link  */}
              <Link className="flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border  border-gray-700 hover:border-gray-500  transition-colors" to={`/preview/${projectId}`} target="_blank">
                <FullscreenIcon size={16} />  Preview
              </Link>
              {/* download button  */}
              <button onClick={downloadCode} className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-es-md transform-colors">
               <ArrowBigDownDashIcon size={16} />  Download
              </button>
              {/* publish buttpon  */}
              <button onClick={togglePublish} className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-es-md transform-color">
                {
                  project.isPublished ? 
                  <EyeOffIcon size={16} /> : <EyeIcon size={16} />
                }
                {
                  project.isPublished ? "Unpublish" : "Publish"
                }
              </button>

          </div>
        </div>

        {/* editor and chat AI  */}
        <div className="flex-1 flex overflow-auto">
          {/* sidebar  */}
            <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />

          {/* project preview  */}
          <div className="flex-1 p-2 pl-0">
                <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
          </div>
        </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-medium text-gray-200">Unable to load a project</p>
    </div>
  )
}

export default Projects
