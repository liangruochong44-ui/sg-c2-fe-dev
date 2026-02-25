const articles = [
  {
    id: 1,
    title: "探索 AI 辅助编程的最佳实践",
    excerpt: "在 AI 时代，如何高效地利用 AI 工具提升编程效率，同时保持代码质量和学习成长？本文将分享一些实用的技巧和经验。",
    category: "AI",
    date: "2026-02-20",
    content: `
      <p>人工智能正在改变我们编写代码的方式。作为一名开发者，我一直在探索如何更好地利用 AI 工具来提升效率。在这篇文章中，我想分享一些个人的实践心得。</p>
      
      <h2>为什么 AI 辅助编程重要</h2>
      <p>AI 辅助编程不仅仅是自动补全代码，它更像是一个随时可用的技术伙伴。它可以帮助我们：</p>
      <ul>
        <li>快速理解不熟悉的代码库</li>
        <li>生成样板代码和重复性代码</li>
        <li>提供多种解决方案供选择</li>
        <li>发现潜在的 bug 和优化点</li>
      </ul>
      
      <h2>最佳实践</h2>
      <p>经过一段时间的实践，我总结出以下几点建议：</p>
      
      <h3>1. 明确你的需求</h3>
      <p>在使用 AI 工具时，尽量清晰地描述你的需求。模糊的请求会导致 AI 生成不准确的代码。</p>
      
      <h3>2. 理解而非复制</h3>
      <p>AI 生成的代码是参考，而不是圣旨。花时间理解代码的逻辑，这样你才能在需要时进行修改和调试。</p>
      
      <h3>3. 保持批判性思维</h3>
      <p>AI 也会犯错。始终审查和测试 AI 生成的代码，不要盲目信任。</p>
      
      <blockquote>
        "AI 是工具，不是替代品。最好的开发者是那些懂得如何与 AI 协作的人。"</blockquote>
      
      <h2>总结</h2>
      <p>AI 辅助编程是一个强大的工具，但它需要正确使用才能发挥最大价值。希望这些建议能帮助你更好地利用 AI 提升编程效率。</p>
    `
  },
  {
    id: 2,
    title: "游戏开发中的物理引擎选择",
    excerpt: "从 Unity 的 PhysX 到 Godot 的内置引擎，如何根据项目需求选择合适的物理解决方案？",
    category: "游戏开发",
    date: "2026-02-15",
    content: `
      <p>物理引擎是现代游戏开发的核心组件之一。选择合适的物理引擎可以大大提高开发效率和游戏质量。</p>
      
      <h2>主流物理引擎</h2>
      <ul>
        <li><strong>PhysX</strong> - Unity 官方使用，性能优秀</li>
        <li><strong>Box2D</strong> - 2D 游戏的事实标准</li>
        <li><strong>Bullet</strong> - 开源跨平台，广泛使用</li>
        <li><strong>Godot Physics</strong> - Godot 内置，轻量级</li>
      </ul>
      
      <h2>选择因素</h2>
      <p>选择物理引擎时需要考虑：</p>
      <ol>
        <li>项目类型（2D 还是 3D）</li>
        <li>平台目标</li>
        <li>性能要求</li>
        <li>学习曲线</li>
        <li>许可证和成本</li>
      </ol>
      
      <h2>我的建议</h2>
      <p>对于独立开发者，我建议使用引擎自带的物理引擎。这样可以减少集成工作量，同时获得良好的技术支持。</p>
    `
  },
  {
    id: 3,
    title: "从零开始构建个人博客",
    excerpt: "记录我搭建这个博客的过程，包括技术选型、设计考量以及遇到的问题和解决方案。",
    category: "前端",
    date: "2026-02-10",
    content: `
      <p>拥有一个个人博客是每个开发者的梦想。在这篇文章中，我将分享如何从零开始构建一个现代、简洁的博客网站。</p>
      
      <h2>技术选型</h2>
      <p>经过考虑，我选择了纯 HTML + CSS + JavaScript 的方案。原因很简单：</p>
      <ul>
        <li>简单直接，无需复杂的构建过程</li>
        <li>加载速度快，用户体验好</li>
        <li>易于部署和维护</li>
        <li>可以完全控制代码</li>
      </ul>
      
      <h2>设计理念</h2>
      <p>在设计上，我追求的是"简洁而不简单"：</p>
      <ul>
        <li>深色主题，减少眼睛疲劳</li>
        <li>清晰的层次结构</li>
        <li>流畅的动画效果</li>
        <li>响应式设计，适配各种设备</li>
      </ul>
      
      <h2>实现细节</h2>
      <p>使用 CSS 变量来管理主题色，这样未来切换主题会非常简单。动画使用 CSS transition 和 keyframes，保证流畅性。</p>
      
      <h2>总结</h2>
      <p>建站过程比想象中顺利。重要的不是技术多先进，而是真正去行动。</p>
    `
  },
  {
    id: 4,
    title: "Rust 语言入门心得",
    excerpt: "作为系统编程的新选择，Rust 以其内存安全和高性能著称。分享我的学习路径和体会。",
    category: "编程语言",
    date: "2026-02-05",
    content: `
      <p>Rust 是一门独特的编程语言，它在保证性能的同时解决了传统 C/C++ 的内存安全问题。</p>
      
      <h2>为什么学 Rust</h2>
      <p>我有以下原因：</p>
      <ul>
        <li>现代语言设计，语法优雅</li>
        <li>强大的类型系统</li>
        <li>编译器帮助避免常见错误</li>
        <li>活跃的社区和生态系统</li>
      </ul>
      
      <h2>学习曲线</h2>
      <p>Rust 的所有权系统是最大的挑战。一旦理解了这个概念，编程会变得非常愉快。</p>
      
      <h2>实用资源</h2>
      <ul>
        <li>The Rust Book - 官方教程</li>
        <li>rustlings - 实践练习</li>
        <li>Exercism - 交互式学习</li>
      </ul>
    `
  },
  {
    id: 5,
    title: "我的 2026 技术展望",
    excerpt: "新的一年，AI、边缘计算、Web3 等技术将如何发展？分享一些个人预测和思考。",
    category: "思考",
    date: "2026-01-28",
    content: `
      <p>每年年初，我都会思考技术的发展方向。2026 年似乎是一个充满变革的年份。</p>
      
      <h2>AI 的深化</h2>
      <p>AI 将从通用走向垂直领域。期待看到更多针对特定行业的 AI 解决方案。</p>
      
      <h2>边缘计算</h2>
      <p>随着 IoT 设备普及，边缘计算将变得更加重要。本地 AI 处理能力会持续提升。</p>
      
      <h2>Web3 的演进</h2>
      <p>去中心化技术将继续发展，但可能会更注重实际应用而非概念炒作。</p>
      
      <h2>我的计划</h2>
      <p>在新的一年里，我计划：</p>
      <ol>
        <li>深入学习 AI 辅助开发</li>
        <li>尝试更多游戏项目</li>
        <li>为开源社区贡献力量</li>
      </ol>
    `
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackToTop();
  
  const page = document.body.dataset.page;
  if (page === 'blog') {
    renderArticles(articles);
  } else if (page === 'article') {
    renderArticleDetail();
  }
});

function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
}

function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function renderArticles(articlesList) {
  const grid = document.querySelector('.articles-grid');
  if (!grid) return;
  
  grid.innerHTML = articlesList.map(article => `
    <a href="article.html?id=${article.id}" class="article-card">
      <div class="article-meta">
        <span class="article-category">${article.category}</span>
        <span>${formatDate(article.date)}</span>
      </div>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-excerpt">${article.excerpt}</p>
    </a>
  `).join('');
}

function renderArticleDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    document.querySelector('main').innerHTML = `
      <div class="container">
        <h1>文章未找到</h1>
        <a href="blog.html" class="back-link">← 返回文章列表</a>
      </div>
    `;
    return;
  }
  
  document.querySelector('.article-title').textContent = article.title;
  document.querySelector('.article-category').textContent = article.category;
  document.querySelector('.article-date').textContent = formatDate(article.date);
  document.querySelector('.article-content').innerHTML = article.content;
  document.title = `${article.title} - 若冲博客`;
  
  const relatedContainer = document.querySelector('.related-articles');
  if (relatedContainer) {
    const related = articles.filter(a => a.id !== id).slice(0, 2);
    relatedContainer.innerHTML = `
      <h2 class="section-title">相关文章</h2>
      <div class="articles-grid">
        ${related.map(a => `
          <a href="article.html?id=${a.id}" class="article-card">
            <div class="article-meta">
              <span class="article-category">${a.category}</span>
              <span>${formatDate(a.date)}</span>
            </div>
            <h3 class="article-title">${a.title}</h3>
          </a>
        `).join('')}
      </div>
    `;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
