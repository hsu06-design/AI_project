"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);

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
    </main>
  );
}
