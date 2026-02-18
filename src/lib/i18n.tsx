"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "pt" | "zh" | "hi";

interface Translations {
  nav: {
    ranking: string;
    howItWorks: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    viewRanking: string;
    exploreModels: string;
  };
  ranking: {
    title: string;
    subtitle: string;
    filterCoding: string;
    filterGeneral: string;
    filterPrice: string;
    rank: string;
    model: string;
    inputPrice: string;
    outputPrice: string;
    score: string;
    per1MTokens: string;
    updatedVia: string;
  };
  methodology: {
    title: string;
    dataCollection: string;
    dataCollectionDesc: string;
    smartCalc: string;
    smartCalcDesc: string;
    weeklyUpdate: string;
    weeklyUpdateDesc: string;
  };
  sources: {
    title: string;
    openrouter: string;
    swebench: string;
    arena: string;
    artificialAnalysis: string;
  };
  footer: {
    year: string;
  };
}

const translations: Record<Locale, Translations> = {
  pt: {
    nav: {
      ranking: "Ranking",
      howItWorks: "Como Funciona",
    },
    hero: {
      badge: "Ranking atualizado semanalmente",
      title: "Melhor Custo-Benefício em IA",
      subtitle: "Compare modelos de IA por performance por dólar gasto. Encontre o melhor modelo pelo menor preço.",
      viewRanking: "Ver Ranking",
      exploreModels: "Explorar Modelos",
    },
    ranking: {
      title: "Ranking",
      subtitle: "Modelos ordenados pelo melhor desempenho por dólar gasto",
      filterCoding: "Código",
      filterGeneral: "Geral",
      filterPrice: "Preço",
      rank: "Rank",
      model: "Modelo",
      inputPrice: "Input",
      outputPrice: "Output",
      score: "Score",
      per1MTokens: "/1M tokens",
      updatedVia: "Dados atualizados automaticamente via OpenRouter",
    },
    methodology: {
      title: "Como Funciona",
      dataCollection: "Coleta de Dados",
      dataCollectionDesc: "Monitoramos preços em tempo real da OpenRouter e benchmarks oficiais como SWE-bench e Arena.",
      smartCalc: "Cálculo Inteligente",
      smartCalcDesc: "Usamos a fórmula: Score = (Performance ÷ Preço) × 100. Quanto maior, melhor o custo-benefício.",
      weeklyUpdate: "Atualização Semanal",
      weeklyUpdateDesc: "Preços de LLMs mudam constantemente. Nossos dados são atualizados automaticamente toda semana.",
    },
    sources: {
      title: "Fontes Confiáveis",
      openrouter: "Preços em tempo real",
      swebench: "Benchmarks de código",
      arena: "Rankings ELO",
      artificialAnalysis: "Métricas de performance",
    },
    footer: {
      year: "2026",
    },
  },
  en: {
    nav: {
      ranking: "Ranking",
      howItWorks: "How It Works",
    },
    hero: {
      badge: "Weekly updated ranking",
      title: "Best AI Value for Money",
      subtitle: "Compare AI models by performance per dollar spent. Find the best model at the lowest price.",
      viewRanking: "View Ranking",
      exploreModels: "Explore Models",
    },
    ranking: {
      title: "Ranking",
      subtitle: "Models ranked by best performance per dollar spent",
      filterCoding: "Coding",
      filterGeneral: "General",
      filterPrice: "Price",
      rank: "Rank",
      model: "Model",
      inputPrice: "Input",
      outputPrice: "Output",
      score: "Score",
      per1MTokens: "/1M tokens",
      updatedVia: "Data automatically updated via OpenRouter",
    },
    methodology: {
      title: "How It Works",
      dataCollection: "Data Collection",
      dataCollectionDesc: "We monitor real-time prices from OpenRouter and official benchmarks like SWE-bench and Arena.",
      smartCalc: "Smart Calculation",
      smartCalcDesc: "We use the formula: Score = (Performance ÷ Price) × 100. Higher is better value for money.",
      weeklyUpdate: "Weekly Updates",
      weeklyUpdateDesc: "LLM prices change constantly. Our data is automatically updated every week.",
    },
    sources: {
      title: "Trusted Sources",
      openrouter: "Real-time prices",
      swebench: "Code benchmarks",
      arena: "ELO rankings",
      artificialAnalysis: "Performance metrics",
    },
    footer: {
      year: "2026",
    },
  },
  zh: {
    nav: {
      ranking: "排名",
      howItWorks: "工作原理",
    },
    hero: {
      badge: "每周更新排名",
      title: "最佳AI性价比",
      subtitle: "按每美元性能比较AI模型。以最低价格找到最佳模型。",
      viewRanking: "查看排名",
      exploreModels: "探索模型",
    },
    ranking: {
      title: "排名",
      subtitle: "按每美元最佳性能排序的模型",
      filterCoding: "编程",
      filterGeneral: "通用",
      filterPrice: "价格",
      rank: "排名",
      model: "模型",
      inputPrice: "输入",
      outputPrice: "输出",
      score: "分数",
      per1MTokens: "/百万tokens",
      updatedVia: "数据通过OpenRouter自动更新",
    },
    methodology: {
      title: "工作原理",
      dataCollection: "数据收集",
      dataCollectionDesc: "我们监控OpenRouter的实时价格和SWE-bench、Arena等官方基准测试。",
      smartCalc: "智能计算",
      smartCalcDesc: "我们使用公式：分数 = (性能 ÷ 价格) × 100。分数越高，性价比越好。",
      weeklyUpdate: "每周更新",
      weeklyUpdateDesc: "LLM价格不断变化。我们的数据每周自动更新。",
    },
    sources: {
      title: "可信来源",
      openrouter: "实时价格",
      swebench: "代码基准测试",
      arena: "ELO排名",
      artificialAnalysis: "性能指标",
    },
    footer: {
      year: "2026",
    },
  },
  hi: {
    nav: {
      ranking: "रैंकिंग",
      howItWorks: "यह कैसे काम करता है",
    },
    hero: {
      badge: "साप्ताहिक अपडेटेड रैंकिंग",
      title: "सर्वश्रेष्ठ AI मूल्य",
      subtitle: "प्रति डॉलर प्रदर्शन के अनुसार AI मॉडल की तुलना करें। सबसे कम कीमत पर सर्वश्रेष्ठ मॉडल खोजें।",
      viewRanking: "रैंकिंग देखें",
      exploreModels: "मॉडल देखें",
    },
    ranking: {
      title: "रैंकिंग",
      subtitle: "प्रति डॉलर सर्वश्रेष्ठ प्रदर्शन के अनुसार क्रमबद्ध मॉडल",
      filterCoding: "कोडिंग",
      filterGeneral: "सामान्य",
      filterPrice: "मूल्य",
      rank: "रैंक",
      model: "मॉडल",
      inputPrice: "इनपुट",
      outputPrice: "आउटपुट",
      score: "स्कोर",
      per1MTokens: "/1M टोकन",
      updatedVia: "OpenRouter के माध्यम से स्वचालित रूप से अपडेट किया गया डेटा",
    },
    methodology: {
      title: "यह कैसे काम करता है",
      dataCollection: "डेटा संग्रह",
      dataCollectionDesc: "हम OpenRouter से वास्तविक समय की कीमतों और SWE-bench और Arena जैसे आधिकारिक बेंचमार्क की निगरानी करते हैं।",
      smartCalc: "स्मार्ट गणना",
      smartCalcDesc: "हम सूत्र का उपयोग करते हैं: स्कोर = (प्रदर्शन ÷ मूल्य) × 100। उच्चतर बेहतर मूल्य है।",
      weeklyUpdate: "साप्ताहिक अपडेट",
      weeklyUpdateDesc: "LLM कीमतें लगातार बदलती हैं। हमारा डेटा हर हफ्ते स्वचालित रूप से अपडेट होता है।",
    },
    sources: {
      title: "विश्वसनीय स्रोत",
      openrouter: "वास्तविक समय की कीमतें",
      swebench: "कोड बेंचमार्क",
      arena: "ELO रैंकिंग",
      artificialAnalysis: "प्रदर्शन मेट्रिक्स",
    },
    footer: {
      year: "2026",
    },
  },
};

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];
