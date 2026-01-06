import { useState } from "react";
import { appPlans } from "../assets/assets";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/configs/axios";


interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
  popular: boolean;
}

  
const Pricing = () => {
  const [plan] = useState<Plan[]>(appPlans);
  const {data: session} = authClient.useSession()
  
  const handlePurchase = async(planId: string) => {
    try {
      if(!session?.user) return toast('Please login in to purchase credits')
      const {data} = await api.post('/api/user/purchase-credits', {planId})
    window.location.href = data.payment_link
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    }
  }
  return (
    <div>
      <div className="w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh] ">
        {/* title and desc  */}
        <div className="text-center mt-16">
          <h1 className="text-gray-100 text-3xl  font-medium">Choose Your Plan</h1>
          <p className="text-gray-400 max-md:px-5 text-sm max-w-md mx-auto mt-2">Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
        </div>
         {/* pricing crad section */}
         {/* Cards */}
        <div className="grid gap-8  lg:grid-cols-3 md:grid-cols-2 md:px-10 lg:px-0 max-md:px-10">
          {plan.map((plan) => (
            <div
              key={plan.id}
              className={`relative mt-20 rounded-2xl p-8 bg-linear-to-b from-zinc-900 to-zinc-950 border
              ${
                plan.popular
                  ? "border-indigo-400 shadow-cyan-500/20 md:scale-110  md:z-10 shadow-2xl"
                  : "border-zinc-800"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-indigo-100 text-black text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-white text-xl font-medium mb-2">
                {plan.name}
              </h3>

              <p className="text-gray-400 text-sm mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 text-sm ml-2">
                  / one-time
                </span>
              </div>

              <div className="text-indigo-300 font-semibold mb-6">
                {plan.credits.toLocaleString()} Credits
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-300"
                  >
                    <span className="text-indigo-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
              onClick={() => handlePurchase(plan.id)}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition
                ${
                  plan.popular
                    ? "bg-indigo-200  text-black hover:bg-indigo-300"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-sm mt-10 max-w-md  mx-auto font-light">Project <span className="font-bold">  Creation / Revision consume 5 credits</span> . You can purchase more credits to create more projects</p>
    </div>
  )
}

export default Pricing
