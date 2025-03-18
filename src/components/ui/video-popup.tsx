'use client';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { IconX } from '@tabler/icons-react';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPopupProps {
  videoUrl: string;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ videoUrl }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed bottom-0 z-[99999] m-6 h-[150px] w-[250px]  rounded-md border-2 border-gray-400/[0.4] bg-dark/20 p-3 shadow-lg backdrop-blur md:left-0 md:h-[230px] md:w-[390px] ">
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-primary p-1 text-primary-foreground hover:bg-primary/80 hover:text-white">
            <IconX className="h-4 w-4" />
          </button>
          <ReactPlayer url={videoUrl} playing={true} muted={true} controls width="100%" height="100%" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPopup;
