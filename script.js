document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const postsDiv = document.getElementById("posts");
    const postDetailsModal = document.getElementById("post-details");
    const closeBtn = document.getElementById("close");

    // Fetch posts and user data simultaneously
    Promise.all([
        fetch("https://jsonplaceholder.typicode.com/posts").then(response => response.json()),
        fetch("https://jsonplaceholder.typicode.com/users").then(response => response.json())
    ])
    .then(([posts, users]) => {
        displayPosts(posts, users);
    })
    .catch(error => {
        showError(error);
    })
    .finally(() => {
        loading.style.display = "none";
    });

    function displayPosts(posts, users) {
        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">
                    <strong>${user.name}</strong> (${user.email})
                </div>
            `;
            postDiv.addEventListener("click", () => showPostDetails(post.id));
            postsDiv.appendChild(postDiv);
        });
    }

    function showPostDetails(postId) {
        loading.style.display = "block";
        Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(response => response.json()),
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`).then(response => response.json())
        ])
        .then(([post, comments]) => {
            const postInfo = document.getElementById("post-info");
            const commentsDiv = document.getElementById("comments");
            postInfo.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            `;
            commentsDiv.innerHTML = "<h3>Comments:</h3>";
            comments.forEach(comment => {
                const commentDiv = document.createElement("div");
                commentDiv.className = "comment";
                commentDiv.innerHTML = `
                    <p><strong>${comment.name}</strong> (${comment.email})</p>
                    <p>${comment.body}</p>
                `;
                commentsDiv.appendChild(commentDiv);
            });
            postDetailsModal.style.display = "block";
        })
        .catch(error => {
            showError(error);
        })
        .finally(() => {
            loading.style.display = "none";
        });
    }

    function showError(error) {
        errorDiv.style.display = "block";
        errorDiv.textContent = `Error: ${error.message}`;
    }

    closeBtn.onclick = () => {
        postDetailsModal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === postDetailsModal) {
            postDetailsModal.style.display = "none";
        }
    };
});
