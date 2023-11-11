import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export const MultiTab = (
  props: React.PropsWithChildren<{ tabIdx: number }>
) => {
  const [prevIdx, setPrevIdx] = React.useState(-1);
  const [direction, setDirection] = React.useState(-1);

  React.useEffect(() => {
    if (prevIdx < props.tabIdx) {
      setDirection(-1);
    } else {
      setDirection(1);
    }
    setPrevIdx(props.tabIdx);
  }, [props.tabIdx]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        transition={{
          duration: 0.2,
        }}
        key={props.tabIdx}
        initial={{ y: direction * 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: direction * -300, opacity: 0 }}
      >
        {props.children && props.children[props.tabIdx]}
      </motion.div>
    </AnimatePresence>
  );
};
