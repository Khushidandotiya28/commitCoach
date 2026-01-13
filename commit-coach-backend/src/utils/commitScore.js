export const calculateScore = (commits) => {
  if (commits < 10) return "Low";
  if (commits < 50) return "Medium";
  return "High";
};
