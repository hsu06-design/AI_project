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

      gsap.from(".choice-sheet", {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".choice-sheet",
          start: "top 82%",
          once: true,
        },
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
    </main>
  );
}
