from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    image = models.ImageField(upload_to='images/', default="profilepic.jpg")

    def __str__(self):
        return self.username


class Post(models.Model):
    post = models.CharField(max_length=500)
    post_user = models.ForeignKey("User", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)


    def serialize(self):
        return {
            "id": self.id,
            "post": self.post,
            "post_user": self.post_user.username,
            "post_user_id": self.post_user.id,
            "timestamp": self.timestamp.strftime('%a %d %b %Y, %I:%M%p')
        }

    def __str__(self):
        return self.post



class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
    followed_user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followers")

    def serialize(self):
        return {
            "id": self.id,
            "follower": self.follower.id,
            "followed_user": self.followed_user.id
        }

    def __str__(self):
        return  f"{self.followed_user} is followed by {self.follower}"



class Like(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)

    def serialize(self):
        return {
            "id": self.id,
            "post": self.post.id,
            "user": self.user.id
        }

    def __str__(self):
        return f"{self.user} like this post {self.post}"