export const handleError = async (err, req, res, next) => {
  console.log("Error occured:", err);

  return res.status(500).json({ message: err.message });
};
