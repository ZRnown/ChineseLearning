from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.permissions import AllowAny
from .models import Classic, FavoriteCategory, Favorite, Note, Comment, Like
from .serializers import (
    ClassicSerializer,
    FavoriteCategorySerializer,
    FavoriteSerializer,
    NoteSerializer,
    CommentSerializer,
    LikeSerializer,
)
import tencentcloud.common.credential as credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.tmt.v20180321 import tmt_client, models
import json

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


@api_view(['POST'])
@permission_classes([AllowAny])
def translate_view(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        text = data.get('text')
        target_language = data.get('target')

        if not text or not target_language:
            return Response({"error": "Missing 'text' or 'target' parameter"}, status=400)

        cred = credential.Credential(
            settings.TENCENT_SECRET_ID,
            settings.TENCENT_SECRET_KEY)

        clientProfile = ClientProfile()
        clientProfile.signMethod = "TC3-HMAC-SHA256"
        httpProfile = HttpProfile()
        httpProfile.endpoint = "tmt.tencentcloudapi.com"
        clientProfile.httpProfile = httpProfile
        client = tmt_client.TmtClient(cred, "ap-guangzhou", clientProfile)

        req = models.TextTranslateRequest()
        params = {
            "SourceText": text,
            "Source": "zh",
            "Target": target_language,
            "ProjectId": 0
        }
        req.from_json_string(json.dumps(params))

        resp = client.TextTranslate(req)
        resp_json = json.loads(resp.to_json_string())

        translated_text = resp_json.get("TargetText", "")

        return Response({"translation": translated_text})

    except TencentCloudSDKException as err:
        print(err)
        return Response({"error": str(err)}, status=500)
    except json.JSONDecodeError as e:
        return Response({"error": "Invalid JSON format in request body"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
