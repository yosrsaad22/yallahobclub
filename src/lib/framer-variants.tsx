export const platformBentoVariants1 = {
  initial: {
    x: 0,
  },
  animate: {
    x: 10,
    rotate: 2,
    transition: {
      duration: 0.2,
    },
  },
};
export const platformBentoVariants2 = {
  initial: {
    x: 0,
  },
  animate: {
    x: -10,
    rotate: -2,
    transition: {
      duration: 0.2,
    },
  },
};

export const platformBentoVariants3 = {
  initial: {
    x: 20,
    rotate: -5,
  },
  hover: {
    x: 0,
    rotate: 0,
  },
};

export const platformBentoVariants4 = {
  initial: {
    x: -20,
    rotate: 5,
  },
  hover: {
    x: 0,
    rotate: 0,
  },
};

export const backgroundGradientVariants = {
  initial: {
    backgroundPosition: '0 50%',
  },
  animate: {
    backgroundPosition: ['0, 50%', '100% 50%', '0 50%'],
  },
};

export const freeCourseVariants1 = {
  initial: {
    opacity: 1,
    scale: 1,
    y: '5%',
  },
  animate: {
    scale: 1.2,
    x: '53%',
    y: '0%',
    transition: { duration: 0.6, delay: 1 },
  },
};

export const freeCourseVariants2 = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    z: 0,
    transition: { duration: 0.6, delay: 0.7 },
  },
};

export const freeCourseVariants3 = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    z: 0,
    transition: { duration: 0.6 },
  },
};
