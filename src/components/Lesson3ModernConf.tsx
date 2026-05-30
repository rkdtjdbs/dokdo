import React, { useState } from 'react';
import { modernTimeline } from '../data';
import { Globe, ShieldAlert, CheckCircle, Flame, HeartHandshake, AlertCircle, HelpCircle } from 'lucide-react';

interface Lesson3ModernConfProps {
  completedKeys: string[];
  toggleComplete: (key: string) => void;
}

export default function Lesson3ModernConf({ completedKeys, toggleComplete }: Lesson3ModernConfProps) {
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>('scapin');

  const selectedEvent = modernTimeline.find(t => t.id === selectedTimelineId) || modernTimeline[0];

  return (
    <div id="lesson3-container" className="space-y-12 animate-fade-in">
      
      {/* 도입 배너 */}
      <div className="bg-[#121212] rounded-xl p-8 border border-editorial-border text-editorial-text-main relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-editorial-accent/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 font-sans text-[11px] font-bold uppercase tracking-wider">
              [3차시] 현대 갈등과 공존
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white animate-fade-in">
              현대 독도 갈등의 전개와 평화적 수호
            </h2>
            <p className="text-editorial-text-muted text-xs sm:text-sm max-w-2xl leading-relaxed">
              독도를 둘러싼 갈등은 제2차 세계대전 전후 처리 조약의 외구적 공백과 새로운 동해 배타적 경제수역(EEZ) 체제가 맞부딪히며 심화되었습니다.
            </p>
          </div>
          <button
            id="mark-lesson3-complete"
            onClick={() => toggleComplete('lesson3')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
              completedKeys.includes('lesson3')
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                : 'bg-editorial-accent hover:bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
            } cursor-pointer`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{completedKeys.includes('lesson3') ? '3차시 학습 완료됨' : '3차시 완료 체크'}</span>
          </button>
        </div>
      </div>

      {/* 샌프란시스코 조약 누락 왜곡 논리 타파 교실 */}
      <section className="bg-editorial-card rounded-xl p-6 border border-editorial-border">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2 border-b border-editorial-border pb-4 mb-5">
          <ShieldAlert className="w-5 h-5 text-editorial-accent" />
          <span>샌프란시스코 강화조약 ‘독도 누락’ 왜곡 논리 타파</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 일본 우익들의 역사 날조 주장 */}
          <div className="bg-[#121212] p-5 rounded border border-editorial-border relative">
            <span className="text-[9px] text-rose-400 font-extrabold tracking-widest uppercase block font-mono mb-1.5">일본 외무성 측 주장 (Distortion)</span>
            <h4 className="text-sm font-bold text-rose-300 font-serif leading-snug">“최종 지령문 제2조에 다케시마 조항이 빠졌으므로 한국 반환 영토 아님”</h4>
            <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed font-light">
              샌프란시스코 평화조약 제2조 (a)항은 일본이 포기하고 독립을 인정할 한반도의 대표 영토로 ‘제주도, 거문도, 울릉도’ 총 3개의 핵심 섬만 예시했습니다. 일본 우익들은 이 선문 구절 아래 ‘독도(마츠시마/다케시마)’라는 명칭이 직접 명정되지 않았다는 어설픈 자구 공색을 틈타 독도가 반환 영토에서 자동 제외되었으며, 일본의 영유권 아래 고유 소유로 남았다는 억지 분쟁화 논리를 주입하고 있습니다.
            </p>
          </div>

          {/* 한국의 정당한 국제법적 반박 논리 */}
          <div className="bg-[#121212] p-5 rounded border border-editorial-border relative">
            <span className="text-[9px] text-editorial-accent font-extrabold tracking-widest uppercase block font-mono mb-1.5">대한민국의 진실과 실증 (Verification)</span>
            <h4 className="text-sm font-bold text-editorial-accent font-serif leading-snug">“수천 개 부속 섬을 다 적을 수는 없으며, 연합국 SCAPIN 677호 조항이 우선 유지됨”</h4>
            <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed font-light">
              우리나라에는 3천여 개가 넘는 수많은 연안 무인·유인도 부속 도서가 존재합니다. 평화조약 제2조 (a)항은 한반도의 수많은 섬들 중 가장 극단적 외곽 축을 이루는 대표 대표 도서 3개만 대표 명기(예시)한 것일 뿐, 적히지 않은 다른 모든 섬들을 일본으로 반환 보존하겠다는 동의가 절대 아닙니다. 연합국 최고 군령 지령서 <span className="font-bold text-editorial-accent">SCAPIN 제677호</span>에서 이미 독도를 일본 관할 주권에서 철저히 영유 배제하고 우리 영토로 복원시켜 정식 인가한 전후 평화 질서가 이를 분명히 보장하고 있습니다.
            </p>
          </div>

        </div>
      </section>

      {/* 세로형 현대사 갈등 타임라인 인터랙티브 탐색 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 왼쪽: 세로 타임라인 내비바 (LG: 5컬럼) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[9px] text-editorial-text-muted font-bold block uppercase tracking-widest font-mono">현대 독도 이슈 연대 색인</span>
          <div className="space-y-2 min-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
            {modernTimeline.map((item) => {
              const isSelected = selectedTimelineId === item.id;
              return (
                <button
                  key={item.id}
                  id={`btn-modern-item-${item.id}`}
                  onClick={() => setSelectedTimelineId(item.id)}
                  className={`w-full text-left p-3.5 rounded border transition-all duration-150 flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-editorial-accent border-editorial-accent text-black font-bold'
                      : 'bg-editorial-card hover:bg-[#1a1a1a] border-editorial-border text-editorial-text-muted'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded shrink-0 ${isSelected ? 'bg-black/10 text-black border border-black/10' : 'bg-[#121212] border border-editorial-border text-[#666]'}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold">{item.year}</span>
                      {item.date && (
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-800' : 'text-neutral-500'}`}>
                          ({item.date})
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-tight font-sans ${isSelected ? 'text-black' : 'text-white'}`}>
                      {item.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 상세 정보 판넬 (LG: 7컬럼) */}
        <div className="lg:col-span-7 bg-editorial-card text-editorial-text-main p-6 rounded-xl border border-editorial-border flex flex-col justify-between min-h-[420px]">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-editorial-border pb-3">
              <span className="text-[9px] text-editorial-accent font-bold font-mono tracking-widest uppercase">현대사 분쟁의 마일스톤</span>
              <span className="text-xs font-bold text-editorial-text-muted font-mono italic">Since {selectedEvent.year}</span>
            </div>

            <h4 className="text-base font-serif font-bold text-white">{selectedEvent.title}</h4>

            {/* 본문 설명 */}
            <div className="bg-[#121212] p-4 rounded border border-editorial-border">
              <span className="text-[9px] text-editorial-text-muted font-bold block uppercase tracking-widest font-mono mb-1">상세 사건 보고서</span>
              <p className="text-xs text-editorial-text-muted leading-relaxed font-light">
                {selectedEvent.description}
              </p>
            </div>

            {/* 우리 측 임팩트 및 평화 극복 과제 */}
            <div className="bg-editorial-accent/5 p-4 rounded border border-editorial-accent/15 space-y-1">
              <span className="text-[9px] text-editorial-accent font-bold block uppercase tracking-wider font-mono">영역권 임팩트와 시사점</span>
              <p className="text-xs text-editorial-text-muted leading-relaxed font-light">
                {selectedEvent.impact}
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-editorial-border mt-6 flex justify-between items-center text-[10px] text-[#666] font-mono">
            <span>대한민국 동해 영토 통제</span>
            <span className="text-editorial-accent font-semibold flex items-center space-x-1">
              <span>수비대 상시 근무 구역</span>
              <span>🔒 IP-SEC</span>
            </span>
          </div>
        </div>

      </section>

      {/* 신한일어업협정(1998년) 중간수역 깊이 알기 */}
      <section className="bg-[#121212] rounded-xl p-6 border border-editorial-border">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2 border-b border-editorial-border pb-4 mb-5">
          <AlertCircle className="w-5 h-5 text-editorial-accent" />
          <span>신한일어업협정(1998년)과 ‘중간수역’ 갈등의 본질 이해</span>
        </h3>
        
        <p className="text-xs text-editorial-text-muted leading-relaxed mb-5 font-light">
          1994년 유엔해양법협약이 공포되면서 연안국에 통보된 200해리 배타적 경제수역 제도는 한반도 해안과 일본 열도 간 거리가 도합 400해리 미만인 동해의 경우 영해의 경계가 서로 중복되는 심각한 외교적 문제에 봉착했습니다.
          양국은 영해 기선 기준 합의에 도달하지 못해, 결국 주권 기정 문제를 한시적으로 보류하는 타협방안으로 독도가 포함된 주변 영역을 양국이 공동으로 규제하는 특정 영역인 <span className="font-bold text-editorial-accent font-mono inline">‘중간수역’</span>으로 상정해 타협 협정을 체결했습니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-editorial-card p-4 rounded border border-editorial-border">
            <span className="text-[100%] block">🎣</span>
            <h4 className="text-xs font-serif font-bold text-white mt-2">공동 조업의 허가</h4>
            <p className="text-[11px] text-editorial-text-muted mt-1.5 leading-relaxed font-light">
              중간수역 안에서는 한·일 양국 어민들이 서로 동등하게 들어가서 전복이나 대게 등 풍족한 동해 수산 생태계를 해치지 않고 평화적으로 어로 활동을 펼칠 수 있습니다.
            </p>
          </div>

          <div className="bg-editorial-card p-4 rounded border border-editorial-border">
            <span className="text-[100%] block text-rose-500">🔥</span>
            <h4 className="text-xs font-serif font-bold text-white mt-2 font-serif">국내 여론의 충격</h4>
            <p className="text-[11px] text-editorial-text-muted mt-1.5 leading-relaxed font-light">
              독도가 영토 기점이 아닌 ‘중간수역’ 내에 애매하고 가볍게 걸치며 감정적으로 ‘독도 영유권이 소멸 내지 훼손당했다’는 엄청난 국민적 분노와 비난이 제기되기도 했습니다.
            </p>
          </div>

          <div className="bg-editorial-card p-4 rounded border border-editorial-border">
            <span className="text-[100%] block">📐</span>
            <h4 className="text-xs font-serif font-bold text-white mt-2">법리적 평정 분리</h4>
            <p className="text-[11px] text-editorial-text-muted mt-1.5 leading-relaxed font-light">
              어업협정은 오직 ‘수양 자원의 관리’에 국한된 조약일 뿐, 영토 주권을 주장하는 성격의 선언이 아닙니다. 독도의 영토 주권은 대한민국의 상주 수비 행사를 통해 완벽하게 존속됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 미래 세대를 위한 평화 해결 방안 제안 */}
      <section className="bg-editorial-card border border-editorial-border text-editorial-text-main rounded-xl p-6">
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-1.5 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 rounded">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[9px] text-editorial-accent font-bold uppercase tracking-widest font-mono">종합 평화 솔루션</h4>
            <h3 className="text-base font-serif font-bold text-white mt-0.5">영토 분쟁 대립을 넘어선 동아시아 평화 협동</h3>
          </div>
        </div>

        <div className="bg-[#121212] p-4.5 rounded border border-editorial-border space-y-3.5 text-editorial-text-muted text-xs leading-relaxed font-light">
          <p>
            독도 문제는 과거 일제강점기 제국주의적 침탈의 결과물이라는 역사적 흉터와 결부되어 있습니다. 영토 국수주의와 맹목적인 비난 교육은 양국 모두의 젊은 미래 세대에게 또 하나의 불필요한 장벽이자 평화의 반목을 물려주는 위험한 행동입니다.
          </p>
          
          <div className="h-[1px] bg-editorial-border" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-editorial-card p-4 rounded border border-editorial-border">
              <strong className="text-white block font-serif font-bold text-xs">1. 평화적 학술 지식 장려</strong>
              <p className="text-[11px] text-editorial-text-muted leading-relaxed font-light">
                명확한 사서(태정관 지령 등)를 바탕으로 객관적인 사실을 상호 고증하고 교환하며, 일본 관청의 기록 속에 이미 독도가 고려의 영기였음을 냉정하게 조명해 내는 학술적 노력이 최우선입니다.
              </p>
            </div>
            <div className="space-y-1.5 bg-editorial-card p-4 rounded border border-editorial-border">
              <strong className="text-white block font-serif font-bold text-xs">2. 상호존중의 동해 평화 교과서</strong>
              <p className="text-[11px] text-editorial-text-muted leading-relaxed font-light">
                상대방을 향한 원색적인 비난 대신, 다음 차시에서 직접 집필해 볼 "한·일 공동 역사 평화 교과서" 프로젝트처럼, 갈등을 극복하고 평화와 상호 수혜를 일구어 낼 수 있는 실천적 협동이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
