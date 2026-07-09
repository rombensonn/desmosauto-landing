"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ScrollAnimate } from "./ScrollAnimate";

const AeoNeuroSearchScene = dynamic(
  () => import("./AeoNeuroSearchScene").then((module) => module.AeoNeuroSearchScene),
  {
    ssr: false,
    loading: () => <AeoNeuroSearchFallback loading />
  }
);

export function AeoNeuroSearchBlock() {
  const reducedMotion = useReducedMotion();
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setWebglAvailable(canUseWebGL());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="aeo-neuro-section section-y" aria-labelledby="aeo-neuro-title">
      <div className="container-page aeo-neuro-grid">
        <ScrollAnimate className="aeo-neuro-copy">
          <p className="eyebrow">Нейро-выдача наглядно</p>
          <h2 id="aeo-neuro-title">Как AEO превращает вопрос клиента в понятный ответ</h2>
          <p className="aeo-neuro-lead">
            Клиент пишет симптом обычными словами. AEO помогает странице дать ответ в формате, который легко прочитать человеку и разобрать AI-поиску.
          </p>
          <div className="aeo-neuro-answer">
            <p>Короткий ответ</p>
            <p>
              Если машину ведет в сторону после замены шин, причина может быть в давлении, балансировке, износе или углах установки колес.
            </p>
          </div>
          <div className="aeo-neuro-points" aria-label="Из чего состоит AEO-ответ">
            <div>
              <span>01</span>
              <p>Вопрос клиента становится точным заголовком блока.</p>
            </div>
            <div>
              <span>02</span>
              <p>Ответ дает причину, ограничение и безопасный следующий шаг.</p>
            </div>
            <div>
              <span>03</span>
              <p>Доказательства и заявка находятся рядом, без лишнего поиска по странице.</p>
            </div>
          </div>
        </ScrollAnimate>

        <ScrollAnimate animation="zoomIn" delay={120} threshold={0.08} className="aeo-neuro-stage" data-aeo-neuro-stage>
          <AeoNeuroSearchFallback loading={webglAvailable === null} />
          {webglAvailable === true ? <AeoNeuroSearchScene reducedMotion={Boolean(reducedMotion)} /> : null}
        </ScrollAnimate>
      </div>
    </section>
  );
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    return Boolean(window.WebGLRenderingContext && context);
  } catch {
    return false;
  }
}

function AeoNeuroSearchFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="aeo-neuro-static" data-aeo-neuro-fallback={loading ? "loading" : "static"}>
      <div className="aeo-neuro-browser-ui">
        <div className="aeo-neuro-browser-top">
          <span />
          <span />
          <span />
          <p>{loading ? "Готовим 3D-сцену" : "Поисковый ответ"}</p>
        </div>
        <div className="aeo-neuro-search-line">
          <span>Запрос</span>
          <p>почему машину ведет в сторону после замены шин</p>
        </div>
        <div className="aeo-neuro-result-card">
          <p>Нейро-выдача</p>
          <h3>Начните с проверки давления, балансировки и углов колес.</h3>
          <p>
            Точную причину нельзя подтвердить без осмотра. Запишите автомобиль на диагностику ходовой и колес.
          </p>
        </div>
        <div className="aeo-neuro-result-grid">
          <span>вопрос клиента</span>
          <span>короткий ответ</span>
          <span>доказательство</span>
          <span>заявка</span>
        </div>
      </div>
    </div>
  );
}
