import React from 'react';
import { BookOpen, Compass, FileText, Globe, Landmark, Award, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentTab: number;
  setCurrentTab: (tab: number) => void;
  progressPercent: number;
}

export default function Navigation({ currentTab, setCurrentTab, progressPercent }: NavigationProps) {
  const tabs = [
    { id: 1, label: '1차시: 지리적 특성', icon: Compass, sub: '위치, 거리 및 삼요소' },
    { id: 2, label: '2차시: 사료와 고지도', icon: Landmark, sub: '한·일 고문서 대조 분석' },
    { id: 3, label: '3차시: 현대 갈등과 공백', icon: Globe, sub: '조약, 평화선, 수비대' },
    { id: 4, label: '수업 활동지 작성', icon: FileText, sub: '공동 교과서 집필하기' },
    { id: 5, label: '평화 소감문 작성란', icon: Sparkles, sub: 'AI 기반 성찰 소감문 전용' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b border-editorial-border text-editorial-text-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-5 gap-4">
          
          {/* 타이틀 영역 */}
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-editorial-card border border-editorial-border-light rounded-lg text-editorial-accent">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif tracking-tight text-white">
                독도 영토 주권 교육 종합 교재
              </h1>
              <p className="text-[11px] text-editorial-text-muted font-sans tracking-wide mt-0.5 uppercase">
                역사·지리 융합 수업 보조 자료 • 2026년 5월 개정판
              </p>
            </div>
          </div>

          {/* 학습 성취도 영역 */}
          <div className="flex items-center justify-between md:justify-end space-x-6 bg-editorial-card p-3 px-4 rounded-lg border border-editorial-border">
            <div className="text-left">
              <span className="text-[9px] text-editorial-text-muted font-bold uppercase tracking-widest font-mono block">PROGRESS</span>
              <div className="flex items-center space-x-2.5 mt-1">
                <div className="w-24 sm:w-32 bg-neutral-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-editorial-accent h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-editorial-accent font-mono w-8 text-right">{progressPercent}%</span>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-editorial-border" />
            
            <div className="flex items-center space-x-1.5 bg-neutral-900/50 px-2.5 py-1 rounded border border-editorial-border-light">
              <Award className="w-4 h-4 text-editorial-accent" />
              <span className="text-[11px] font-semibold text-neutral-300">
                {progressPercent === 100 ? '학습 완료' : `${Math.round(progressPercent / 20)}/5 완료`}
              </span>
            </div>
          </div>

        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex space-x-1 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-neutral-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`relative flex-1 min-w-[155px] text-left py-4 px-4 outline-none transition-all duration-200 border-b-2 font-medium flex items-start space-x-2.5 cursor-pointer ${
                  isActive
                    ? 'border-editorial-accent text-editorial-accent bg-[#1a1a1a]/40'
                    : 'border-transparent text-editorial-text-muted hover:text-white hover:bg-neutral-900/30'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-editorial-accent' : 'text-neutral-500'}`} />
                <div>
                  <span className="text-xs font-bold block leading-none">{tab.label}</span>
                  <span className="text-[10px] text-neutral-500 block mt-1.5 font-normal truncate leading-none">{tab.sub}</span>
                </div>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-editorial-accent" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
