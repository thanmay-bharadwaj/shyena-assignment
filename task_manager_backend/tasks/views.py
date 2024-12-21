from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, TaskSerializer
from .models import Task
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TaskSerializer
from rest_framework.exceptions import PermissionDenied


# User Registration View
class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Custom Login View (JWT)
class CustomLoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]  # Allow anyone to access login

    def post(self, request, *args, **kwargs):
        # Extract username and password from request data
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is not None:
            # User is authenticated, now create JWT token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Return the token pair (access and refresh)
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
            })

        # Return error if authentication fails
        return Response({'detail': 'Invalid credentials'}, status=401)


# Fetch all tasks for authenticated user
class TaskListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)       

        

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Ensure that users can only access their own tasks
        return Task.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Custom update logic
        task = self.get_object()
        if task.user == self.request.user:
            serializer.save(user=self.request.user)
        else:
            raise PermissionDenied("You are not allowed to update this task.")
        
    def perform_destroy(self, instance):
        # Custom delete logic
        if instance.user == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You are not allowed to delete this task.")
