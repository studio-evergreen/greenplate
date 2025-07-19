import { generateMetadata, generateJsonLd, getDiscordEmbedMeta, getLinkedInOptimizedMeta, getSlackOptimizedMeta } from '@/lib/utils/seo';
import { siteConfig, generateSEOConfig } from '@/app/config';

// Mock siteConfig
jest.mock('@/app/config', () => ({
  siteConfig: {
    name: 'Test Site',
    description: 'Test Description',
    url: 'https://test.com',
    ogImage: 'https://test.com/og.png',
    twitterHandle: '@test',
    keywords: ['test', 'site'],
    author: 'Test Author',
    locale: 'en_US',
  },
  generateSEOConfig: jest.fn((config = {}) => {
    const baseUrl = 'https://test.com';
    const defaultConfig = {
      title: 'Test Site',
      description: 'Test Description',
      image: 'https://test.com/og.png',
      url: baseUrl,
      type: 'website',
      siteName: 'Test Site',
      locale: 'en_US',
      authors: ['Test Author'],
    };
    
    return {
      ...defaultConfig,
      ...config,
      url: config.url ? `${baseUrl}${config.url}` : baseUrl,
    };
  }),
}));

describe('SEO Utils', () => {
  describe('generateMetadata', () => {
    it('should generate metadata with default values', () => {
      const metadata = generateMetadata();
      
      expect(metadata.title).toBe('Test Site');
      expect(metadata.description).toBe('Test Description');
      expect(metadata.keywords).toEqual(['test', 'site']);
      expect(metadata.openGraph?.title).toBe('Test Site');
      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.twitter?.creator).toBe('@test');
    });

    it('should generate metadata with custom config', () => {
      const config = {
        title: 'Custom Title',
        description: 'Custom Description',
        url: '/custom',
        type: 'article' as const,
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-02',
        authors: ['Author 1', 'Author 2'],
        tags: ['tag1', 'tag2'],
      };

      const metadata = generateMetadata(config);
      
      expect(metadata.title).toBe('Custom Title');
      expect(metadata.description).toBe('Custom Description');
      expect(metadata.keywords).toEqual(['tag1', 'tag2']);
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-01');
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-02');
      expect(metadata.openGraph?.authors).toEqual(['Author 1', 'Author 2']);
    });

    it('should handle article type metadata', () => {
      const config = {
        type: 'article' as const,
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-02',
        authors: ['Test Author'],
        section: 'Technology',
        tags: ['react', 'nextjs'],
      };

      const metadata = generateMetadata(config);
      
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-01');
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-02');
    });

    it('should generate robots configuration', () => {
      const metadata = generateMetadata();
      
      expect(metadata.robots).toEqual({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      });
    });

    it('should generate canonical URL', () => {
      const config = generateSEOConfig({ url: '/test-page' });
      const metadata = generateMetadata(config);
      
      expect(metadata.alternates?.canonical).toBe('https://test.com/test-page');
    });

    it('should handle alternate locales', () => {
      const config = generateSEOConfig({
        alternateLocales: ['ko', 'ja'],
        url: '/test'
      });
      const metadata = generateMetadata(config);
      
      expect(metadata.alternates?.languages).toEqual({
        ko: 'https://test.com/test?lang=ko',
        ja: 'https://test.com/test?lang=ja',
      });
    });
  });

  describe('generateJsonLd', () => {
    it('should generate basic JSON-LD for website', () => {
      const jsonLd = generateJsonLd();
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.name).toBe('Test Site');
      expect(jsonLd.description).toBe('Test Description');
      expect(jsonLd.url).toBe('https://test.com');
      expect(jsonLd.publisher).toEqual({
        '@type': 'Organization',
        name: 'Test Site',
        url: 'https://test.com',
      });
    });

    it('should generate JSON-LD for article', () => {
      const config = {
        type: 'article' as const,
        title: 'Article Title',
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-02',
        authors: ['Author 1'],
      };

      const jsonLd = generateJsonLd(config);
      
      expect(jsonLd['@type']).toBe('Article');
      expect(jsonLd.headline).toBe('Article Title');
      expect(jsonLd.datePublished).toBe('2024-01-01');
      expect(jsonLd.dateModified).toBe('2024-01-02');
      expect(jsonLd.author).toEqual([{
        '@type': 'Person',
        name: 'Author 1',
      }]);
    });

    it('should use default author when no authors provided for article', () => {
      const config = { type: 'article' as const };
      const jsonLd = generateJsonLd(config);
      
      expect(jsonLd.author).toEqual([{
        '@type': 'Person',
        name: 'Test Author',
      }]);
    });
  });

  describe('Platform-specific optimizations', () => {
    describe('getDiscordEmbedMeta', () => {
      it('should generate Discord-optimized meta tags', () => {
        const meta = getDiscordEmbedMeta({
          title: 'Discord Title',
          description: 'Discord Description',
        });
        
        expect(meta).toEqual({
          'og:title': 'Discord Title',
          'og:description': 'Discord Description',
          'og:image': 'https://test.com/og.png',
          'og:type': 'website',
          'theme-color': '#10b981',
        });
      });

      it('should use default values when no config provided', () => {
        const meta = getDiscordEmbedMeta();
        
        expect(meta['og:title']).toBe('Test Site');
        expect(meta['og:description']).toBe('Test Description');
      });
    });

    describe('getLinkedInOptimizedMeta', () => {
      it('should generate LinkedIn-optimized meta tags', () => {
        const meta = getLinkedInOptimizedMeta({
          title: 'LinkedIn Title',
          type: 'article',
          authors: ['LinkedIn Author'],
        });
        
        expect(meta).toEqual({
          'og:title': 'LinkedIn Title',
          'og:description': 'Test Description',
          'og:image': 'https://test.com/og.png',
          'og:type': 'article',
          'og:site_name': 'Test Site',
          'article:author': 'LinkedIn Author',
        });
      });

      it('should use default author when none provided', () => {
        const meta = getLinkedInOptimizedMeta();
        
        expect(meta['article:author']).toBe('Test Author');
      });
    });

    describe('getSlackOptimizedMeta', () => {
      it('should generate Slack-optimized meta tags', () => {
        const meta = getSlackOptimizedMeta({
          title: 'Slack Title',
          url: '/slack-page',
        });
        
        expect(meta).toEqual({
          'og:title': 'Slack Title',
          'og:description': 'Test Description',
          'og:image': 'https://test.com/og.png',
          'og:url': '/slack-page',
          'og:type': 'website',
        });
      });

      it('should use site URL as default', () => {
        const meta = getSlackOptimizedMeta();
        
        expect(meta['og:url']).toBe('https://test.com');
      });
    });
  });
});