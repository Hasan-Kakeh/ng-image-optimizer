import sharp from 'sharp';
import { detectContentType, ImageError, getImageEtag } from './utils';
import { ImageParamsResult } from './validator';
import { ImageUpstream } from './fetcher';

export async function optimizeImage(
  imageUpstream: ImageUpstream,
  params: Pick<ImageParamsResult, 'href' | 'width' | 'quality' | 'mimeType'>,
) {
  const { href, quality, width, mimeType } = params;
  const { buffer: upstreamBuffer, etag: upstreamEtag } = imageUpstream;

  const upstreamType = await detectContentType(upstreamBuffer);

  if (!upstreamType || !upstreamType.startsWith('image/')) {
    throw new ImageError(400, "The requested resource isn't a valid image.");
  }
  if (upstreamType === 'image/svg+xml') {
    // Return SVG unmodified as sharp doesn't re-optimize SVGs well
    // SVG is allowed or blocked before this function in index.ts based on dangerouslyAllowSVG
    return {
      buffer: upstreamBuffer,
      contentType: upstreamType,
      etag: upstreamEtag,
      upstreamEtag
    };
  }

  let contentType = mimeType || upstreamType || 'image/jpeg';

  try {
    const transformer = sharp(upstreamBuffer).rotate();
    transformer.resize(width, undefined, { withoutEnlargement: true });

    if (contentType === 'image/avif') {
      transformer.avif({ quality: Math.max(quality - 20, 1), effort: 3 });
    } else if (contentType === 'image/webp') {
      transformer.webp({ quality });
    } else if (contentType === 'image/png') {
      transformer.png({ quality });
    } else {
      contentType = 'image/jpeg';
      transformer.jpeg({ quality, mozjpeg: true });
    }

    const optimizedBuffer = await transformer.toBuffer();

    return {
      buffer: optimizedBuffer,
      contentType,
      etag: getImageEtag(optimizedBuffer),
      upstreamEtag,
    };
  } catch (error) {
    console.error('Sharp optimization error:', error);
    // Fallback to upstream image if Sharp fails
    return {
      buffer: upstreamBuffer,
      contentType: upstreamType,
      etag: upstreamEtag,
      upstreamEtag,
    };
  }
}
