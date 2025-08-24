import { useState } from 'react';

const useBulletPoints = (initialBulletPoints = []) => {
  const [bulletPoints, setBulletPoints] = useState(initialBulletPoints);

  const addBulletPoint = () => {
    const newBulletPoints = [...bulletPoints, ''];
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  const updateBulletPoint = (index, value) => {
    const newBulletPoints = [...bulletPoints];
    newBulletPoints[index] = value;
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  const removeBulletPoint = (index) => {
    const newBulletPoints = bulletPoints.filter((_, i) => i !== index);
    setBulletPoints(newBulletPoints);
    return newBulletPoints;
  };

  return {
    bulletPoints,
    addBulletPoint,
    updateBulletPoint,
    removeBulletPoint,
  };
};

export default useBulletPoints;