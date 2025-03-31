import {createClient} from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

// Function to fetch a post by its slug and render rich text
export async function fetchContentBySlug(contentType, slug) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      'fields.slug': slug,
      limit: 1,
      include: 2, 
    });

    if (entries.items.length > 0) {
      const post = entries.items[0];

      // Render rich text content
      if (post.fields.content) {
        const options = {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
              const assetUrl = node.data.target.fields.file.url;
              const assetAlt = node.data.target.fields.title || 'Embedded Image';
              return `<img class="rich-asset" src="${assetUrl}" alt="${assetAlt}" />`;
            },
            [INLINES.HYPERLINK]: (node) => {
              const url = node.data.uri;
              const linkText = node.content[0].value;
              return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
          },
        };
        try {
          post.fields.renderPostRichTextHtml = documentToHtmlString(post.fields.content, options);
        } catch (error) {
          console.error('Error rendering rich text:', error);
          post.fields.renderPostRichTextHtml = 'Error rendering content';
        }
      } else {
        post.fields.renderPostRichTextHtml = 'No content available';
      }

      return post;
    }
    return null;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export { client };