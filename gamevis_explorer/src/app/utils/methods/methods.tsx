import { Annotation } from "../types/types";

export const getTags = (annotations: Annotation[]) => {
  return Object.entries(
    annotations
      .flatMap((item) => item.tags || [])
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);
};

// export const getItem = (annotations: Annotation[], key: keyof Annotation) => {
//   return Object.entries(
//     annotations
//       .flatMap((item) => item[key] || [])
//       .reduce((acc, tag) => {
//         acc[tag] = (acc[tag] || 0) + 1;
//         return acc;
//       }, {} as Record<string, number>)
//   ).sort((a, b) => b[1] - a[1]);
// };
