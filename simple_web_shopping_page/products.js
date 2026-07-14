// ============================================================
//  ShopX — 공통 상품 데이터 & 유틸리티 (products.js)
// ============================================================

const PRODUCTS = [
  {
    id: 1,
    name: "AirPods Pro 2 무선 이어폰",
    category: "전자기기",
    price: 329000,
    originalPrice: 399000,
    rating: 4.8,
    reviews: 2341,
    badge: "BEST",
    colors: ["#1C1C1E", "#F5F5F7", "#E8D5C0"],
    colorNames: ["스페이스 블랙", "스타라이트", "샴페인"],
    sizes: [],
    description: `
      <p>완전한 몰입감을 선사하는 AirPods Pro 2세대. 업계 최고 수준의 액티브 노이즈 캔슬링으로 외부 소음을 완벽하게 차단하고, Adaptive Transparency 기능으로 필요할 때 주변 소리를 자연스럽게 전달합니다.</p>
      <ul>
        <li>최대 30시간 총 배터리 사용 시간 (케이스 포함)</li>
        <li>H2 칩 탑재로 더욱 강력한 노이즈 캔슬링</li>
        <li>MagSafe, Qi, Apple Watch 충전기 호환</li>
        <li>IP54 방수 방진 등급</li>
        <li>개인화된 공간 음향 (머리 추적 기능 포함)</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"
    ]
  },
  {
    id: 2,
    name: "울트라슬림 마그네틱 지갑",
    category: "패션",
    price: 89000,
    originalPrice: 120000,
    rating: 4.6,
    reviews: 894,
    badge: "SALE",
    colors: ["#1A1A1A", "#8B4513", "#2D5A8E"],
    colorNames: ["블랙", "탠 브라운", "네이비"],
    sizes: [],
    description: `
      <p>이탈리아산 풀그레인 레더로 제작된 프리미엄 마그네틱 슬림 지갑. RFID 차단 기술로 카드 정보를 안전하게 보호합니다.</p>
      <ul>
        <li>이탈리아산 베지터블 탠닝 가죽 사용</li>
        <li>RFID/NFC 차단 특수 레이어</li>
        <li>카드 최대 6장 + 지폐 수납 가능</li>
        <li>MagSafe 호환 마그네틱 장착</li>
        <li>두께 8mm 초슬림 디자인</li>
      </ul>
    `,
    images: [
      "img_wallet_1.png",
      "img_wallet_2.png",
      "img_wallet_1.png"
    ]
  },
  {
    id: 3,
    name: "스마트 LED 무드등",
    category: "리빙",
    price: 55000,
    originalPrice: 75000,
    rating: 4.7,
    reviews: 1563,
    badge: "NEW",
    colors: ["#F5F5F0", "#2C2C2C"],
    colorNames: ["화이트", "블랙"],
    sizes: [],
    description: `
      <p>16만 가지 색상과 음악 동기화 기능으로 완벽한 분위기를 연출하는 스마트 LED 무드등. 앱과 음성으로 편리하게 제어하세요.</p>
      <ul>
        <li>16만 컬러 + 빛의 세기/온도 조절</li>
        <li>마이크 내장 음악 동기화 (디제이 모드)</li>
        <li>iOS / Android 앱 제어</li>
        <li>Amazon Alexa, Google Home 호환</li>
        <li>취침 타이머 및 알람 기능</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    ]
  },
  {
    id: 4,
    name: "프로 메카니컬 게이밍 키보드",
    category: "전자기기",
    price: 189000,
    originalPrice: 229000,
    rating: 4.9,
    reviews: 3201,
    badge: "HOT",
    colors: ["#1A1A1A", "#C0C0C0"],
    colorNames: ["블랙", "실버"],
    sizes: ["풀사이즈 (104키)", "텐키리스 (87키)", "65% (68키)"],
    description: `
      <p>Cherry MX 스위치 탑재와 퍼-키 RGB 조명으로 프로급 게이밍 경험을 제공하는 최고급 메카니컬 키보드.</p>
      <ul>
        <li>Cherry MX Red / Blue / Brown 스위치 선택 가능</li>
        <li>퍼-키 RGB LED (1680만 컬러)</li>
        <li>N-Key Rollover 및 100% 안티 고스팅</li>
        <li>알루미늄 합금 베젤로 내구성 극대화</li>
        <li>USB-C 탈착식 케이블 + 무선 (2.4GHz / BT 5.0)</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80"
    ]
  },
  {
    id: 5,
    name: "오버사이즈 프리미엄 후드집업",
    category: "패션",
    price: 128000,
    originalPrice: 168000,
    rating: 4.5,
    reviews: 712,
    badge: "SALE",
    colors: ["#3D3D3D", "#C0B0A0", "#2D4A6B", "#4A2D4A"],
    colorNames: ["차콜", "샌드베이지", "딥 네이비", "와인"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: `
      <p>400g 중량의 프리미엄 테리 패브릭으로 제작된 오버사이즈 후드집업. 실루엣부터 마감까지 최고급 퀄리티를 자랑합니다.</p>
      <ul>
        <li>400g 헤비웨이트 테리 코튼 100%</li>
        <li>더블 스티치 처리 내구성 강화</li>
        <li>YKK 고급 지퍼 사용</li>
        <li>캥거루 포켓 및 후드 드로스트링</li>
        <li>머신 워셔블 (30도 세탁 가능)</li>
      </ul>
    `,
    images: [
      "img_hoodie_1.png",
      "img_hoodie_2.png",
      "img_hoodie_1.png"
    ]
  },
  {
    id: 6,
    name: "미니멀 아로마 디퓨저",
    category: "리빙",
    price: 68000,
    originalPrice: 89000,
    rating: 4.6,
    reviews: 986,
    badge: "NEW",
    colors: ["#FAFAF8", "#2C2C2C", "#8B7355"],
    colorNames: ["크림 화이트", "매트 블랙", "코르크 우드"],
    sizes: [],
    description: `
      <p>초음파 진동 방식으로 에센셜 오일 분자를 미세하게 분산시켜 오일의 효능을 최대화하는 프리미엄 아로마 디퓨저.</p>
      <ul>
        <li>용량 300ml (최대 8시간 연속 사용)</li>
        <li>7가지 은은한 LED 조명 전환</li>
        <li>자동 전원 차단 (무수 시 안전 장치)</li>
        <li>저소음 초음파 방식 (30dB 이하)</li>
        <li>타이머 기능 (1H / 3H / 6H)</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80"
    ]
  },
  {
    id: 7,
    name: "4K OLED 포터블 모니터",
    category: "전자기기",
    price: 459000,
    originalPrice: 569000,
    rating: 4.8,
    reviews: 445,
    badge: "BEST",
    colors: ["#1A1A1A"],
    colorNames: ["스페이스 블랙"],
    sizes: ["15.6인치", "17.3인치"],
    description: `
      <p>15.6인치 4K OLED 패널로 어디서나 프로 수준의 색감과 명암비를 경험할 수 있는 휴대용 모니터.</p>
      <ul>
        <li>15.6" 4K UHD OLED 터치 디스플레이</li>
        <li>DCI-P3 100% 색재현율, 1,000,000:1 명암비</li>
        <li>USB-C 단일 케이블 (전원+영상+데이터)</li>
        <li>두께 4.9mm, 무게 780g 초경량</li>
        <li>내장 스피커 2W x2 + 3.5mm 오디오</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
      "https://images.unsplash.com/photo-1593640408182-31c228b5dd33?w=600&q=80",
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=600&q=80"
    ]
  },
  {
    id: 8,
    name: "프리미엄 요가 매트",
    category: "리빙",
    price: 79000,
    originalPrice: 99000,
    rating: 4.7,
    reviews: 1823,
    badge: "HOT",
    colors: ["#2D5A2D", "#2D4A8B", "#8B2D2D", "#3D3D3D"],
    colorNames: ["포레스트 그린", "오션 블루", "와인 레드", "차콜 블랙"],
    sizes: ["183cm x 61cm (기본)", "183cm x 68cm (와이드)"],
    description: `
      <p>5mm 두께의 NBR 천연 고무 재질로 탁월한 그립감과 쿠션감을 동시에 제공하는 프리미엄 요가 매트.</p>
      <ul>
        <li>NBR 천연 고무 + PU 레더 상단 이중 레이어</li>
        <li>두께 5mm 최적의 쿠션 & 안정감</li>
        <li>SGS 친환경 무독성 인증</li>
        <li>초 고밀도 패턴 그립 (땀에도 미끄럼 없음)</li>
        <li>전용 스트랩 및 파우치 포함</li>
      </ul>
    `,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80"
    ]
  }
];

// ─── 장바구니 유틸리티 ───────────────────────────────────────

const Cart = {
  STORAGE_KEY: 'shopx_cart',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  },

  add(productId, qty = 1, color = null, size = null) {
    const items = this.getAll();
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const key = `${productId}-${color}-${size}`;
    const existing = items.find(i => i.key === key);

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        key,
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        color,
        size,
        qty
      });
    }
    this.save(items);
  },

  remove(key) {
    const items = this.getAll().filter(i => i.key !== key);
    this.save(items);
  },

  updateQty(key, qty) {
    const items = this.getAll();
    const item = items.find(i => i.key === key);
    if (item) {
      if (qty <= 0) { this.remove(key); return; }
      item.qty = qty;
      this.save(items);
    }
  },

  clear() {
    this.save([]);
  },

  totalCount() {
    return this.getAll().reduce((s, i) => s + i.qty, 0);
  },

  totalPrice() {
    return this.getAll().reduce((s, i) => s + i.price * i.qty, 0);
  }
};

// ─── 공통 헬퍼 함수 ────────────────────────────────────────

function formatPrice(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = Cart.totalCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('shopx-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shopx-toast';
    document.body.appendChild(toast);
  }
  toast.className = `shopx-toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '!'}</span> ${message}`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}
