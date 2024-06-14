import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation} from 'framer-motion';


export default function ScrollRightAnimation({children}){
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true});
    const aniControl = useAnimation();

    useEffect(() => {
        if(isInView){
            aniControl.start("visible")
        }
    }, [isInView])

    return(
        <div ref={ref}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: -75 },
                    visible: { opacity: 1, x: 0 },
                }}
                initial="hidden"
                animate={aniControl}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                {children}
            </motion.div>
        </div>
    )
}