const BASE = (typeof STUDENT !== 'undefined' && STUDENT.STORY_API_BASE)
  ? STUDENT.STORY_API_BASE
  : (window.STORY_API_BASE || 'https://story-api.dicoding.dev/v1');

export default class StoryModel {
  async fetchStories() {
    try {
      const res = await fetch(`${BASE}/stories`, {
        headers: { 'Authorization': window.AUTH_TOKEN || '' }
      });
      if (!res.ok) throw new Error('Gagal mengambil data story');
      const json = await res.json();
      return json.listStory || json.stories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async postStory(formData) {
    try {
      const res = await fetch(`${BASE}/stories`, {
        method: 'POST',
        headers: { 'Authorization': window.AUTH_TOKEN || '' },
        body: formData
      });
      if (!res.ok) throw new Error('Gagal menambahkan story');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
