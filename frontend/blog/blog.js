document.addEventListener('DOMContentLoaded', () => {
    const blogLeftContainer = document.getElementById('blog-left-container');
    const categoryList = document.getElementById('category-list');
    const skeletonContainer = document.querySelector('.skeleton-container');
    const seachContainer = document.querySelector('.search-container');

    const categoryMapping = {
        'company-analysis': ['company analysis'],
        'cryptocurrency': ['cryptocurrency'],
        'futures-options': ['futures and option'],
        'finance-insights': ['finance insights'],
        'fundamental-analysis': ['fundamental analysis'],
        'ipo': ['ipo analysis', 'ipo review'],
        'mutual-funds': ['mutual fund analysis'],
        'personal-finance': ['personal finance'],
        'technical-analysis': ['technical analysis'],
        'union-budget': ['union budget'],
        'real-estate': ['real estate']
    };

    let postsByCategory = {
        'all': []
    };

    const postsPerPage = 5;

    fetch('/blog/posts')
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(blogPosts => {
            console.log(`Found ${blogPosts.length} post(s)`);
            displayBlogPosts(blogPosts);
            searchPosts(blogPosts)

        })
        .catch(error => {
            console.error('Error fetching or processing entries:', error);
            let errorMessage = 'Unknown error';
            if (typeof error === 'object' && error !== null) {
                errorMessage = error.details || error.message || JSON.stringify(error);
            }
            blogLeftContainer.innerHTML = `<p>Error: ${errorMessage}</p>`;
        })
        .finally(() => {
            skeletonContainer.remove();
        });

    function displayBlogPosts(posts) {
        blogLeftContainer.innerHTML = '';
        postsByCategory = { 'all': [] };

        posts.forEach(post => {
            postsByCategory['all'].push(post);

            if (post.fields && post.fields.category) {
                let postCategories = Array.isArray(post.fields.category) ? post.fields.category : [post.fields.category];

                postCategories.forEach(category => {
                    Object.entries(categoryMapping).forEach(([blogCategories, keywords]) => {
                        if (keywords.some(keyword => category.toLowerCase().includes(keyword))) {
                            if (!postsByCategory[blogCategories]) {
                                postsByCategory[blogCategories] = [];
                            }
                            postsByCategory[blogCategories].push(post);
                        }
                    });
                });
            }
        });

        updatePostCounts();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category') || 'all';
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;
        displayPostsByCategory(categoryFromUrl, pageFromUrl);
    }

    function createPostExcerpt(post) {

        if (!post || !post.fields) {
            console.error('Invalid post structure:', post);
            // return document.createElement('div'); // Return empty div for invalid posts
        }

        // Ensure the title fallback works as expected
        const postTitle = post.fields && (post.fields.title || post.fields.internalName) || 'No title';

        // Safeguard the publish date rendering with fallback
        const publishedDate = post.fields && post.fields.publishedDate
            ? new Date(post.fields.publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'No date';

        // Safeguard the author name rendering with fallback   
        const authorName = post.fields && post.fields.author && post.fields.author.fields && post.fields.author.fields.name
            ? post.fields.author.fields.name
            : 'WealthPsychology';

        // Safeguard the featured image rendering with fallback
        const featuredImage = post.fields && post.fields.featuredImage && post.fields.featuredImage.fields
            ? `<img src="${post.fields.featuredImage.fields.file.url}" alt="${post.fields.featuredImage.fields.title}">`
            : '';

        // Safeguard the excerpt rendering and shorten it to 100 characters
        const postExcerpt = post.fields && post.fields.excerpt
            ? post.fields.excerpt.length > 250
                ? post.fields.excerpt.substr(0, 250).trim() + ' [...]'
                : post.fields.excerpt + ' [...]'
            : 'No excerpt available';

        // Safeguard the fetching and rendering of slug with fallback
        const postSlug = post.fields && post.fields.slug
            ? `<a href="/blog/post/${post.fields.slug}" class="read-more">Read More</a>`
            : '<span class="read-more-unavailable">Read More (Link Unavailable)</span>';

        const postElement = document.createElement('div');
        postElement.className = "post";
        postElement.innerHTML = `
            <h2>${postTitle}</h2>
            <p>${publishedDate}</p>
            <p class="blog-author">Post By: ${authorName}</p>
            <img>${featuredImage}</img>
            <p>${postExcerpt}</p>
            <span>${postSlug}</span>
        `;
        return postElement;
    }

    function updatePostCounts() {
        Object.entries(postsByCategory).forEach(([blogCategories, posts]) => {
            const categoryItem = categoryList.querySelector(`[blog-category="${blogCategories}"]`);
            if (categoryItem) {
                categoryItem.querySelector('.post-count').textContent = `(${posts.length})`;
            }
        });
    }

    function displayPostsByCategory(blogCategories, page = 1) {
        blogLeftContainer.innerHTML = '';
        const postContents = postsByCategory[blogCategories] || [];
        if (postContents.length === 0) {
            blogLeftContainer.innerHTML = '<p>No posts available for this category.</p>';
        } else {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            const postsToShow = postContents.slice(startIndex, endIndex);

            postsToShow.forEach(post => {
                const postExcerpt = createPostExcerpt(post);
                blogLeftContainer.appendChild(postExcerpt);
            });

            const navigationDiv = document.createElement('div');
            navigationDiv.className = 'navigation-buttons';

            if (page > 1) {
                const seeLessButton = document.createElement('button');
                seeLessButton.textContent = 'See Less';
                seeLessButton.className = 'see-less-button';
                seeLessButton.addEventListener('click', () => {
                    displayPostsByCategory(blogCategories, page - 1);
                    window.scrollTo({ top: 0 });
                });
                navigationDiv.appendChild(seeLessButton);
            }

            if (endIndex < postContents.length) {
                const seeMoreButton = document.createElement('button');
                seeMoreButton.textContent = 'See More';
                seeMoreButton.className = 'see-more-button';
                seeMoreButton.addEventListener('click', () => {
                    displayPostsByCategory(blogCategories, page + 1);
                    window.scrollTo({ top: 0 });
                });
                navigationDiv.appendChild(seeMoreButton);
            }

            blogLeftContainer.appendChild(navigationDiv);
        }

        const url = new URL(window.location);
        url.searchParams.set('category', blogCategories);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);

        categoryList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.getAttribute('blog-category') === blogCategories);
        });
    }


    function searchPosts(blogPosts) {
        const searchInput = document.querySelector('.search-container .inputBox');
        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.toLowerCase();
            const filteredPosts = blogPosts.filter(post => {
                const blogCategories = Array.isArray(post.fields.category) ? post.fields.category : [post.fields.category];
                return (post.fields.title.toLowerCase().includes(searchValue) || blogCategories.some(category => category.toLowerCase().includes(searchValue)));
            });
            displayBlogPosts(filteredPosts);
            const searchPostCount = document.querySelector('.searchPostCount');
            searchPostCount.textContent = `(${filteredPosts.length})`;
        });
    }


    /*  categoryList.querySelectorAll('li').forEach(li => {
         li.addEventListener('click', (e) => {
             e.preventDefault();
             const blogCategories = li.getAttribute('blog-category');
             console.log(blogCategories);
             displayPostsByCategory(blogCategories);
         });
     }); */

    categoryList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            e.stopPropagation();
            e.preventDefault();
            const blogCategories = e.target.getAttribute('blog-category');
            displayPostsByCategory(blogCategories);
        }
    });


    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category') || 'all';
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;
        displayPostsByCategory(categoryFromUrl, pageFromUrl);
    });
});
