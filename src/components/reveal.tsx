"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({children,delay=0,className=""}:{children:ReactNode;delay?:number;className?:string}) {
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.65,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
export function Stagger({children,className=""}:{children:ReactNode;className?:string}) {
 const reduce=useReducedMotion();
 return <motion.div className={className} initial="hidden" whileInView="show" viewport={{once:true,amount:.12}} variants={{hidden:{},show:{transition:{staggerChildren:reduce?0:.09}}}}>{children}</motion.div>;
}
export function StaggerItem({children,className=""}:{children:ReactNode;className?:string}) {
 return <motion.div className={className} variants={{hidden:{opacity:0,y:18},show:{opacity:1,y:0,transition:{duration:.5}}}}>{children}</motion.div>;
}
