from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Admins have full access.
    Regular users have access only to objects they own.
    """

    def has_permission(self, request, view):
        # Must be authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.is_admin():
            return True

        # Safe methods (GET, HEAD, OPTIONS) are allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        # Others: only if the user “owns” the object
        return obj.assigned_to_id == request.user.id
