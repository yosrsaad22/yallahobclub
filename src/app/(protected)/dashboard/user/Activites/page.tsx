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
  { id: 1, title: "قهيوة و لودو", description: "إمشيو لقهوة، جيب لودو ولا كارت و دبرها ضحك و لعب.", place: "قهوة", mood: "ضحك", style: "بسيط", budget: "رخيص" },
  { id: 2, title: "بيكنيك في البحر", description: "فرشو مانطة، عملو ساندويتش و شوية موسيقى.", place: "بحر", mood: "رومانسي", style: "إبداعي", budget: "رخيص" },
  { id: 3, title: "فيلم و بوبكورن في الدار", description: "إختارو فيلم، عملو بوبكورن و تفرجو مرتاحين.", place: "دار", mood: "هادي", style: "بسيط", budget: "مجاني" },
  { id: 4, title: "رسم مع بعضكم", description: "جبو ألوان و ورقة، و خليو الإبداع يخرج.", place: "دار", mood: "إبداعي", style: "إبداعي", budget: "رخيص" },
  { id: 5, title: "مساج في الدار", description: "بدل الجو، و عمل مساج للبعضكم.", place: "دار", mood: "رومانسي", style: "ريلاكسي", budget: "مجاني" },
  { id: 6, title: "دورة في المدينة", description: "تفرجو، تصورو، و عيشو الأجواء.", place: "مدينة", mood: "مغامرة", style: "بسيط", budget: "مجاني" },
];

const filters = {
  place: ["الكل", "بحر", "دار", "قهوة", "مدينة"],
  mood: ["الكل", "رومانسي", "ضحك", "هادي", "إبداعي", "مغامرة"],
  style: ["الكل", "بسيط", "إبداعي", "ريلاكسي", "رياضي"],
  budget: ["الكل", "مجاني", "رخيص", "فاخر"],
};

export default function ActivitesCouple() {
  const [selected, setSelected] = useState({ place: "الكل", mood: "الكل", style: "الكل", budget: "الكل" });

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
    <div className="p-6 space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-600 font-din">أفكار نشاطات</h1>
        <p className="text-lg text-gray-600 mt-2">فلتر على حسب المكان، الحالة، الستايل والميزانية ✨</p>
      </div>

      {/* الفلاتر */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 bg-white p-4 rounded-2xl shadow">
        {Object.entries(filters).map(([key, values]) => (
          <div key={key} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-500 font-din">{key}</h4>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(key as keyof typeof selected, value)}
                  className={`px-3 py-1 rounded-full text-sm font-din border transition-all duration-300 ${
                    selected[key as keyof typeof selected] === value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-red-600 border-red-600 hover:bg-red-100'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-red-600 font-din">{act.title}</h3>
              <p className="text-sm text-gray-700 mt-3 font-din leading-relaxed">{act.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-din">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">{act.place}</span>
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full">{act.mood}</span>
              <span className="bg-red-300 text-red-900 px-2 py-1 rounded-full">{act.style}</span>
              <span className="bg-red-400 text-white px-2 py-1 rounded-full">{act.budget}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-gray-400 font-din">
            ما فماش نشاطات بالمواصفات هاذي 😢
          </p>
        )}
      </div>
    </div>
  );
}
