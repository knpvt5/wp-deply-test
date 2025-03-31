
const recentNews = document.querySelector('.recent-news-wrapper');
const relatedNews = document.querySelector('.related-news-wrapper');

const skeletonContainer = document.createElement('div');
skeletonContainer.className = 'skeleton-container';
skeletonContainer.innerHTML = `
   <div class="skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
   </div>
`;

const relatedSkeletonContainer = skeletonContainer.cloneNode(true);

// Display loading indicator at the top of both sections
recentNews.appendChild(skeletonContainer);
relatedNews.appendChild(relatedSkeletonContainer);

fetch('/finance-news/finnews')
    .then(response => response.json())
    .then((data) => {
        console.log(data);

        data.forEach((article) => {
            // console.log(article);

            const RecentNewsSideBar = createSideNewsDiv(article);
            recentNews.appendChild(RecentNewsSideBar);

            RecentNewsSideBar.addEventListener('click', () => {
                // window.location.href = `/news-article/${article.fields.slug}`
                window.location.href = `/finance-news/article/` + article.fields.slug;
            })
        })

        const filteredArticle = data.filter(article => {
            let articleCategories = Array.isArray(article.fields.category) ? article.fields.category : [article.fields.category];
            // console.log(articleCategories);
            return articleCategories.some(category => category.toLowerCase() === articleCategory.toLowerCase());
        });

        filteredArticle.forEach(article => {
            const RelatedNewsSideBar = createSideNewsDiv(article);
            relatedNews.appendChild(RelatedNewsSideBar);

            RelatedNewsSideBar.addEventListener('click', () => {
                // window.location.href = `/news-article/${article.fields.slug}`
                window.location.href = `/finance-news/article/` + article.fields.slug;
            })
        })


    })
    .catch((error) => {
        console.error('Error:', error);
    })
    .finally(() => {
        skeletonContainer.remove();
        relatedSkeletonContainer.remove();
    });


function createSideNewsDiv(article) {
    // Ensure the title fallback works as expected
    const NewsTitle = article.fields && (article.fields.title || article.fields.internalName) || 'No title';

    // Safeguard the featured image rendering with fallback
    const featuredImage = article.fields && article.fields.featuredImage && article.fields.featuredImage.fields
        ? `<img src="${article.fields.featuredImage.fields.file.url}" alt="${article.fields.featuredImage.fields.title}">`
        : '';

    const sideNewsDiv = document.createElement('div');
    sideNewsDiv.className = 'side-content';
    sideNewsDiv.innerHTML = `
             ${featuredImage}
             <h3>${NewsTitle}</h3>
            `;

    return sideNewsDiv;
}

const shareButton = document.getElementById('share-button');

shareButton.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: document.title, 
            url: location.href 
        })
        .then(() => console.log('Content shared successfully!'))
        .catch((error) => console.error('Error sharing content:', error));
    } else {
        alert('This Share API is not supported in your browser.');
    }
});