from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Classic, FavoriteCategory, Favorite, Note, Comment, Like


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


class ClassicSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    user_note = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Classic
        fields = "__all__"

    def get_is_favorite(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_user_note(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            note = obj.notes.filter(user=request.user).first()
            return note.content if note else None
        return None

    def get_like_count(self, obj):
        return obj.likes.count()


class FavoriteCategorySerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = FavoriteCategory
        fields = ("id", "name", "count")

    def get_count(self, obj):
        return obj.favorites.count()


class FavoriteSerializer(serializers.ModelSerializer):
    classic = ClassicSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ("id", "classic", "category")


class NoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ("id", "user", "content", "created_at", "updated_at")


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "user", "content", "created_at", "updated_at")


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("id", "created_at")
