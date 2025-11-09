import StoryModel from '../models/storyModel.js';
import AuthModel from '../models/authModel.js';

export default class AppController {
  constructor(root) {
    this.root = root;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
  }

  async loadStories() {
    return await this.storyModel.fetchStories();
  }

  async addStory(formData) {
    return await this.storyModel.postStory(formData);
  }

  async register(data) {
    return await this.authModel.register(data);
  }

  async login(data) {
    const token = await this.authModel.login(data);
    window.AUTH_TOKEN = `Bearer ${token}`;
    localStorage.setItem('token', `Bearer ${token}`);
    location.hash = '#/';
  }

  logout() {
    localStorage.removeItem('token');
    window.AUTH_TOKEN = '';
    location.hash = '#/login';
  }

  render(view) {
    this.root.innerHTML = '';
    this.root.appendChild(view.render());
  }
}
