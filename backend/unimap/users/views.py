from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import mixins
from .serializers import *
from .models import *
import jwt
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.exceptions import AuthenticationFailed, ValidationError, PermissionDenied
import datetime
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from rest_framework import status

# Create your views here.

# Logging in and Authentication

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_active = True
        user.set_password(request.data.get('password'))
        user.save()

        response = Response()
        response.data = {
            "user_data": serializer.data
        }
        return response

# Authentication with JWT tokens.
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed('Incorrect email/username or password!')

        if user is None:
            raise AuthenticationFailed('Incorrect email/username or password!')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect email/username or password!')
        
        if not user.is_active:
            raise AuthenticationFailed("Account is not activated. Please verify your email.")
        
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

        response = Response()
        response.data = {
            'jwt': token
        }

        return response

class TokenRemainingTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return Response({"detail": "No Bearer token found."}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split()[1]

        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=["HS256"],  # PyJWT 2.x
            )
        except jwt.ExpiredSignatureError:
            # Token is expired
            return Response(
                {"remaining_seconds": 0, "expired": True},
                status=status.HTTP_200_OK,
            )
        except jwt.InvalidTokenError:
            return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        exp = payload["exp"]  # unix timestamp (int)
        now = datetime.datetime.now(datetime.timezone.utc)
        exp_dt = datetime.datetime.fromtimestamp(exp, tz=datetime.timezone.utc)

        remaining = max(0, int((exp_dt - now).total_seconds()))

        return Response(
            {
                "remaining_seconds": remaining,
            }
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Expect Authorization: Bearer <token>
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header:
            return Response({"detail": "Authorization header missing."},
                            status=status.HTTP_400_BAD_REQUEST)

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return Response({"detail": "Invalid Authorization header."},
                            status=status.HTTP_400_BAD_REQUEST)

        token = parts[1].strip()

        # Try to decode to read exp (but don't fail logout if decode fails)
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
            exp_ts = payload.get('exp')
            if exp_ts:
                expires_at = datetime.datetime.fromtimestamp(exp_ts, tz=datetime.timezone.utc)
            else:
                # fallback: short expiration from now
                expires_at = timezone.now() + datetime.timedelta(minutes=60)
        except jwt.PyJWTError:
            # Token is invalid/expired — still create a short-lived revocation so future attempts fail fast
            expires_at = timezone.now() + datetime.timedelta(minutes=5)

        # Save revoked token (ignore unique error if already revoked)
        try:
            RevokedToken.objects.create(token=token, expires_at=expires_at)
        except Exception:
            # already revoked or race — ignore
            pass

        return Response({"message": "success"}, status=status.HTTP_200_OK)


class UserView(mixins.ListModelMixin, mixins.RetrieveModelMixin, generics.GenericAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)