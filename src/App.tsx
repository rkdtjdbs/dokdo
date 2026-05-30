/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Lesson1Geographics from './components/Lesson1Geographics';
import Lesson2History from './components/Lesson2History';
import Lesson3ModernConf from './components/Lesson3ModernConf';
import Lesson4Activity from './components/Lesson4Activity';
import ReflectiveEssayWriter from './components/ReflectiveEssayWriter';
import { BookOpen, Award, Sparkles, Check, ChevronRight, HelpCircle, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // 로컬스토리지 학습완료 상태 불러오기
  useEffect(() => {
    const savedCompleted = localStorage.getItem('dokdo_completed_lessons');
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedKeys(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 완료된 차시에 기반하여 진도율 계산
  useEffect(() => {
    const totalLessons = 5;
    const completedCount = completedKeys.length;
    const calcPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    setProgressPercent(calcPercent);

    if (calcPercent === 100) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [completedKeys]);

  const toggleComplete = (key: string) => {
    let updated;
    if (completedKeys.includes(key)) {
      updated = completedKeys.filter((k) => k !== key);
    } else {
      updated = [...completedKeys, key];
    }
    setCompletedKeys(updated);
    localStorage.setItem('dokdo_completed_lessons', JSON.stringify(updated));
  };

  const handleActivitySubmit = (isSubmitted: boolean) => {
    const key = 'lesson4';
    let updated;
    if (isSubmitted) {
      if (!completedKeys.includes(key)) {
        updated = [...completedKeys, key];
        setCompletedKeys(updated);
        localStorage.setItem('dokdo_completed_lessons', JSON.stringify(updated));
      }
    } else {
      if (completedKeys.includes(key)) {
        updated = completedKeys.filter((k) => k !== key);
        setCompletedKeys(updated);
        localStorage.setItem('dokdo_completed_lessons', JSON.stringify(updated));
      }
    }
  };

  // 현재 탭 렌더링 매핑
  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <Lesson1Geographics 
            completedKeys={completedKeys} 
            toggleComplete={toggleComplete} 
          />
        );
      case 2:
        return (
          <Lesson2History 
            completedKeys={completedKeys} 
            toggleComplete={toggleComplete} 
          />
        );
      case 3:
        return (
          <Lesson3ModernConf 
            completedKeys={completedKeys} 
            toggleComplete={toggleComplete} 
          />
        );
      case 4:
        return (
          <Lesson4Activity 
            completedKeys={completedKeys} 
            toggleComplete={toggleComplete} 
            onActivitySubmit={handleActivitySubmit}
          />
        );
      case 5:
        return (
          <ReflectiveEssayWriter 
            completedKeys={completedKeys} 
            toggleComplete={toggleComplete} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text-main flex flex-col font-sans selection:bg-white/10 selection:text-white">
      
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        progressPercent={progressPercent} 
      />

      {/* 2. 메인 컨텐츠 에어리어 */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 학습 완료 축하 골든 컴포넌트배너 */}
        {showCelebration && (
          <div className="mb-10 p-8 bg-editorial-card rounded-xl border border-editorial-accent/30 text-editorial-text-main flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center space-x-5">
              <div className="p-3 bg-editorial-accent/10 rounded-lg text-editorial-accent border border-editorial-accent/20 shrink-0">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif tracking-tight text-white flex items-center space-x-1.5 justify-center md:justify-start">
                  <span>독도 평화 수호 지성 인증서 달성</span>
                </h3>
                <p className="text-xs text-editorial-text-muted mt-1.5 max-w-xl leading-relaxed">
                  축하합니다! 독도의 지질적·지리적 성격부터 고문서 교차 고증 및 현대 갈등의 해결 방안까지 모든 교과 차시와 공동 집필 활동지를 탁월하게 완료하셨습니다.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCelebration(false)}
              className="px-6 py-2.5 bg-editorial-accent hover:bg-yellow-600 text-black font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
            >
              확인
            </button>
          </div>
        )}

        {/* 탭 본문 렌더러 */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>

        {/* 3. 각 차시 퀵 플로우 가이드 (단원 하단 네비게이션) */}
        <div className="mt-16 pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-center justify-between gap-4 text-editorial-text-muted text-xs print:hidden">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-editorial-accent" />
            <span className="font-semibold text-editorial-text-muted tracking-wider uppercase font-sans">대한민국 역사·지리 평화교육위원회 보충 교안</span>
          </div>

          <div className="flex items-center space-x-2">
            {currentTab > 1 && (
              <button
                id="btn-prev-lesson"
                onClick={() => setCurrentTab(currentTab - 1)}
                className="px-5 py-2.5 bg-editorial-card hover:bg-editorial-card-hover text-editorial-text-main font-medium border border-editorial-border rounded transition-all duration-200 cursor-pointer"
              >
                ← 이전 차시 학습
              </button>
            )}
            
            {currentTab < 5 ? (
              <button
                id="btn-next-lesson"
                onClick={() => setCurrentTab(currentTab + 1)}
                className="px-5 py-2.5 bg-editorial-accent hover:bg-white text-[#141414] font-bold inline-flex items-center gap-1.5 rounded tracking-wider transition-all duration-250 cursor-pointer"
              >
                <span>다음 차시 학습</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="bg-emerald-950/40 text-emerald-400 px-4 py-2.5 rounded font-bold border border-emerald-900/40 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>모든 학습완료</span>
              </span>
            )}
          </div>
        </div>

      </main>

      {/* 4. 우아하고 겸손한 사이트 푸터 */}
      <footer className="bg-[#0b0b0b] border-t border-editorial-border text-editorial-text-muted text-xs py-10 mt-20 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-3">
              <span className="text-white font-serif font-semibold block text-base tracking-tight">독도 영토 주권 교육 종합 플랫폼</span>
              <p className="text-neutral-500 leading-relaxed max-w-md text-xs font-light">
                본 웹 에듀케이션 어플리케이션은 중·고등용 역사 및 지리 융합 수업을 돕기 위해 교육위원회가 보충 교안으로 제작하여 무료 배포 중인 수업 보조 자료입니다.
              </p>
            </div>

            <div className="md:text-right space-y-2">
              <p className="text-neutral-400 font-serif font-medium text-sm">대한민국 역사·지리 평화교육위원회 엮음</p>
              <p className="text-neutral-600 font-mono text-[11px] tracking-wider uppercase">개정 검인 연월일: 2026년 5월 • 🔒 주권 상시 수호 중</p>
              <div className="flex md:justify-end items-center space-x-1.5 text-neutral-500 text-[10px] pt-1 font-light">
                <Heart className="w-3.5 h-3.5 text-rose-800 fill-rose-900 shrink-0" />
                <span>동해상에 고요히 상존하는 한국 영토의 미래를 염원합니다.</span>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
