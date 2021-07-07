// from https://non-traditional.dev/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5

import { useEffect, useRef, useState } from "react";

export const useIntersect = (
  callback,
  { root = null, rootMargin = "0px", threshold = 0 },
) => {
  const [nodes, setNodes] = useState([]);

  const observer = useRef(
    new window.IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold,
    }),
  );

  const addNode = (node) => {
    if (!nodes.includes(node)) {
      setNodes((prevNodes) => {
        return [...prevNodes, node];
      });
    }
  };

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (nodes) {
      nodes.map((node) => currentObserver.observe(node));
    }

    return () => currentObserver.disconnect();
  }, [nodes]);

  return [addNode, nodes];
};
