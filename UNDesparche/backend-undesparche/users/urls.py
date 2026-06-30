from django.urls import path
from .views import me

app_name = "users"

urlpatterns = [
    path("me/", me, name="users-me"),
]
