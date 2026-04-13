'use server'

import { parse } from 'node-html-parser'

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch page')
    }

    const html = await response.text()
    const root = parse(html)

    const title = root.querySelector('title')?.text || 
                  root.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                  root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || 
                  ''

    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || 
                        root.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                        root.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || 
                        ''

    const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                  root.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || 
                  ''

    let favicon = root.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                  root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || 
                  root.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')

    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url)
      favicon = `${urlObj.origin}${favicon.startsWith('/') ? '' : '/'}${favicon}`
    }

    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `https://www.google.com/s2/favicons?sz=64&domain=${urlObj.hostname}`
    }

    return {
      title: title.trim(),
      description: description.trim(),
      image_url: image,
      favicon_url: favicon,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return {
      title: '',
      description: '',
      image_url: '',
      favicon_url: '',
    }
  }
}
