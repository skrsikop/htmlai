import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { authClient } from "@/lib/auth-client";
import {UserButton} from '@daveyplate/better-auth-ui'
import { toast } from "sonner";
import api from "@/configs/axios";

export default function Navbar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [credits, setCredits] = useState(0);
    const navlinks = [
        {
            href: "/",
            text: "Home",
        },
        {
            href: "/myprojects",
            text: "MyProjects",
        },
        {
            href: "/community",
            text: "Community",
        },
        {
            href: "/pricing",
            text: "Pricing",
        },
    ];
    const {data: session} = authClient.useSession();

    const getCredits = async() => {
        try {
            const {data} = await api.get('/api/user/credits')
            setCredits(data.credits)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if(session?.user) {
            getCredits()
        }
    }, [session?.user])
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <NavLink to="/">
                    <img className=" w-75 h-full" src={assets.logo} width={138} height={36} alt="logo" />
                </NavLink>

                <div className="hidden lg:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        <Link key={link.href} to={link.href} className="hover:text-slate-300 transition">
                            {link.text}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:block space-x-3">
                   {
                    !session?.user ? (
                         <button onClick={() => navigate('/auth/login')} className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95">
                        Login
                    </button>
                    ) : (
                        <>
                            
                            <button className="bg-white/10 px-5 text-gray-200 py-1.5 text-xs sm:text-sm border rounded-full">Credits: <span className="text-indigo-300">{credits}</span></button>
                            <UserButton size='icon' />
                        </>
                    )
                   }
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link) => (
                    <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                        {link.text}
                    </Link>
                ))}
                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}