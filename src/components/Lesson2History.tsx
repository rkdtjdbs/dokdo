import React, { useState } from 'react';
import { historicalSources, maps, anyongbokEvents } from '../data';
import { Landmark, FileText, CheckCircle, Map, Milestone, HelpCircle, FileSearch, RefreshCw } from 'lucide-react';

interface Lesson2HistoryProps {
  completedKeys: string[];
  toggleComplete: (key: string) => void;
}

export default function Lesson2History({ completedKeys, toggleComplete }: Lesson2HistoryProps) {
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | 'korean' | 'japanese'>('all');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('sejong');
  const [selectedMapId, setSelectedMapId] = useState<string>('paldo');
  const [selectedEventId, setSelectedEventId] = useState<string>('anyong1');

  const filteredSources = historicalSources.filter(s => {
    if (sourceTypeFilter === 'all') return true;
    return s.sourceType === sourceTypeFilter;
  });

  const selectedSource = historicalSources.find(s => s.id === selectedSourceId) || historicalSources[0];
  const selectedMap = maps.find(m => m.id === selectedMapId) || maps[0];
  const selectedEvent = anyongbokEvents.find(e => e.id === selectedEventId) || anyongbokEvents[0];

  return (
    <div id="lesson2-container" className="space-y-12 animate-fade-in">
      
      {/* 도입 배너 */}
      <div className="bg-[#121212] rounded-xl p-8 border border-editorial-border text-editorial-text-main relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-editorial-accent/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 font-sans text-[11px] font-bold uppercase tracking-wider">
              [2차시] 사료와 지도적 권원
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white animate-fade-in">
              고문서와 고지도가 공인하는 역사적 진실
            </h2>
            <p className="text-editorial-text-muted text-xs sm:text-sm max-w-2xl leading-relaxed">
              독도의 역사는 감정을 앞세운 목소리가 아닌, 양국이 공인하고 간과했던 수백 년 전 1차 사료들의 냉철한 교차 대조 분석에서 완벽한 권원이 증명됩니다.
            </p>
          </div>
          <button
            id="mark-lesson2-complete"
            onClick={() => toggleComplete('lesson2')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
              completedKeys.includes('lesson2')
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                : 'bg-editorial-accent hover:bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
            } cursor-pointer`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{completedKeys.includes('lesson2') ? '2차시 학습 완료됨' : '2차시 완료 체크'}</span>
          </button>
        </div>
      </div>

      {/* 한·일 관찬 사료 교차 대조 돋보기 */}
      <section className="bg-editorial-card rounded-xl p-6 border border-editorial-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-editorial-border pb-5 mb-6 gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2.5">
              <Landmark className="w-5 h-5 text-editorial-accent" />
              <span>한·일 관찬 고문서 분석국</span>
            </h3>
            <p className="text-[11px] text-editorial-text-muted mt-1">우리 측 기록의 확실한 권원과, 오히려 역설적으로 주권 없음(배제)을 시인한 일본 기록을 대조해 봅니다.</p>
          </div>

          {/* 사료 구별 필터 */}
          <div className="flex space-x-1 bg-[#121212] p-1 rounded border border-editorial-border">
            <button
              id="filter-src-all"
              onClick={() => setSourceTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                sourceTypeFilter === 'all' ? 'bg-editorial-accent text-black font-bold' : 'text-editorial-text-muted hover:text-white'
              }`}
            >
              전체 사료
            </button>
            <button
              id="filter-src-korean"
              onClick={() => setSourceTypeFilter('korean')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                sourceTypeFilter === 'korean' ? 'bg-editorial-accent text-black font-bold' : 'text-editorial-text-muted hover:text-white'
              }`}
            >
              대한민국 사료 🇰🇷
            </button>
            <button
              id="filter-src-japanese"
              onClick={() => setSourceTypeFilter('japanese')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                sourceTypeFilter === 'japanese' ? 'bg-editorial-accent text-black font-bold' : 'text-editorial-text-muted hover:text-white'
              }`}
            >
              일본 관찬 사료 🇯🇵
            </button>
          </div>
        </div>

        {/* 메인 교차 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 사료 리스트판 (LG: 5컬럼) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-[9px] text-editorial-text-muted font-bold tracking-widest uppercase block font-mono">문서 색인 목록</span>
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-neutral-800">
              {filteredSources.map((source) => {
                const isSelected = selectedSourceId === source.id;
                const isKor = source.sourceType === 'korean';
                return (
                  <button
                    key={source.id}
                    id={`btn-source-${source.id}`}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={`w-full text-left p-3.5 rounded border transition-all duration-150 flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1b1b1b] border-editorial-accent/50 shadow-md'
                        : 'bg-[#121212] hover:bg-[#1a1a1a] border-editorial-border'
                    }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded shrink-0 ${isKor ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{source.title}</span>
                        <span className="text-[10px] text-editorial-text-muted font-mono">({source.year})</span>
                      </div>
                      <p className="text-[11px] text-editorial-text-muted mt-1.5 line-clamp-1 italic font-light">{source.originalText}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 한글 고문서 원본 돋보기 (LG: 7컬럼) */}
          <div className="lg:col-span-7 bg-[#111] rounded-xl p-6 border border-editorial-border flex flex-col justify-between h-full min-h-[380px]">
            <div className="space-y-4">
              
              {/* 카드 상단 헤더 */}
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedSource.sourceType === 'korean' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                  }`}>
                    {selectedSource.sourceType === 'korean' ? '대한민국 사서' : '일본 관방 공식문서'}
                  </span>
                  <span className="text-xs font-bold text-editorial-text-muted">{selectedSource.year}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-editorial-text-muted font-mono">
                  <FileSearch className="w-4 h-4 text-editorial-accent" />
                  <span>원문정밀 대조</span>
                </div>
              </div>

              {/* 사료 타이틀 */}
              <h4 className="text-base font-serif font-bold text-white">{selectedSource.title}</h4>

              {/* 한자 원문 판넬 */}
              <div className="bg-[#181818] p-4 rounded border border-editorial-border relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-editorial-accent/5 select-none font-serif text-6xl font-bold">書</div>
                <span className="text-[9px] text-editorial-accent font-extrabold uppercase font-mono block mb-1">한문 고문적 원문 (Original)</span>
                <p className="text-sm font-serif font-semibold text-editorial-accent leading-relaxed tracking-wider">
                  {selectedSource.originalText}
                </p>
              </div>

              {/* 우리말 현대어 해석 */}
              <div className="space-y-1">
                <span className="text-[9px] text-editorial-text-muted font-bold block uppercase tracking-widest font-mono">풀이 (Translation)</span>
                <p className="text-xs text-editorial-text-muted leading-relaxed bg-[#141414] p-3.5 rounded border border-editorial-border font-light">
                  {selectedSource.translation}
                </p>
              </div>

              {/* 평화영토 주권 사료적 의의 */}
              <div className="bg-editorial-card text-editorial-text-main p-4 rounded border border-editorial-border flex items-start space-x-2.5">
                <div className="pt-0.5 shrink-0 text-editorial-accent">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-editorial-accent font-bold uppercase tracking-wider font-mono">결정적 역사적 의증</span>
                  <p className="text-xs text-editorial-text-muted mt-1 leading-relaxed font-light">
                    {selectedSource.significance}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 역사 고지도 대조 분석실 */}
      <section className="bg-[#121212] rounded-xl p-6 border border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-editorial-border pb-4 mb-6 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-editorial-accent/10 border border-editorial-accent/20 text-editorial-accent rounded">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-white">한·일 대표 역사 고지도 대조 실증</h3>
              <p className="text-[11px] text-editorial-text-muted mt-0.5">당시 양국의 명망 있는 지리학자들과 관정이 영토 경계를 지도상에 어떻게 그렸는지 규명합니다.</p>
            </div>
          </div>

          {/* 지도 탭 선택 버튼 */}
          <div className="flex space-x-1 bg-editorial-card p-1 rounded border border-editorial-border">
            {maps.map((map) => (
              <button
                key={map.id}
                id={`btn-map-${map.id}`}
                onClick={() => setSelectedMapId(map.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                  selectedMapId === map.id ? 'bg-editorial-accent text-black font-bold' : 'text-[#888] hover:text-white'
                }`}
              >
                {map.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 지도 상세 보기 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* 가상 구도 설명 (MD: 5컬럼) */}
          <div className="md:col-span-5 bg-editorial-card p-6 rounded border border-editorial-border flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-editorial-text-muted font-bold font-mono uppercase tracking-widest">영유 선명 지도책</span>
                <span className="text-[11px] font-bold text-editorial-accent font-mono">{selectedMap.year}</span>
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-white">{selectedMap.title}</h4>
                <p className="text-xs text-editorial-text-muted mt-1 font-light">제작인: {selectedMap.creator}</p>
              </div>
              <p className="text-xs text-editorial-text-muted leading-relaxed font-light bg-[#121212] p-4 rounded border border-editorial-border">
                {selectedMap.significance}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-editorial-border text-[9px] text-neutral-500 font-mono leading-relaxed">
              * 이 고지도 데이터는 규장각 역사 보존 기금 및 동경 박물관 공적 사집을 기반으로 고증되었습니다.
            </div>
          </div>

          {/* 지도 그래픽스 및 구체 해설 (MD: 7컬럼) */}
          <div className="md:col-span-7 bg-editorial-card p-6 rounded border border-editorial-border flex flex-col justify-center">
            <span className="text-[9px] text-editorial-text-muted font-bold uppercase tracking-widest block mb-3 font-mono">지도상 영역 표시 실태분석</span>
            <div className="bg-[#121212] p-4.5 rounded border border-editorial-border flex items-start space-x-3.5">
              
              {/* 고지도의 시각적 모형 도안 */}
              <div className="w-16 h-16 shrink-0 rounded bg-[#181818] border border-editorial-border text-editorial-accent flex flex-col items-center justify-center p-1 relative shadow-sm">
                <Map className="w-6 h-6 animate-pulse" />
                <span className="text-[8px] font-bold font-mono mt-0.5">MAP UNIT</span>
                {selectedMap.id === 'paldo' && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-editorial-accent animate-ping" />}
              </div>
              
              <div>
                <h5 className="text-xs text-white font-bold font-serif">문서화 증명 (Details)</h5>
                <p className="text-xs text-editorial-text-muted mt-2 leading-relaxed font-light">
                  {selectedMap.details}
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border border-editorial-border rounded p-3 text-center bg-[#121212]">
                <span className="text-[100%] leading-none">🗺️</span>
                <span className="text-[9px] text-editorial-text-muted font-bold block mt-1 uppercase tracking-widest font-mono">지도 유형</span>
                <p className="text-[11px] text-white font-semibold mt-1">
                  {selectedMap.id === 'paldo' ? '조선 관찬 명정' : selectedMap.id === 'kaisei' ? '일본 주권 배제' : '동아시아 경계 확증'}
                </p>
              </div>
              <div className="border border-editorial-border rounded p-3 text-center bg-[#121212]">
                <span className="text-[100%] leading-none">🎖️</span>
                <span className="text-[9px] text-editorial-text-muted font-bold block mt-1 uppercase tracking-widest font-mono">국제 영토학 위상</span>
                <p className="text-[11px] text-white font-semibold mt-1">
                  {selectedMap.id === 'paldo' ? '역사 가치 최상' : selectedMap.id === 'kaisei' ? '일본 반박 한계 입증' : '독도-선(持) 명시'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 안용복 사건과 한·일 외교 교섭 */}
      <section className="space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
          <Milestone className="w-4 h-4 text-editorial-accent" />
          <span>안용복 의사의 주도적인 외교 투쟁로 (17세기 후반)</span>
        </h3>
        <p className="text-xs text-editorial-text-muted">조선의 평범한 어부였던 안용복이 전개한 당당한 일본 행선 외교 투쟁의 타임라인을 확인하세요.</p>

        {/* 가로형 타임라인 노드 바 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {anyongbokEvents.map((event) => {
            const isSelected = selectedEventId === event.id;
            return (
              <button
                key={event.id}
                id={`btn-anyong-${event.id}`}
                onClick={() => setSelectedEventId(event.id)}
                className={`text-left p-4.5 rounded border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                  isSelected
                    ? 'bg-editorial-accent border-editorial-accent text-black font-bold scale-[1.01]'
                    : 'bg-editorial-card border-editorial-border text-editorial-text-muted hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-[#1c1c1c] text-editorial-text-muted border border-editorial-border'
                    }`}>
                      {event.year}
                    </span>
                    {event.date && (
                      <span className={`text-[9.5px] font-bold ${
                        isSelected ? 'text-neutral-900' : 'text-neutral-500'
                      }`}>
                        {event.date}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold leading-tight font-sans">{event.title}</h4>
                </div>
                
                <span className={`text-[10px] font-bold mt-4 flex items-center space-x-1 ${
                  isSelected ? 'text-neutral-900' : 'text-editorial-accent'
                }`}>
                  <span>자세히 보기</span>
                  <span>→</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 하단 노드 연대기 상세 판넬 */}
        <div className="bg-editorial-card text-editorial-text-main rounded-xl p-6 border border-editorial-border flex flex-col md:flex-row gap-6 items-start">
          
          <div className="md:col-span-8 space-y-3 flex-1 w-full">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-editorial-accent uppercase tracking-widest font-mono">
              <RefreshCw className="w-3 h-3 text-editorial-accent animate-spin-slow" />
              <span>선택사건 심층 보고</span>
            </span>
            <h4 className="text-base font-serif font-bold text-white">{selectedEvent.title} ({selectedEvent.year} {selectedEvent.date})</h4>
            <p className="text-xs text-editorial-text-muted leading-relaxed font-light bg-[#121212] p-4 rounded border border-editorial-border">
              {selectedEvent.description}
            </p>
          </div>

          <div className="md:col-span-4 w-full md:w-80 shrink-0 bg-editorial-accent/5 p-5 rounded border border-editorial-accent/15 self-stretch flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[9px] text-editorial-accent font-bold block uppercase tracking-wider font-mono">주권적 임팩트 및 성과 (Impact)</span>
              <p className="text-xs text-editorial-text-muted leading-relaxed font-light">
                {selectedEvent.impact}
              </p>
            </div>
            
            <div className="pt-3 border-t border-editorial-border mt-4 text-[10px] text-neutral-600 font-mono text-right">
              조선 숙종실록 제적 근거
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
