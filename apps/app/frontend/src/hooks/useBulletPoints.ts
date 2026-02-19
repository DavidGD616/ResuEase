import { useState } from 'react';

const useBulletPoints = (initialBulletPoints: string[] = []) => {
  const [bulletPoints, setBulletPoints] = useState<string[]>(initialBulletPoints);

  const addBulletPoint = (): string[] => {
    const newBulletPoints = [...bulletPoints, ''];
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  const updateBulletPoint = (index: number, value: string): string[] => {
    const newBulletPoints = [...bulletPoints];
    newBulletPoints[index] = value;
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  const removeBulletPoint = (index: number): string[] => {
    const newBulletPoints = bulletPoints.filter((_, i) => i !== index);
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  return { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint };
};

export default useBulletPoints;
