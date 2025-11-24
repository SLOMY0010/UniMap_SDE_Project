from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt
from .models import User, RevokedToken

"""
This is to set the request.user after authentication.
"""

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):

        if request.path in settings.JWT_EXEMPT_PATHS:
            return None

        token = None

        # 1) Try to get the token from the Authorization header sent from the frontend
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            # No credentials supplied; let DRF try other auth or return 401 via permissions
            return None
        
        if RevokedToken.objects.filter(token=token).exists():
            raise AuthenticationFailed("Token has been revoked.")
        
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token')

        user = User.objects.get(id=payload['id'])
        return (user, None)
