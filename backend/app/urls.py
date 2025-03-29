from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"classics", views.ClassicViewSet)
router.register(
    r"favorite-categories", views.FavoriteCategoryViewSet, basename="favorite-category"
)
router.register(r"favorites", views.FavoriteViewSet, basename="favorite")

comment_router = DefaultRouter()
comment_router.register(r"comments", views.CommentViewSet, basename="comment")

urlpatterns = [
    path("", include(router.urls)),
    path("classics/<int:classic_pk>/", include(comment_router.urls)),
    path('api/translate/', views.translate_view, name='translate'),
]
