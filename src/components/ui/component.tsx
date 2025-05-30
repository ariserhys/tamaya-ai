"use client";

import { motion } from "framer-motion";
import { Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    onTryClick,
    developerUrl = "https://thedevabhishekyadav.vercel.app/"
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    onTryClick?: () => void;
    developerUrl?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/[0.08] via-transparent to-[#0071E3]/[0.08] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-[#0071E3]/[0.2]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-[#0071E3]/[0.2]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-[#0071E3]/[0.2]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-[#0071E3]/[0.2]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-[#0071E3]/[0.2]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-sm mb-8 md:mb-12 shadow-lg shadow-blue-900/10"
                    >
                        <Circle className="h-2.5 w-2.5 fill-[#0071E3] animate-pulse" />
                        <span className="text-sm md:text-base text-white/70 tracking-wide font-medium">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight leading-[1.1]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-[#3399FF] via-white/90 to-[#0071E3] drop-shadow-sm"
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-white/60 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                            Your personal AI learning companion. 
                            <span className="hidden sm:inline"> </span>
                            <span className="block sm:inline">Master complex subjects with interactive lessons tailored to your learning style.</span>
                        </p>
                    </motion.div>

                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row justify-center gap-5 mt-6"
                    >
                        <button 
                            onClick={onTryClick}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#0071E3] to-[#3399FF] text-white font-medium text-base md:text-lg hover:shadow-xl hover:shadow-[#0071E3]/30 transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105 active:scale-95"
                        >
                            Try Tamaya AI
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </button>
                        
                        <a 
                            href={developerUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white/90 border border-white/20 font-medium text-base md:text-lg hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-2 hover:border-white/30 transform hover:scale-105 active:scale-95"
                        >
                            Developer
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Mobile swipe indicator */}
            <motion.div 
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/40 sm:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                        delay: 2.5,
                        duration: 0.8 
                    }
                }}
            >
                <div className="w-10 h-1.5 bg-white/20 rounded-full mb-2 animate-pulse" />
                <span className="text-xs">Swipe to explore</span>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/90 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric } 