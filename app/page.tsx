"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { translations, type Language } from "./translations";
import { selectionTranslations } from "./selection-translations";

const countryStyleItems = [
  {
    image: "/country-styles/korea-hanbok.jpg",
    outfit: "Hanbok",
    source: "https://commons.wikimedia.org/wiki/File:Korean_women%27s_hanbok.jpg",
  },
  {
    image: "/country-styles/japan-kimono.jpg",
    outfit: "Kimono",
    source: "https://commons.wikimedia.org/wiki/File:Japanese_Kimono.jpg",
  },
  {
    image: "/country-styles/france-breton.jpg",
    outfit: "Breton Folk Dress",
    source: "https://commons.wikimedia.org/wiki/File:FIL_2009_-_Bretonne_en_costume_traditionel_1.JPG",
  },
  {
    image: "/country-styles/india-sari.jpg",
    outfit: "Sari",
    source: "https://commons.wikimedia.org/wiki/File:Indian_Woman_in_Saree.jpg",
  },
  {
    image: "/country-styles/thailand-chut-thai.jpg",
    outfit: "Chut Thai Amarin",
    source: "https://commons.wikimedia.org/wiki/File:Chut_Thai_Amarin.jpg",
  },
];

const countryStyleCopy: Record<Language, { title: string; description: string; source: string }> = {
  ko: { title: "나라별 문화 스타일", description: "각 나라의 문화와 이야기가 담긴 옷을 사진으로 둘러보세요.", source: "사진 출처" },
  en: { title: "Cultural Styles", description: "Explore clothing that carries the culture and stories of each country.", source: "Photo source" },
  my: { title: "နိုင်ငံအလိုက် ယဉ်ကျေးမှုဝတ်စုံ", description: "နိုင်ငံတစ်ခုချင်းစီ၏ ယဉ်ကျေးမှုနှင့် ဇာတ်လမ်းများပါသော အဝတ်အစားများကို ကြည့်ပါ။", source: "ဓာတ်ပုံရင်းမြစ်" },
  vi: { title: "Trang phục văn hóa", description: "Khám phá trang phục mang văn hóa và câu chuyện của từng quốc gia.", source: "Nguồn ảnh" },
  ja: { title: "国別カルチャースタイル", description: "それぞれの国の文化と物語が込められた服を写真で見てみましょう。", source: "写真出典" },
  zh: { title: "各国文化服饰", description: "通过照片探索承载各国文化与故事的服装。", source: "图片来源" },
};

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const [activeView, setActiveView] = useState<"home" | "closet" | "countryStyles">("home");
  const [closetPhotos, setClosetPhotos] = useState<Array<{ id: string; src: string; name: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Language>("ko");
  const t = translations[language];
  const s = selectionTranslations[language];
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [country, setCountry] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [season, setSeason] = useState("");
  const [weather, setWeather] = useState("");
  const [desiredStyle, setDesiredStyle] = useState("");
  const [customStyle, setCustomStyle] = useState("");

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));
    setIsUploading(true);

    try {
      const response = await fetch("/api/closet", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setClosetPhotos(data.photos);
    } finally {
      setIsUploading(false);
    }

    event.target.value = "";
  };

  useEffect(() => {
    fetch("/api/closet")
      .then((response) => response.json())
      .then((data) => setClosetPhotos(data.photos ?? []))
      .catch(() => setClosetPhotos([]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    setDestination("");
    setCustomDestination("");
    setCountry("");
    setCustomCountry("");
    setSeason("");
    setWeather("");
    setDesiredStyle("");
    setCustomStyle("");
  }, [language]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from("header", {
        opacity: 0,
        duration: 1.25,
        ease: "power2.out",
      });

      gsap.from(".closet-card", {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".closet-card",
          start: "top 82%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".choice-sheet").forEach((sheet) => {
        gsap.from(sheet, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sheet,
            start: "top 82%",
            once: true,
          },
        });
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={pageRef} className={`home${isDark ? " dark-mode" : ""}`}>
      <nav className="top-nav" aria-label="주요 메뉴">
        <a className="nav-brand" href="#home">{t.brand}</a>
        <div className="nav-links">
          <a
            href="#home"
            aria-current={activeView === "home" ? "page" : undefined}
            onClick={() => setActiveView("home")}
          >
            {t.home}
          </a>
          <a href="#recommendation">{t.recommendation}</a>
          <a
            href="#closet-page"
            aria-current={activeView === "closet" ? "page" : undefined}
            onClick={() => setActiveView("closet")}
          >
            {t.closet}
          </a>
          <a
            href="#country-styles-page"
            aria-current={activeView === "countryStyles" ? "page" : undefined}
            onClick={() => setActiveView("countryStyles")}
          >
            {t.countryStyle}
          </a>
          <a href="#saved-outfits">{t.saved}</a>
        </div>
        <button
          className="settings-tab"
          type="button"
          aria-expanded={settingsOpen}
          aria-controls="settings-panel"
          onClick={() => setSettingsOpen((open) => !open)}
        >
          SETTING
        </button>
      </nav>

      {settingsOpen && (
        <aside id="settings-panel" className="settings-panel" aria-label="설정">
          <div className="settings-heading">
            <div>
              <span>SETTING</span>
              <h2>{t.personalize}</h2>
            </div>
            <button type="button" aria-label="설정 닫기" onClick={() => setSettingsOpen(false)}>
              {t.close}
            </button>
          </div>
          <div className="setting-row">
            <label htmlFor="language-setting">{t.language}</label>
            <select
              id="language-setting"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="my">မြန်မာဘာသာ</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div className="setting-row">
            <span>{t.displayMode}</span>
            <div className="mode-options" aria-label="화면 모드 선택">
              <button type="button" aria-pressed={!isDark} onClick={() => setIsDark(false)}>
                DAY
              </button>
              <button type="button" aria-pressed={isDark} onClick={() => setIsDark(true)}>
                NIGHT
              </button>
            </div>
          </div>
          <div className="setting-row account-row">
            <div>
              <span>{t.account}</span>
              <p>{t.accountDescription}</p>
            </div>
            <button type="button">{t.openAccount}</button>
          </div>
        </aside>
      )}

      <div hidden={activeView !== "home"}>
      <section id="home" className="hero-layout">
        <header>
          <p className="eyebrow">MY CLOSET DIARY</p>
          <h1>{t.heroTitle}</h1>
          <p className="subtitle">{t.subtitle}</p>
          <span className="hero-index">01 — DAILY LOOK</span>
        </header>

        <Card id="closet" className="closet-card">
          <Image
            src="/cream-tie-blouse.png"
            alt="크림색 리본 블라우스"
            width={1086}
            height={1448}
            priority
          />
          <CardContent className="card-copy">
            <span>TOP 01</span>
            <p>크림 리본 블라우스</p>
            <small>따뜻한 봄날의 데일리 룩</small>
          </CardContent>
        </Card>
      </section>

      <section id="recommendation" className="choice-sheet" aria-labelledby="destination-title">
        <span className="step-mark">01</span>
        <h2 id="destination-title">{s.destinationTitle}</h2>
        <p>{s.destinationDescription}</p>
        <div className="choice-grid">
          {s.destinations.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={destination === item}
              onClick={() => {
                setDestination(item);
                setCustomDestination("");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="custom-choice">
          <span>{s.customDestinationLabel}</span>
          <input
            type="text"
            value={customDestination}
            placeholder={s.customDestinationPlaceholder}
            onChange={(event) => {
              setCustomDestination(event.target.value);
              setDestination(event.target.value.trim());
            }}
          />
        </label>
        <div className="choice-note" aria-live="polite">
          {destination
            ? s.destinationSelected.replace("{value}", destination)
            : s.destinationWaiting}
        </div>
      </section>

      <section id="country" className="choice-sheet" aria-labelledby="country-title">
        <span className="step-mark">02</span>
        <h2 id="country-title">{s.countryTitle}</h2>
        <p>{s.countryDescription}</p>
        <div className="choice-grid">
          {s.countries.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={country === item}
              onClick={() => {
                setCountry(item);
                setCustomCountry("");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="custom-choice">
          <span>{s.customCountryLabel}</span>
          <input
            type="text"
            value={customCountry}
            placeholder={s.customCountryPlaceholder}
            onChange={(event) => {
              setCustomCountry(event.target.value);
              setCountry(event.target.value.trim());
            }}
          />
        </label>
        <div className="choice-note" aria-live="polite">
          {country ? s.countrySelected.replace("{value}", country) : s.countryWaiting}
        </div>
      </section>

      <section className="choice-sheet" aria-labelledby="weather-title">
        <span className="step-mark">03</span>
        <h2 id="weather-title">{s.weatherTitle}</h2>
        <p>{s.weatherDescription}</p>
        <div className="detail-fields">
          <label className="field-label">
            <span>{s.date}</span>
            <input
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
            />
          </label>
          <fieldset>
            <legend>{s.season}</legend>
            <div className="choice-grid season-grid">
              {s.seasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={season === item}
                  onClick={() => setSeason(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field-label">
            <span>{s.expectedWeather}</span>
            <select value={weather} onChange={(event) => setWeather(event.target.value)}>
              <option value="">{s.choose}</option>
              {s.weatherOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="choice-note" aria-live="polite">
          {travelDate || season || weather
            ? [travelDate, season, weather].filter(Boolean).join(" · ")
            : s.weatherWaiting}
        </div>
      </section>

      <section id="saved-outfits" className="choice-sheet" aria-labelledby="style-title">
        <span className="step-mark">04</span>
        <h2 id="style-title">{s.styleTitle}</h2>
        <p>{s.styleDescription}</p>
        <div className="choice-grid">
          {s.styles.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={desiredStyle === item}
              onClick={() => {
                setDesiredStyle(item);
                setCustomStyle("");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="custom-choice">
          <span>{s.customStyleLabel}</span>
          <input
            type="text"
            value={customStyle}
            placeholder={s.customStylePlaceholder}
            onChange={(event) => {
              setCustomStyle(event.target.value);
              setDesiredStyle(event.target.value.trim());
            }}
          />
        </label>
        <div className="choice-note" aria-live="polite">
          {desiredStyle ? s.styleSelected.replace("{value}", desiredStyle) : s.styleWaiting}
        </div>
      </section>
      </div>

      <section id="closet-page" className="closet-page" hidden={activeView !== "closet"}>
        <div className="closet-page-heading">
          <div>
            <span>MY WARDROBE</span>
            <h1>{t.closetPageTitle}</h1>
            <p>{t.closetPageDescription}</p>
          </div>
          <label className="photo-upload-button">
            {isUploading ? t.uploadingPhotos : t.addPhotos}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              disabled={isUploading}
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {closetPhotos.length === 0 ? (
          <div className="closet-empty">
            <span>+</span>
            <p>{t.closetEmpty}</p>
            <small>{t.uploadHint}</small>
          </div>
        ) : (
          <div className="closet-photo-grid">
            {closetPhotos.map((photo) => (
              <figure key={photo.id}>
                <img src={photo.src} alt={photo.name} />
                <figcaption>{photo.name}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section
        id="country-styles-page"
        className="country-style-page"
        hidden={activeView !== "countryStyles"}
      >
        <header className="country-style-heading">
          <span>CULTURE LOOKBOOK</span>
          <h1>{countryStyleCopy[language].title}</h1>
          <p>{countryStyleCopy[language].description}</p>
        </header>

        <div className="country-style-grid">
          {countryStyleItems.map((item, index) => (
            <article className="country-style-card" key={item.outfit}>
              <Image
                src={item.image}
                alt={`${s.countries[index]} ${item.outfit}`}
                width={960}
                height={1200}
              />
              <div>
                <span>{s.countries[index]}</span>
                <h2>{item.outfit}</h2>
                <a href={item.source} target="_blank" rel="noreferrer">
                  {countryStyleCopy[language].source} · Wikimedia Commons
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
