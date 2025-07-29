from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """ Allows access only to admin users. """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin()

class IsOwnerOrAdmin(permissions.BasePermission):
    """ Allows access only to the object's owner or an admin user. """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user, so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Write permissions are only allowed to the owner of the snippet or admin.
        return (obj.user == request.user or
                (request.user and request.user.is_authenticated and request.user.is_admin()))
