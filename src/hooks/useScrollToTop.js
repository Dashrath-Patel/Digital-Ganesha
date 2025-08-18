import { useCallback } from 'react';

const useScrollToTop = () => {
  const scrollToTop = useCallback((behavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, []);

  const scrollToElement = useCallback((elementId, behavior = 'smooth', offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        left: 0,
        behavior
      });
    }
  }, []);

  const scrollToPosition = useCallback((position, behavior = 'smooth') => {
    window.scrollTo({
      top: position,
      left: 0,
      behavior
    });
  }, []);

  return {
    scrollToTop,
    scrollToElement,
    scrollToPosition
  };
};

export default useScrollToTop;
