const permissionMiddleware = (requiredPage, requiredAction) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
          data: null
        });
      }

      const hasPermission = user.permissions.some(perm => {
        const pageMatch = perm.page === requiredPage;
        const actionMatch = perm[requiredAction];
        return pageMatch && actionMatch;
      });

      if (!hasPermission) {
        return res.status(403).json({
          status: 'error',
          message: `You don't have permission to ${requiredAction} ${requiredPage}`,
          data: null
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Permission check failed',
        data: error.message
      });
    }
  };
};

module.exports = permissionMiddleware;
