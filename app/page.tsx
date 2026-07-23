"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const destinations = ["여행", "축제", "결혼식", "데이트", "출근·학교"];
  const [country, setCountry] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const countries = ["한국", "일본", "프랑스", "인도", "태국"];
  const [travelDate, setTravelDate] = useState("");
  const [season, setSeason] = useState("");
  const [weather, setWeather] = useState("");
  const seasons = ["봄", "여름", "가을", "겨울"];

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
    <main ref={pageRef} className="home">
      <header>
        <p className="eyebrow">MY CLOSET DIARY</p>
        <h1>오늘, 뭐 입지</h1>
        <p className="subtitle">내 옷장에서 찾는 오늘의 코디</p>
      </header>

      <Card className="closet-card">
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

      <section className="choice-sheet" aria-labelledby="destination-title">
        <span className="step-mark">01</span>
        <h2 id="destination-title">어디에 갈 예정인가요?</h2>
        <p>오늘의 장소를 하나 골라주세요.</p>
        <div className="choice-grid">
          {destinations.map((item) => (
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
          <span>다른 장소가 있다면</span>
          <input
            type="text"
            value={customDestination}
            placeholder="예: 미술관, 캠핑, 콘서트"
            onChange={(event) => {
              setCustomDestination(event.target.value);
              setDestination(event.target.value.trim());
            }}
          />
        </label>
        <div className="choice-note" aria-live="polite">
          {destination ? `${destination}에 어울리는 옷을 찾아볼게요.` : "선택을 기다리고 있어요."}
        </div>
      </section>

      <section className="choice-sheet" aria-labelledby="country-title">
        <span className="step-mark">02</span>
        <h2 id="country-title">어느 나라에서 입을까요?</h2>
        <p>현지 분위기와 문화를 코디에 반영할게요.</p>
        <div className="choice-grid">
          {countries.map((item) => (
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
          <span>다른 나라가 있다면</span>
          <input
            type="text"
            value={customCountry}
            placeholder="예: 이탈리아, 베트남, 미국"
            onChange={(event) => {
              setCustomCountry(event.target.value);
              setCountry(event.target.value.trim());
            }}
          />
        </label>
        <div className="choice-note" aria-live="polite">
          {country ? `${country}의 분위기와 문화를 살펴볼게요.` : "나라 선택을 기다리고 있어요."}
        </div>
      </section>

      <section className="choice-sheet" aria-labelledby="weather-title">
        <span className="step-mark">03</span>
        <h2 id="weather-title">언제, 어떤 날씨에 입을까요?</h2>
        <p>날씨에 편안한 소재와 겹쳐 입기를 추천할게요.</p>
        <div className="detail-fields">
          <label className="field-label">
            <span>날짜</span>
            <input
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
            />
          </label>
          <fieldset>
            <legend>계절</legend>
            <div className="choice-grid season-grid">
              {seasons.map((item) => (
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
            <span>예상 날씨</span>
            <select value={weather} onChange={(event) => setWeather(event.target.value)}>
              <option value="">골라주세요</option>
              <option value="맑고 따뜻함">맑고 따뜻함</option>
              <option value="덥고 습함">덥고 습함</option>
              <option value="선선함">선선함</option>
              <option value="춥고 건조함">춥고 건조함</option>
              <option value="비 또는 눈">비 또는 눈</option>
            </select>
          </label>
        </div>
        <div className="choice-note" aria-live="polite">
          {travelDate || season || weather
            ? [travelDate, season, weather].filter(Boolean).join(" · ")
            : "날짜와 날씨 선택을 기다리고 있어요."}
        </div>
      </section>
    </main>
  );
}
