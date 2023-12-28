import { Dispatch, RefObject, SetStateAction } from "react";

export function handleSectionScrolling(
  resultsDataRef: RefObject<HTMLDivElement>,
  visualizationRef: RefObject<HTMLDivElement>,
  setCurrentSection: Dispatch<SetStateAction<string>>): () => void
{
  const resultsDataNode = resultsDataRef.current;
  const visualizationNode = visualizationRef.current;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setCurrentSection(entry.target.id);
      }
    });
  }, { threshold: 0.5 });

  if (resultsDataNode) {
    observer.observe(resultsDataNode);
  }

  if (visualizationNode) {
    observer.observe(visualizationNode);
  }

  return () => {
    if (resultsDataNode) {
      observer.unobserve(resultsDataNode);
    }

    if (visualizationNode) {
      observer.unobserve(visualizationNode);
    }
  };
};