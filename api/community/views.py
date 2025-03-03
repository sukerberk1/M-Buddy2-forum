from django.shortcuts import render, get_object_or_404
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.serializers import ShortUserSerializer
from .models import Tag, Post
from .serializers import PostSerializer, CommentSerializer, CreatePostSerializer

# Create your views here.

class post_viewset(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    # Viewset handles reading posts by default, so this serializer is set as default
    serializer_class = PostSerializer
    
    def create(self, request, *args, **kwargs):
        #get auth info
        auth = JWTAuthentication()
        user, token = auth.authenticate(self.request)
        #resort tags
        tag_names = request.data['tags'].replace(',',' ').split()
        tags = []
        for tag_name in tag_names:
            t, created =Tag.objects.get_or_create(name=tag_name)
            tags.append(t.id)
        serializer = CreatePostSerializer(data={
            'title':request.data['title'],
            'description': request.data['description'],
            'author': user.id,
            'tags': tags
        })
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = []
        else:
            permission_classes = (IsAuthenticated,)
        return [permission() for permission in permission_classes]
    

class AddPost(generics.CreateAPIView):
    serializer_class = CreatePostSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        #get auth info
        auth = JWTAuthentication()
        user, token = auth.authenticate(self.request)
        #resort tags
        tag_names = request.data['tags'].replace(',',' ').split()
        tags = []
        for tag_name in tag_names:
            t, created =Tag.objects.get_or_create(name=tag_name)
            tags.append(t.id)
        serializer = self.get_serializer(data={
            'title':request.data['title'],
            'description': request.data['description'],
            'author': user.id,
            'tags': tags
        })
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class LikePost(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def partial_update(self, request, *args, **kwargs):
        auth = JWTAuthentication()
        user, token = auth.authenticate(self.request)
        # view requires post id as request body
        post = get_object_or_404(Post, id=request.data['id'])
        if post.likes.contains(user):
            post.likes.remove(user)
        else:
            post.likes.add(user)
        serializer = self.get_serializer(post)
        return Response(serializer.data ,status=status.HTTP_202_ACCEPTED)
    


#TODO: test
class AddComment(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        #get auth info
        auth = JWTAuthentication()
        user, token = auth.authenticate(self.request)
        # request.data['id'] is the post id that comment is related to
        serializer = self.get_serializer(data={
            'text':request.data['text'],
            'post': request.data['id'],
            'author': user.id,
        })
        serializer.is_valid(raise_exception=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
