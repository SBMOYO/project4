document.addEventListener('DOMContentLoaded', function() {

    document.querySelector("#all-posts-page").addEventListener("click", getAllPostPage);
    document.querySelector("#following-page").addEventListener("click", getFollowingPage);
    document.querySelector('#profile-button').addEventListener("click", createFollow)
    
    
    //Upload the post
    document.querySelector("#post-form").addEventListener("submit", newPost);
    
    //Load the index page with all the posts
    getAllPostPage();

});

// Sends data from the newPost function to the backend
async function uploadPost(input){
    const body = input;
    const response = await fetch("post", {method:"POST", body: JSON.stringify({
        post:body[0],
        post_user:body[1]
        })
    });
    const data = await response.json();
    return data
}

// Collects data from the form on the main page and submits it as input to the uploadPost function
function newPost(event){
    event.preventDefault();
    
    const post = document.querySelector('#new-post').value;
    const post_user =  document.querySelector('#post-user').value;

    const body = [post, post_user];
  
    uploadPost(body)
    .then(data => {
        console.log(data);
        getAllPostPage();
    })    
}

// Fetches all the Posts made from the backend
async function getPost(){
    const response = await fetch("showPost");
    const data = await response.json();
    return data
}
  

// displays the main page with all the post made on the web-app
function getAllPostPage(event){
    event.preventDefault();

    document.querySelector('#posts-page').style.display = 'block';
    document.querySelector('#Following').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';

    // clear the #all-posts element
    document.querySelector('#all-posts').innerHTML = "";

    getPost()
    .then(post => {
        post.forEach(eachPost => {
            const postArea = document.createElement('div');
            postArea.className = "list-group-item";
            postArea.style.marginTop = "2em";

            const postText = document.createElement('p');
            postText.textContent = eachPost.post;
            postArea.appendChild(postText);

            const postBy = document.createElement('span');
            postBy.textContent = 'Posted by:';
            postArea.appendChild(postBy);

            const postUser = document.createElement('h6');
            postUser.textContent = eachPost.post_user;
            postUser.dataset.userId = eachPost.post_user_id;
            postUser.addEventListener('click', profilePage);
            postArea.appendChild(postUser);

            const postTimestamp = document.createElement('p');
            postTimestamp.textContent = eachPost.timestamp;
            postArea.appendChild(postTimestamp);

            // Add other elements as needed

            document.querySelector('#all-posts').append(postArea);
        })
    })


}



// Fetches the posts made by users that are followed by the current user
async function getFollowingPost(){
    const response = await fetch("showFollowingPost");
    const data = await response.json();
    return data
}


  // Displays the following page and hides other pages
function getFollowingPage(event){
    event.preventDefault();

    document.querySelector('#posts-page').style.display = 'none';
    document.querySelector('#Following').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    

    getFollowingPost()
    .then(post => {

        post.forEach(eachPost => {

            //console.log(eachPost)

            const postArea = document.createElement('div');
            postArea.className = "list-group-item";
            postArea.style.marginTop = "2em";

            const postText = document.createElement('p');
            postText.textContent = eachPost.post;
            postArea.appendChild(postText);

            const postBy = document.createElement('span');
            postBy.textContent = 'Posted by:';
            postArea.appendChild(postBy);

            const postUser = document.createElement('h6');
            postUser.textContent = eachPost.post_user;
            postUser.dataset.userId = eachPost.post_user_id;
            postUser.addEventListener('click', profilePage);
            postArea.appendChild(postUser);

            const postTimestamp = document.createElement('p');
            postTimestamp.textContent = eachPost.timestamp;
            postArea.appendChild(postTimestamp);
    
            document.querySelector('#Following').append(postArea);
        })
    })
 
}


// Fetching the data form the backend to display on the profile page
async function getUsersPost(id){
    const response = await fetch("showUsersPost", {method:"POST", body: JSON.stringify({
        userId:id
        })
    });
    const data = await response.json();
    return data
  }


// Fetches all the users that follow the current user
async function getFollow(id){
    const response = await fetch("follow", {method:"POST", body: JSON.stringify({
        userId:id
        })
    });
    const data = await response.json();
    return data
}


// Fetches all the users being followed by the current user
async function following(id){
    const response = await fetch("following", {method:"POST", body: JSON.stringify({
        userId:id
        })
    });
    const data = await response.json();
    return data
}


// this displays the profile page of users
function profilePage(event){

    hideOtherPages();

    // clear the Profile page elements
    document.querySelector('#profile-page-content').innerHTML = "";
    
    // Create a variable to store the dataset value of the h6 element which is the userId
    const userId = event.target.dataset.userId;

    getFollow(userId)
    .then(follow => {
        
        const followers = follow.length;
        document.querySelector("#followers-count").innerHTML = followers;
    
    });
    following(userId)
    .then(data => {
        const number = data.length;
        document.querySelector("#following-count").innerHTML = number;
    });

    getUsersPost(userId)
    .then(post => {

        displayPosts(post);
        
        updateButton();
    })

    
    function hideOtherPages() {
        document.querySelector('#posts-page').style.display = 'none';
        document.querySelector('#Following').style.display = 'none';
        document.querySelector('#profile-page').style.display = 'block';
    }

    async function updateButton() {
        const isFollowedResult = await isFollowed(userId);
        if (isFollowedResult) {
            document.querySelector('#profile-button').innerHTML = 'Unfollow';
            document.querySelector('#profile-button').className = 'btn btn-danger';
        } else {
            document.querySelector('#profile-button').innerHTML = 'Follow';
            document.querySelector('#profile-button').className = 'btn btn-success'
        }
    }

}



function displayPosts(post) {
    post.forEach(eachPost => {

        const postArea = document.createElement('div');
        postArea.className = "list-group-item";
        postArea.style.marginTop = "2em";

        const postText = document.createElement('p');
        postText.textContent = eachPost.post;
        postArea.appendChild(postText);

        const postBy = document.createElement('span');
        postBy.textContent = 'Posted by:';
        postArea.appendChild(postBy);

        const postUser = document.createElement('h6');
        postUser.textContent = eachPost.post_user;
        postUser.dataset.userId = eachPost.post_user_id;
        postUser.addEventListener('click', profilePage);
        postArea.appendChild(postUser);

        const postTimestamp = document.createElement('p');
        postTimestamp.textContent = eachPost.timestamp;
        postArea.appendChild(postTimestamp);


        document.querySelector('#profile-page-content').append(postArea);
        document.querySelector('#following-h2').innerHTML = eachPost.post_user;

        // Assign a dataset value to profile-button
        document.querySelector('#profile-button').dataset.userId = eachPost.post_user_id;

    });
}


// Checks if a user is followed by the currents user
async function isFollowed(user){
    const response = await fetch("isFollowed", {method: "POST", body: JSON.stringify({
        user: user
        })
    });
    const data = await response.json();
    return data.is_followed
}


// sends a fetch request to follow a user to the backend
async function followCreator(id){
    const response = await fetch('followCreator', {method:"POST", body:JSON.stringify({
        userId: id
    })});
    const data = await response.json();
    return data
}

// send a fetch request to unfollow a user to the backend
async function unfollow(id){
    const response = await fetch('unfollow', {method:"POST", body:JSON.stringify({
        userId: id
    })});
    const data = await response.json();
    return data
}

// follows or unfollows a user
function createFollow(event){

    const userId = event.target.dataset.userId;
    console.log(userId);

    isfollowedContainer()

    
    // checks to see if the user is folloewd by the current user
    async function isfollowedContainer() {
        const isFollowedResult = await isFollowed(userId);
        if (isFollowedResult) {

            unfollow(userId)
            .then(response => {
                console.log(response);

            })

            document.querySelector('#profile-button').innerHTML = 'Follow';
            document.querySelector('#profile-button').className = 'btn btn-success';
        } else {

            followCreator(userId)
            .then(response => {
                console.log(response);

            })

            document.querySelector('#profile-button').innerHTML = 'Unfollow';
            document.querySelector('#profile-button').className = 'btn btn-danger'
        }
    }
}