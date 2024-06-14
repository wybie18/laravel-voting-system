import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation} from 'framer-motion';


export default function ScrollDownAnimation({children}){
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
                    hidden: { opacity: 0, y: -75 },
                    visible: { opacity: 1, y: 0 },
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