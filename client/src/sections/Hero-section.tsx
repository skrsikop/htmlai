import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HeroSection() {
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const {data: session} = authClient.useSession();
      const navigate = useNavigate();

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(!session?.user) {
                return toast.error('Please sign in to create a project')
            } else if(!input.trim()) {
                return toast.error('Please enter a message')
            }
            setLoading(true)
            const {data} = await api.post('/api/user/project', {initial_prompt: input})
            navigate(`/project/${data.projectId}`)
        } catch (error: any) {
            setLoading(false)
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
        }
        
        // simulate api call 
        setTimeout(() => {
            setLoading(false)
        }, 3000);
     }
    return (
        <section className="flex flex-col items-center -mt-18">
            <motion.svg className="absolute -z-10  w-full -mt-40 md:mt-0" width="1440" height="676" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5}}
                        >
                            <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#a)" />
                            <defs>
                                <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
                                    <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
                                    <stop offset="1" stopColor="#372AAC" />
                                </radialGradient>
                            </defs>
                        </motion.svg>
            <motion.a className="flex  items-center mt-48 max-md:mt-38 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Make HTML Websites with skrsikop AI</span>
            </motion.a>
            <motion.h1 className="text-center text-4xl leading-12 md:text-6xl md:leading-17.5 mt-4 font-semibold max-w-2xl"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                Let's build AI Beutiful HTML Websites
            </motion.h1>
            <motion.p className="text-center text-base max-w-lg mt-2"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                Our platform helps you build, test, and deliver faster — Create, customize and publish website faster than ever with our AI Site Builder.
            </motion.p>
             <form onSubmit={onSubmitHandler} className="bg-blue-500/5 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-1 ring-indigo-500 transition-all">
          <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-indigo-600 rounded-md px-4 py-2">
            {!loading ? " Create with AI": (
                <>
                    Creating <Loader2Icon className="animate-spin size-4 text-white" />
                </>
            )}
           
          </button>
        </form>
        
        </section>
    );
}