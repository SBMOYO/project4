
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #API CALLS
    path("follow", views.followers, name="follow"),
    path("following", views.following, name="following"),
    path("post", views.post, name="post"),
    path("showPost", views.showPost, name="showPost"),
    path("like", views.like, name="like"),
    path("addFollow", views.addFollow, name="addFollow"),
    path("showFollowingPost", views.showFollowingPost, name="showUsersPost"),
    path("showUsersPost", views.showUsersPost, name="showUsersPost"),
    path("isFollowed", views.isFollowed, name="isFollowed"),
    path("followCreator", views.followCreator, name="followCreator"),
    path("unfollow", views.unfollow, name="unfollow"),
]

