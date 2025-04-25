import {
  closestCorners,
  CollisionDetection,
  rectIntersection,
} from "@dnd-kit/core";

/**
 * 1) repère la colonne sous le curseur
 * 2) applique closestCorners sur cette colonne + ses cartes
 */
export const containerAwareCollision: CollisionDetection = (args) => {
  const { droppableContainers } = args;

  /* colonne sous le pointeur */
  const first = rectIntersection(args)[0];
  const column = first
    ? droppableContainers.find((c) => c.id === first.id)
    : null;

  if (!column || column.data?.current?.type !== "column") {
    /* drag horizontal ou hors-colonne → algo normal */
    return closestCorners(args);
  }

  /* liste des cartes dans cette colonne */
  const withinColumn = droppableContainers.filter(
    (c) => c.data?.current?.columnId === column.id || c.id === column.id
  );

  return closestCorners({ ...args, droppableContainers: withinColumn });
};
