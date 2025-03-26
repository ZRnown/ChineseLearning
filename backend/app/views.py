from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Classic, FavoriteCategory, Favorite, Note, Comment, Like
from .serializers import (
    ClassicSerializer,
    FavoriteCategorySerializer,
    FavoriteSerializer,
    NoteSerializer,
    CommentSerializer,
    LikeSerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ClassicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Classic.objects.all()
    serializer_class = ClassicSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def favorite(self, request, pk=None):
        classic = self.get_object()
        favorite, created = Favorite.objects.get_or_create(
            user=request.user, classic=classic
        )
        if not created:
            favorite.delete()
        return Response({"status": "success"})

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def like(self, request, pk=None):
        classic = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, classic=classic)
        if not created:
            like.delete()
        return Response({"status": "success"})

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def note(self, request, pk=None):
        classic = self.get_object()
        note, created = Note.objects.get_or_create(
            user=request.user,
            classic=classic,
            defaults={"content": request.data.get("content", "")},
        )
        if not created:
            note.content = request.data.get("content", note.content)
            note.save()
        return Response(NoteSerializer(note).data)


class FavoriteCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return FavoriteCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Comment.objects.filter(classic_id=self.kwargs["classic_pk"]).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        classic = get_object_or_404(Classic, pk=self.kwargs["classic_pk"])
        serializer.save(user=self.request.user, classic=classic)
