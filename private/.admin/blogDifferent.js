document.addEventListener('DOMContentLoaded', () => {
    const blogLeftContainer = document.getElementById('blog-left-container');
    const searchBox = document.getElementById('search-input');

    fetch('/blog/posts')
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                renderBlogPost(data);
                initialLoad(data);
                searchFn(data);
                updateCategoryCounts(data);
                blogCatClick(data);
            } else {
                console.error("Data format is invalid or missing.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            blogLeftContainer.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
        });

    function renderBlogPost(data) {
        blogLeftContainer.innerHTML = '';

        data.forEach(post => {
            const fields = post.fields;
            const title = fields.title || 'No title';
            const category = fields.category || 'No category';

            const categories = Array.isArray(fields.category)
                ? fields.category.map(cat => cat.toLowerCase().trim())
                : fields.category.split(',').map(cat => cat.toLowerCase().trim());

            const publishedDate = fields.publishedDate
                ? new Date(fields.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'No date';
            const author = fields.author?.fields?.name || 'WealthPsychology';
            const featuredImage = fields.featuredImage?.fields
                ? `<img src="${fields.featuredImage.fields.file.url}" alt="${fields.featuredImage.fields.title}">`
                : '';
            const excerpt = fields.excerpt || 'No excerpt';

            const blogContainer = document.createElement('div');
            blogContainer.className = 'post';
            blogContainer.innerHTML = `
                <h2>${title}</h2>
                <p>${categories.join(', ')}</p>
                <p>${publishedDate}</p>
                <p class="blog-author">Post By: ${author}</p>
                ${featuredImage}
                <p>${excerpt}</p>
            `;

            blogLeftContainer.appendChild(blogContainer);
        });

    }

    function updateCategoryCounts(data) {
        const categoryListItems = document.querySelectorAll('#category-list .post-count');
        const allBlogCat = document.querySelector('#category-list [blog-category="all"]');
        categoryListItems.forEach(count => {
            const blogCategory = count.closest('li').getAttribute('blog-category').toLowerCase().trim().replace(/-/g, ' ');
            const postCount = data.filter(post => {
                const categories = Array.isArray(post.fields.category)
                    ? post.fields.category
                    : post.fields.category.split(',').map(cat => cat.trim().toLowerCase());
                return categories.includes(blogCategory);
            }).length;
            count.textContent = postCount > 0 ? `(${postCount})` : '';
            if (allBlogCat) {
                const countSpan = allBlogCat.querySelector('.post-count');
                countSpan.innerHTML = `(${data.length})`;
            }
        });
    }

    function blogCatClick(data) {
        document.querySelectorAll('#category-list li').forEach(blogCat => {
            blogCat.addEventListener('click', () => {
                const blogCategoryUrl = blogCat.getAttribute('blog-category').toLowerCase().trim();
                const url = window.location;
                url.hash = blogCategoryUrl;

                const blogCategory = blogCat.getAttribute('blog-category').toLowerCase().trim().replace(/-/g, ' ');
                const filteredData = data.filter(post => {
                    const categories = Array.isArray(post.fields.category)
                        ? post.fields.category
                        : post.fields.category.split(',').map(cat => cat.trim().toLowerCase());
                    return categories.includes(blogCategory);
                });
                renderBlogPost(filteredData);
            });
        });
    }

    function searchFn(data) {
        searchBox.addEventListener('input', () => {
            const searchTerm = searchBox.value.toLowerCase();
            const filteredData = data.filter(post => {
                const title = post.fields.title.toLowerCase();
                const categories = Array.isArray(post.fields.category)
                    ? post.fields.category
                    : post.fields.category.split(',').map(cat => cat.trim().toLowerCase());
                for (const cat of categories) {
                    if (cat.toLowerCase().includes(searchTerm) || title.includes(searchTerm)) {
                        return true;
                    }
                }
                blogLeftContainer.style.background = 'red';
                return false;
            });
            renderBlogPost(filteredData);
        });
    }

    function initialLoad(data) {
        let currentHash = window.location.hash;
        currentHash = currentHash.replace('#', '').replace(/-/g, ' ');
        if (currentHash) {
            renderBlogPost(data, currentHash);
        }
    }
});