import { motion } from 'framer-motion';

interface StepProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={'w-full h-full'}
    >
      {children}
    </motion.div>
  );
}