import axios from 'axios';

export type DanbooruRating =
  | 'general'
  | 'safe'
  | 'questionable'
  | 'explicit'
  | 'sensitive';

export type TagLogicOperation = '>' | '<' | '>=' | '<=' | '';

export interface DanbooruImage {
  id: number;
  tag_string: string;
  source: string;
  file_url: string;
  score: number;
  fav_count: number;
}

class Danbooru {
  private keywords: string[] = [];

  private apiKey: string;
  private username: string;

  constructor(apiKey: string, username: string) {
    this.apiKey = apiKey;
    this.username = username;
  }

  tags(tags: string[], exclude: boolean = false): Danbooru {
    if (exclude) {
      tags = tags.map((tag) => `-${tag}`);
    }

    this.keywords.push(...tags);
    return this;
  }

  rating(
    rating: DanbooruRating | DanbooruRating[],
    exclude: boolean = false,
  ): Danbooru {
    const tags = [];

    if (typeof rating === 'string') {
      tags.push(`rating:${rating}`);
    } else {
      rating.forEach((r) => tags.push(`rating:${r}`));
    }

    this.tags(tags, exclude);
    return this;
  }

  favcount(count: number, op: TagLogicOperation = ''): Danbooru {
    this.tags([`favcount:${op}${count}`]);
    return this;
  }

  random(count: number = 1) {
    this.tags([`random:${count}`]);
    return this;
  }

  async get(): Promise<DanbooruImage[]> {
    const keywords = this.keywords.join(' ');
    const encodedKeywords = encodeURIComponent(keywords);
    const url = `https://danbooru.donmai.us/posts.json?tags=${encodedKeywords}&login=${this.username}&api_key=${this.apiKey}`;

    const response = await axios.get<DanbooruImage[]>(url);
    return response.data;
  }

  static humanReadableTags(tagString: string): string {
    return tagString
      .split(' ')
      .map((tag) => tag.replace(/_/g, ' '))
      .join(', ');
  }
}

export default Danbooru;
