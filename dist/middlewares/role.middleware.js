"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = roleGuard;
exports.isAdmin = isAdmin;
exports.isOrganizer = isOrganizer;
exports.isCustomer = isCustomer;
function roleGuard(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const userRole = req.user.role.toUpperCase();
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                error: 'Forbidden',
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
            });
            return;
        }
        next();
    };
}
// Helper untuk check specific role
function isAdmin(req) {
    return req.user?.role.toUpperCase() === 'ADMIN';
}
function isOrganizer(req) {
    return req.user?.role.toUpperCase() === 'ORGANIZER';
}
function isCustomer(req) {
    return req.user?.role.toUpperCase() === 'CUSTOMER';
}
