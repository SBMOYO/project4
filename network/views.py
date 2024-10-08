from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpRequest
from django.core.exceptions import ObjectDoesNotExist


from .models import User, Post, Follow, Like


def index(request):

    if request.method == "GET":

        posts = Post.objects.all().order_by('-timestamp')

        response = JsonResponse([post.serialize() for post in posts], safe=False)
     
        return render(request, "network/index.html", {
            "response": response
        })



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    


def showPost(request):

    if request.method == "GET":

        posts = Post.objects.all().order_by('-timestamp')

        return JsonResponse([post.serialize() for post in posts], safe=False)



@csrf_exempt
def post(request):

    if request.method == "POST":

        data = json.loads(request.body)
        post = data.get("post")
        post_user_id = data.get("post_user")

        # Get the User object with the given ID
        post_user = User.objects.get(id=post_user_id)

        info = Post.objects.create(post=post, post_user=post_user)
        info.save()

        get_request = HttpRequest()
        get_request.method = "GET"
        showPost(get_request)

        return JsonResponse({"succes": "the post has been created successfully!!!"})



def like(request):

    if request.method == "POST":

        user = request.user
        post = request.get("post_id")

        data = Like.objects.create(post=post, user=user)
        data.save()

        return JsonResponse({"success": "You have successfully liked the post!!!"})
    

@csrf_exempt
def followers(request):

    if request.method == "POST":

        data = json.loads(request.body)
        user_id =data.get("userId")

        user = User.objects.get(id=user_id)

        follow = Follow.objects.filter(followed_user=user)
        return JsonResponse([follow_item.serialize() for follow_item in follow], safe=False)


@csrf_exempt
def following(request):

    if request.method == "POST":

        data = json.loads(request.body)
        user_id =data.get("userId")

        user = User.objects.get(id=user_id)

        follow = Follow.objects.filter(follower=user)
        return JsonResponse([follow_item.serialize() for follow_item in follow], safe=False)


    
def addFollow(request):

    if request.method == 'POST':

        if not request.get("follow"):
            return HttpResponseRedirect(reverse("login"))
        else:
            follow = request.get("follow")
            followed_user = request.get("followed_user")

        follow = User.objects.get(id=follow)
        followed_user = User.objects.get(id=followed_user)

        data = Follow.objects.create(follow=follow, followed_user=followed_user)   
        data.save()

        return JsonResponse({"success": "Your follow request was successful!!!"})  



def showFollowingPost(request):

    if request.method == "GET":

        user = request.user

        # Get the list of users followed by the signed-in user
        followed_users = Follow.objects.filter(follower=user).values_list('followed_user', flat=True)
        # Filter posts made by the followed users
        posts = Post.objects.filter(post_user__in=followed_users).order_by('-timestamp')

        return JsonResponse([post.serialize() for post in posts], safe=False)    


@csrf_exempt
def showUsersPost (request):

    if request.method == "POST":

        data = json.loads(request.body)
        user_id =data.get("userId")

        user = User.objects.get(id=user_id)

        posts = Post.objects.filter(post_user=user).order_by('-timestamp')

        return JsonResponse([post.serialize() for post in posts], safe=False)



@csrf_exempt
def isFollowed(request):

    if request.method == "POST":

        # Recieve data from an API call and store it in a variable
        data = json.loads(request.body)
        followed_user = data.get("user")

        #Create user instance with the data recieved
        followed_user = User.objects.get(id=followed_user)
        
        #check if the provided user is followed by the current user or not
        try:
            Follow.objects.get(follower=request.user, followed_user=followed_user)
            return JsonResponse({'is_followed': True})
        except ObjectDoesNotExist:
            return JsonResponse({'is_followed': False})
        

@csrf_exempt
def followCreator(request):

    if request.method == "POST":

        data = json.loads(request.body)
        user = data.get("userId")

        user = User.objects.get(id=user)

        follow = Follow.objects.create(follower=request.user, followed_user=user)
        follow.save()
        return JsonResponse({"success": "success"})

        
@csrf_exempt
def unfollow(request):

    if request.method == "POST":

        data = json.loads(request.body)
        user_id = data.get("userId")

        user = User.objects.get(id=user_id)
        
        follow = Follow.objects.filter(follower=request.user, followed_user=user).first()
        if follow:
            follow.delete()
            return JsonResponse({"success": "success"})
        else:
            return JsonResponse({"error": "Follow object not found"})

