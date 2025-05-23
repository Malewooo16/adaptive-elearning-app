import { useMemo } from "react";
import { InlineMath } from "react-katex"; // Ensure you have react-katex installed

const useRenderMath = () => {
  return useMemo(() => (text: string) => {
    const parts = text.split(/(\$[^$]+\$)/g); // Splits text but keeps math parts

    return parts.map((part, index) =>
      part.startsWith("$") && part.endsWith("$") ? (
        <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>
      ) : (
        part
      )
    );
  }, []);
};

export default useRenderMath;
