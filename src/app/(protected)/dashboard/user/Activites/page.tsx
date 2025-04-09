'use client';

import React, { useState } from 'react';

type Activity = {
  id: number;
  title: string;
  description: string;
  place: string;
  mood: string;
  style: string;
  budget: string;
};

const activities: Activity[] = [
  {
    id: 1,
    title: "قهيوة و لودو",
    description: "إمشيو لقهوة، جيب لودو ولا كارت و دبرها ضحك و لعب.",
    place: "قهوة",
    mood: "ضحك",
    style: "بسيط",
    budget: "رخيص",
  },
  {
    id: 2,
    title: "بيكنيك في البحر",
    description: "فرشو مانطة، عملو ساندويتش و شوية موسيقى.",
    place: "بحر",
    mood: "رومانسي",
    style: "إبداعي",
    budget: "رخيص",
  },
  {
    id: 3,
    title: "فيلم و بوبكورن في الدار",
    description: "إختارو فيلم، عملو بوبكورن و تفرجو مرتاحين.",
    place: "دار",
    mood: "هادي",
    style: "بسيط",
    budget: "مجاني",
  },
  {
    id: 4,
    title: "رسم مع بعضكم",
    description: "جبو ألوان و ورقة، و خليو الإبداع يخرج.",
    place: "دار",
    mood: "إبداعي",
    style: "إبداعي",
    budget: "رخيص",
  },
  {
    id: 5,
    title: "مساج في الدار",
    description: "بدل الجو، و عمل مساج للبعضكم.",
    place: "دار",
    mood: "رومانسي",
    style: "ريلاكسي",
    budget: "مجاني",
  },
  {
    id: 6,
    title: "دورة في المدينة",
    description: "تفرجو، تصورو، و عيشو الأجواء.",
    place: "مدينة",
    mood: "مغامرة",
    style: "بسيط",
    budget: "مجاني",
  },
];

const filters = {
  place: ["الكل", "بحر", "دار", "قهوة", "مدينة"],
  mood: ["الكل", "رومانسي", "ضحك", "هادي", "إبداعي", "مغامرة"],
  style: ["الكل", "بسيط", "إبداعي", "ريلاكسي", "رياضي"],
  budget: ["الكل", "مجاني", "رخيص", "فاخر"],
};

export default function ActivitesCouple() {
  const [selected, setSelected] = useState({
    place: "الكل",
    mood: "الكل",
    style: "الكل",
    budget: "الكل",
  });

  const handleFilterChange = (key: keyof typeof selected, value: string) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = activities.filter((act) =>
    (selected.place === "الكل" || act.place === selected.place) &&
    (selected.mood === "الكل" || act.mood === selected.mood) &&
    (selected.style === "الكل" || act.style === selected.style) &&
    (selected.budget === "الكل" || act.budget === selected.budget)
  );

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-red-600">أفكار نشاطات للمخطوبين / الأزواج</h1>
      <p className="text-gray-700">فلتر على حسب المكان، الحالة، الستايل والميزانية ✨</p>

      {/* الفلاتر */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        {Object.entries(filters).map(([key, values]) => (
          <div key={key} className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-600">{key}</h4>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(key as keyof typeof selected, value)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selected[key as keyof typeof selected] === value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-red-600 border-red-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* النتائج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-pink-50 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-red-600">{act.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{act.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white">
              <span className="bg-red-400 px-2 py-1 rounded-full">{act.place}</span>
              <span className="bg-red-500 px-2 py-1 rounded-full">{act.mood}</span>
              <span className="bg-red-600 px-2 py-1 rounded-full">{act.style}</span>
              <span className="bg-red-700 px-2 py-1 rounded-full">{act.budget}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            ما فماش نشاطات بالمواصفات هاذي 😢
          </p>
        )}
      </div>
    </div>
  );
}
