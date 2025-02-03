exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(req.user.toObject());
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
