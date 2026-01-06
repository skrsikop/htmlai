import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";

const Community = () => {
      const [loading, setLoading] = useState(true);
      const [projects, setProjects] = useState<Project[]>([]);
      const fetchProjects = async () => {
        // data 
        try {
            const {data} =  await api.get('/api/project/published')
            setProjects(data.project)
            setLoading(false)
        } catch (error: any) {
          toast.error(error?.response?.data?.message || error.message)
          console.log(error)
        }
      }

 
      useEffect(() => {
        fetchProjects();
      })
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2Icon className="size-7 animate-spin text-indigo-200" />
        </div>
      ): projects.length > 0 ? (
        <div className="py-10 min-h-[80vh]">
          {/* title  */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-medium text-white">Published projects</h1>
          </div>

          {/* projects componet  */}
          <div className="flex flex-wrap gap-3.5">
            {projects.map((project) => (
              <Link to={`/view/${project.id}`} target="_blank" key={project.id} className="relative group max-sm:mx-auto cursor-pointer border border-gray-700 rounded-lg  w-72 bg-gray-900/60  overflow-hidden   hover:border-indigo-800/80 transition-all duration-300">
                {/* desktop like mini preview  */}
                <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                  {project.current_code ? (
                    <iframe 
                      srcDoc={project.current_code}
                      className="absolute top-0 bottom-0 w-300 h-200 origin-top-left pointer-events-none"
                      sandbox="allow-scripts allow-same-origin"
                      style={{transform: 'scale(0.25)'}}
                    />
                  ): (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No Preview</p>
                    </div>
                  )}
                </div>

                {/* content  */}
                <div className="p-4 text-white bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors">
                  <div className="flex items-start justify-between">
                    <h2>{project.name}</h2>
                    <button className="px-2.5 text-xs rounded-full  py-0.5 bg-gray-800 border border-gray-700 mt-1 ml-1">
                      Website 
                    </button>
                  </div>

                  <p className="text-gray-400 mt-1 text-sm line-clamp-2">{project.initial_prompt}</p>

                  <div  className="flex items-center justify-between mt-6">
                    <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-3  text-white text-sm">
                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 transition-all rounded-md flex items-center gap-2">
                        <span>{project.user?.name?.slice(0,1)}</span>
                        {project.user?.name}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ): (
        <div className="flex flex-col py-20 h-full items-center justify-center mx-auto mt-40 gap-6">
          <h1 className="text-2xl text-center font-medium text-white"> No Projects yet!</h1>
        </div>
      )}
    </div>
  )
}

export default Community
 