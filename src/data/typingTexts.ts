import type { TypingText } from '../game/raceTypes';

export const TYPING_TEXTS: TypingText[] = [
  // Tiếng Việt - Dễ
  {
    id: 'vi-easy-1',
    title: 'Học Đi Đôi Với Hành',
    content: 'Học tập không chỉ là tiếp thu kiến thức mà còn là rèn luyện kỹ năng mỗi ngày. Kiên trì là chiếc chìa khóa mở ra cánh cửa thành công.',
    language: 'vi',
    difficulty: 'easy',
    category: 'proverbs'
  },
  {
    id: 'vi-easy-2',
    title: 'Sức Mạnh Của Thói Quen',
    content: 'Mỗi ngày gõ phím mười lăm phút giúp bạn làm việc nhanh hơn và tiết kiệm nhiều giờ quý báu mỗi tuần.',
    language: 'vi',
    difficulty: 'easy',
    category: 'life'
  },
  {
    id: 'vi-easy-3',
    title: 'Biển Cả Và Cánh Buồm',
    content: 'Biển lặng không bao giờ tạo nên những thủy thủ tài ba. Vượt qua thử thách chính là cách chúng ta trưởng thành.',
    language: 'vi',
    difficulty: 'easy',
    category: 'life'
  },

  // Tiếng Việt - Trung bình
  {
    id: 'vi-med-1',
    title: 'Kỷ Nguyên Trí Tuệ Nhân Tạo',
    content: 'Công nghệ phát triển với tốc độ chóng mặt, thay đổi hoàn toàn cách con người làm việc và giao tiếp. Người làm chủ công cụ số luôn nắm bắt được cơ hội lớn hơn.',
    language: 'vi',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: 'vi-med-2',
    title: 'Nghệ Thuật Lập Trình',
    content: 'Mã nguồn sạch là sự phản chiếu của một tư duy rõ ràng và mạch lạc. Viết code cho máy hiểu thì dễ, nhưng viết code để đồng đội dễ đọc mới là thử thách thực sự.',
    language: 'vi',
    difficulty: 'medium',
    category: 'coding'
  },
  {
    id: 'vi-med-3',
    title: 'Hương Vị Cà Phê Sáng',
    content: 'Một buổi sáng trong lành với tách cà phê thơm nồng bên khung cửa sổ. Những dòng chữ nhảy múa trên màn hình theo từng nhịp gõ phím rộn rã.',
    language: 'vi',
    difficulty: 'medium',
    category: 'life'
  },

  // Tiếng Việt - Khó (Nhiều dấu, từ ghép, dấu câu)
  {
    id: 'vi-hard-1',
    title: 'Khát Vọng Đổi Mới Sáng Tạo',
    content: 'Để bứt phá khỏi những khuôn mẫu cũ kỹ, chúng ta cần lòng dũng cảm, sự nhẫn nại phi thường và một khát khao mãnh liệt không ngừng nghỉ hướng tới đỉnh cao tri thức.',
    language: 'vi',
    difficulty: 'hard',
    category: 'life'
  },
  {
    id: 'vi-hard-2',
    title: 'Kiến Trúc Hệ Thống Hiện Đại',
    content: 'Việc tối ưu hóa hiệu năng, giảm thiểu độ trễ mạng và xử lý đồng bộ hóa thời gian thực đòi hỏi sự thấu hiểu sâu sắc về kiến trúc mạng và thuật toán phân tán.',
    language: 'vi',
    difficulty: 'hard',
    category: 'technology'
  },

  // English - Easy
  {
    id: 'en-easy-1',
    title: 'The Quick Brown Fox',
    content: 'The quick brown fox jumps over the lazy dog. Practice makes perfect when you type with speed and steady rhythm.',
    language: 'en',
    difficulty: 'easy',
    category: 'life'
  },
  {
    id: 'en-easy-2',
    title: 'Focus and Speed',
    content: 'Keep your eyes on the road and your hands on the home row keys. Consistency beats raw speed every single time.',
    language: 'en',
    difficulty: 'easy',
    category: 'life'
  },
  {
    id: 'en-easy-3',
    title: 'The Art of Typing',
    content: 'Touch typing allows your fingers to fly across the keys without looking down. Accuracy first, then speed will follow naturally.',
    language: 'en',
    difficulty: 'easy',
    category: 'life'
  },
  {
    id: 'en-easy-4',
    title: 'Morning Sunshine',
    content: 'The golden rays of dawn light up the horizon. A fresh cup of coffee and a clear mind are the best recipe for high productivity.',
    language: 'en',
    difficulty: 'easy',
    category: 'life'
  },

  // English - Medium
  {
    id: 'en-med-1',
    title: 'Clean Code Philosophy',
    content: 'Simplicity is prerequisite for reliability. Programs must be written for people to read, and only incidentally for machines to execute.',
    language: 'en',
    difficulty: 'medium',
    category: 'coding',
    author: 'Harold Abelson'
  },
  {
    id: 'en-med-2',
    title: 'The Speed of Light',
    content: 'In a world driven by instant data and fiber optic pulses, the ability to express ideas swiftly through a keyboard is a superpower.',
    language: 'en',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: 'en-med-3',
    title: 'The Horizon of Innovation',
    content: 'Technological revolutions do not arrive on gentle whispers; they storm into existence, fundamentally rewiring every pillar of human civilization.',
    language: 'en',
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: 'en-med-4',
    title: 'The Symphony of Keyboards',
    content: 'Every keystroke echoes like a mechanical rhythm in a grand digital symphony, turning abstract thoughts into tangible reality.',
    language: 'en',
    difficulty: 'medium',
    category: 'coding'
  },

  // English - Hard
  {
    id: 'en-hard-1',
    title: 'Algorithmic Wonders',
    content: 'Premature optimization is the root of all evil in software engineering; yet mastering concurrency, distributed consensus, and asynchronous queues separates legends from novices.',
    language: 'en',
    difficulty: 'hard',
    category: 'coding',
    author: 'Donald Knuth'
  },
  {
    id: 'en-hard-2',
    title: 'Quantum Horizons',
    content: 'Superposition and entanglement challenge our macroscopic intuition, unlocking unimaginable computational horizons that render conventional cryptography obsolete.',
    language: 'en',
    difficulty: 'hard',
    category: 'technology'
  },
  {
    id: 'en-hard-3',
    title: 'Distributed Resiliency',
    content: 'Building fault-tolerant distributed architectures requires navigating network partitions, Byzantine failures, and eventual consistency with surgical precision.',
    language: 'en',
    difficulty: 'hard',
    category: 'coding'
  }
];

const CUSTOM_TEXTS_KEY = 'typerace_custom_passages';

function getCustomTexts(): TypingText[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEXTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }
  return [];
}

export function getAllTexts(): TypingText[] {
  return [...TYPING_TEXTS, ...getCustomTexts()];
}

export function addCustomText(newText: Omit<TypingText, 'id'>): TypingText {
  const custom = getCustomTexts();
  const created: TypingText = {
    ...newText,
    id: `custom_${Date.now()}`
  };
  custom.unshift(created);
  localStorage.setItem(CUSTOM_TEXTS_KEY, JSON.stringify(custom));
  return created;
}

export function deleteCustomText(id: string): void {
  const custom = getCustomTexts();
  const filtered = custom.filter(t => t.id !== id);
  localStorage.setItem(CUSTOM_TEXTS_KEY, JSON.stringify(filtered));
}

export function getRandomText(language: 'vi' | 'en' = 'en', difficulty?: 'easy' | 'medium' | 'hard'): TypingText {
  const all = getAllTexts();
  const filtered = all.filter(t => {
    if (t.language !== language) return false;
    if (difficulty && t.difficulty !== difficulty) return false;
    return true;
  });
  if (filtered.length === 0) {
    return all.find(t => t.language === language) || all[0];
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
