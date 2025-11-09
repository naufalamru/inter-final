const BASE = (typeof STUDENT !== 'undefined' && STUDENT.STORY_API_BASE)
  ? STUDENT.STORY_API_BASE
  : (window.STORY_API_BASE || 'https://story-api.dicoding.dev/v1');

export default class AuthModel {
  async register({ name, email, password }) {
    const url = `${BASE}/register`;
    console.log('Register URL:', url);
    console.log('Register payload:', { name, email, password });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      console.log('Response status:', res.status);
      const text = await res.text();
      console.log('Raw response text:', text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }

      if (!res.ok) {
        console.error('Register failed with:', json);
        throw new Error(json.message || 'Gagal registrasi');
      }

      console.log('Register success:', json);
      return json;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  }

  async login({ email, password }) {
    const url = `${BASE}/login`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal login');
      window.AUTH_TOKEN = `Bearer ${json.loginResult.token}`;
      return json.loginResult.token;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }
}
