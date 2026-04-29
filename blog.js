// ============================================
// Blog Management & Display Logic
// ============================================

let allBlogs = [];
let currentBlogId = null;

// Load blog data
async function loadBlogs() {
    try {
        const response = await fetch('/data/blogs.json');
        if (!response.ok) throw new Error('Failed to load blogs');
        const data = await response.json();
        allBlogs = data.blogs;

        // Check if we're on blog list page or post page
        const currentPage = window.location.pathname;
        if (currentPage.includes('blog.html')) {
            initBlogListPage();
        } else if (currentPage.includes('blog/post.html')) {
            initBlogPostPage();
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        displayErrorMessage('Failed to load blog posts. Please try again later.');
    }
}

// ============================================
// Blog List Page
// ============================================

function initBlogListPage() {
    const blogContainer = document.getElementById('blogContainer');
    const categoryFilter = document.getElementById('categoryFilter');

    if (!blogContainer) return;

    // Extract unique categories
    const categories = ['all', ...new Set(allBlogs.map(blog => blog.category))];

    // Add category buttons
    categoryFilter.innerHTML = '';
    categories.forEach(category => {
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'category-btn' + (category === 'all' ? ' active' : '');
        btn.setAttribute('data-category', category);
        btn.textContent = category === 'all' ? 'All Posts' : category;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterBlogsByCategory(category);
        });

        categoryFilter.appendChild(btn);
    });

    // Display featured posts
    const featuredBlogs = allBlogs.filter(blog => blog.featured);
    const featuredContainer = document.getElementById('featuredContainer');

    if (featuredBlogs.length > 0) {
        featuredContainer.style.display = 'block';
        renderBlogsList(document.getElementById('featuredPosts'), featuredBlogs);
    } else {
        featuredContainer.style.display = 'none';
    }

    // Display all posts
    renderBlogsList(blogContainer, allBlogs);
}

function renderBlogsList(container, blogs) {
    container.innerHTML = '';

    if (blogs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--macos-text-secondary); padding: 32px;">No blog posts found.</p>';
        return;
    }

    blogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        container.appendChild(blogCard);
    });
}

function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animation = 'fadeInUp 0.4s ease-out';

    const date = new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="blog-card-header">
            <div>
                <h3 class="blog-card-title">${escapeHtml(blog.title)}</h3>
                <div class="blog-card-meta">
                    <span class="blog-card-date">${date}</span>
                    <span class="category-tag">${escapeHtml(blog.category)}</span>
                </div>
            </div>
        </div>
        <p class="blog-excerpt">${escapeHtml(blog.excerpt)}</p>
    `;

    card.addEventListener('click', () => {
        navigateToBlogPost(blog.id);
    });

    return card;
}

function filterBlogsByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    // Filter blogs
    const filtered = category === 'all'
        ? allBlogs
        : allBlogs.filter(blog => blog.category === category);

    renderBlogsList(document.getElementById('blogContainer'), filtered);
}

// ============================================
// Blog Post Page
// ============================================

function initBlogPostPage() {
    const params = new URLSearchParams(window.location.search);
    currentBlogId = params.get('id');

    if (!currentBlogId) {
        displayPostError('Blog post not found. <a href="../blog.html">Back to blog</a>');
        return;
    }

    const blog = allBlogs.find(b => b.id === currentBlogId);

    if (!blog) {
        displayPostError('Blog post not found. <a href="../blog.html">Back to blog</a>');
        return;
    }

    displayBlogPost(blog);
    updatePostNavigation(blog);
}

function displayBlogPost(blog) {
    const postContent = document.getElementById('postContent');
    const postTitle = document.getElementById('postTitle');

    // Update page title
    postTitle.textContent = `${blog.title} - Kayra's Blog`;

    const date = new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update sidebar metadata
    document.getElementById('postDateMeta').textContent = date;
    document.getElementById('postCategoryMeta').textContent = blog.category;

    // Render post content
    postContent.innerHTML = `
        <h1>${escapeHtml(blog.title)}</h1>
        <div class="blog-post-header">
            <span class="blog-post-date">
                <i class="fas fa-calendar"></i>
                ${date}
            </span>
            <span class="blog-post-category">${escapeHtml(blog.category)}</span>
        </div>
        <div class="blog-post-content">
            ${blog.content}
        </div>
    `;

    postContent.style.animation = 'fadeInUp 0.4s ease-out';
}

function updatePostNavigation(currentBlog) {
    const currentIndex = allBlogs.findIndex(b => b.id === currentBlog.id);

    // Previous post
    if (currentIndex > 0) {
        const prevBlog = allBlogs[currentIndex - 1];
        const prevNav = document.getElementById('prevPostNav');
        prevNav.style.display = 'block';
        document.getElementById('prevPostTitle').textContent = prevBlog.title;
        document.getElementById('prevPostLink').href = `?id=${prevBlog.id}`;
        document.getElementById('prevPostLink').addEventListener('click', (e) => {
            e.preventDefault();
            navigateToBlogPost(prevBlog.id);
        });
    }

    // Next post
    if (currentIndex < allBlogs.length - 1) {
        const nextBlog = allBlogs[currentIndex + 1];
        const nextNav = document.getElementById('nextPostNav');
        nextNav.style.display = 'block';
        document.getElementById('nextPostTitle').textContent = nextBlog.title;
        document.getElementById('nextPostLink').href = `?id=${nextBlog.id}`;
        document.getElementById('nextPostLink').addEventListener('click', (e) => {
            e.preventDefault();
            navigateToBlogPost(nextBlog.id);
        });
    }
}

// ============================================
// Utilities
// ============================================

function navigateToBlogPost(blogId) {
    // Check if we're already on post page
    if (window.location.pathname.includes('blog/post.html')) {
        // Update URL and reload post
        const newUrl = `${window.location.pathname}?id=${blogId}`;
        window.history.pushState({ blogId }, '', newUrl);
        currentBlogId = blogId;
        const blog = allBlogs.find(b => b.id === blogId);
        if (blog) {
            displayBlogPost(blog);
            updatePostNavigation(blog);
        }
    } else {
        // Navigate to post page
        window.location.href = `blog/post.html?id=${blogId}`;
    }
}

function displayErrorMessage(message) {
    const blogContainer = document.getElementById('blogContainer');
    if (blogContainer) {
        blogContainer.innerHTML = `<div style="text-align: center; color: var(--macos-text-secondary); padding: 48px;">${message}</div>`;
    }
}

function displayPostError(message) {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.innerHTML = `<div style="text-align: center; color: var(--macos-text-secondary); padding: 48px;">${message}</div>`;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Only load blogs if we're on blog pages
    if (window.location.pathname.includes('blog')) {
        loadBlogs();
    }
});

// Handle browser back/forward buttons on post page
window.addEventListener('popstate', function(event) {
    if (window.location.pathname.includes('blog/post.html')) {
        const params = new URLSearchParams(window.location.search);
        const blogId = params.get('id');
        if (blogId) {
            const blog = allBlogs.find(b => b.id === blogId);
            if (blog) {
                displayBlogPost(blog);
                updatePostNavigation(blog);
            }
        }
    }
});
