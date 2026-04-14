const pathNormalize = (path: string) => {
  const slicees = path
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/\.{3,}/g, '..')
    .replace(/\/\.\//g, '/')
    .split('/')
    .map((point: string) => point.trim());
  const isCurrentSlice = (slice: string) => slice === '.';
  const isParentSlice = (slice: string) => slice === '..';
  const points: Array<string> = [];
  let inPoints = false;
  const push = (point: string) => {
    points.push(point);
  };
  const back = () => {
    if (points.length === 0) return;
    const lastSlice = points[points.length - 1];
    if (isParentSlice(lastSlice)) {
      points.push('..');
    } else {
      points.pop();
    }
  };
  slicees.forEach(slice => {
    const isCurrent = isCurrentSlice(slice);
    const isParent = isParentSlice(slice);
    if (!inPoints) {
      push(slice);
      inPoints = !isCurrent && !isParent;
      return;
    }
    if (isCurrent) return;
    if (isParent) return back();
    push(slice);
  });
  return points.join('/');
};

export const pathJoin = (from: string, ...to: string[]) => pathNormalize([from, ...to].join('/'));
