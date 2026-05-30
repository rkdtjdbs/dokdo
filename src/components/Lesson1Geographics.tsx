import React, { useState } from 'react';
import { distances, territoryFactors, addresses } from '../data';
import { Compass, Eye, Shield, MapPin, CheckCircle, Navigation, Info, EyeOff } from 'lucide-react';

interface Lesson1GeographicsProps {
  completedKeys: string[];
  toggleComplete: (key: string) => void;
}

export default function Lesson1Geographics({ completedKeys, toggleComplete }: Lesson1GeographicsProps) {
  const [selectedIsland, setSelectedIsland] = useState<string>('울릉도 (Ulleungdo)');
  const [showVisibilityRadius, setShowVisibilityRadius] = useState<boolean>(true);
  const [currentAddressTab, setCurrentAddressTab] = useState<'dongdo' | 'seodo'>('dongdo');

  const selectedDistanceData = distances.find(d => d.name === selectedIsland) || distances[0];

  // SVG 좌표 맵핑용 (가상의 동해 미니맵 배치)
  // 죽변 (60, 160), 울릉도 (180, 120), 독도 (280, 100), 오키섬 (320, 240)
  const mapPoints = [
    { name: '한반도 죽변 (Jukbyeon)', x: 60, y: 160, distance: '216.8 km', color: 'bg-emerald-500' },
    { name: '울릉도 (Ulleungdo)', x: 170, y: 120, distance: '87.4 km', color: 'bg-blue-500' },
    { name: '독도 (Dokdo)', x: 270, y: 100, distance: '기점', color: 'bg-amber-500' },
    { name: '일본 오키섬 (Oki Islands)', x: 340, y: 220, distance: '157.5 km', color: 'bg-slate-400' }
  ];

  const getVisibilityCircle = () => {
    return null;
  };

  return (
    <div id="lesson1-container" className="space-y-12 animate-fade-in">
      
      {/* 도입 배너 */}
      <div className="bg-[#121212] rounded-xl p-8 border border-editorial-border text-editorial-text-main relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-editorial-accent/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 font-sans text-[11px] font-bold uppercase tracking-wider">
              [1차시] 물리적 터증과 주권
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white animate-fade-in">
              독도의 지리적 특성과 영역의 이해
            </h2>
            <p className="text-editorial-text-muted text-xs sm:text-sm max-w-2xl leading-relaxed">
              독도가 대한민국의 엄연한 영토임을 과학적으로 증명하는 첫걸음은 명확한 물리적·지리적 사실과 국제법적 영역 개념을 정확히 확립하는 것입니다.
            </p>
          </div>
          <button
            id="mark-lesson1-complete"
            onClick={() => toggleComplete('lesson1')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
              completedKeys.includes('lesson1')
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                : 'bg-editorial-accent hover:bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
            } cursor-pointer`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{completedKeys.includes('lesson1') ? '1차시 학습 완료됨' : '1차시 완료 체크'}</span>
          </button>
        </div>
      </div>

      {/* 실감형 동해 지리 미니맵 & 수치분석 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 인터랙티브 동해 지도 카드 (LG: 7컬럼) */}
        <div className="lg:col-span-7 bg-editorial-card rounded-xl p-6 border border-editorial-border flex flex-col h-full">
          <div className="flex items-center justify-between mb-5 border-b border-editorial-border pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-editorial-accent" />
                <span>동해 지리 관계망 및 가시권 분석 지도</span>
              </h3>
              <p className="text-[11px] text-editorial-text-muted mt-1">지도의 섬들을 클릭하여 상대적 물리적 거리의 차이를 확인하세요.</p>
            </div>
            
            <button
              id="toggle-visibility"
              onClick={() => setShowVisibilityRadius(!showVisibilityRadius)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded bg-[#222] hover:bg-[#2e2e2e] text-editorial-text-main text-[11px] font-semibold border border-editorial-border transition cursor-pointer font-sans"
            >
              {showVisibilityRadius ? <EyeOff className="w-4 h-4 text-editorial-text-muted" /> : <Eye className="w-4 h-4 text-editorial-accent" />}
              <span>{showVisibilityRadius ? '가시선 끄기' : '가시반경 표시'}</span>
            </button>
          </div>

          {/* SVG 지도 영역 */}
          <div className="relative bg-[#111] border border-editorial-border rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full select-none"
              style={{ maxHeight: '380px' }}
            >
              {/* 바다 그리드/물결 효과 가상 격자 */}
              <defs>
                <pattern id="sea-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#0d0d0d" />
              <rect width="100%" height="100%" fill="url(#sea-grid)" />

              {/* 가시 반경 */}
              {showVisibilityRadius && (
                <>
                  {/* 울릉도 국경 가시 반경 (약 100km 가상선) - 독도(270,100)를 포함하는 넉넉한 반경 */}
                  <circle 
                    cx="170" 
                    cy="120" 
                    r="105" 
                    fill="rgba(212, 175, 55, 0.02)" 
                    stroke="rgba(212, 175, 55, 0.25)" 
                    strokeWidth="1.2" 
                    strokeDasharray="4,4" 
                  />
                  <text x="170" y="24" fill="var(--color-editorial-accent)" fontSize="8.5" fontWeight="bold" textAnchor="middle" opacity="0.8">
                    울릉도 육안 관측 가시 한계선 (독도 포함됨 ✓)
                  </text>

                  {/* 오키섬 가시 영역 (독도에 전혀 닿지 못하는 짧은 선) */}
                  <circle 
                    cx="340" 
                    cy="220" 
                    r="70" 
                    fill="rgba(239, 68, 68, 0.01)" 
                    stroke="rgba(239, 68, 68, 0.2)" 
                    strokeWidth="1.2" 
                    strokeDasharray="4,4" 
                  />
                  <text x="340" y="280" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle" opacity="0.8">
                    오키섬 가시 영역 (독도 닿지 못함 ✗)
                  </text>
                </>
              )}

              {/* 가상 연결선 */}
              <line x1="170" y1="120" x2="270" y2="100" stroke="var(--color-editorial-accent)" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="340" y1="220" x2="270" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
              <line x1="60" y1="160" x2="270" y2="100" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.6" />

              {/* 한반도 육지 실루엣 가상 곡선 */}
              <path 
                d="M 10 300 C 30 260, 40 220, 30 180 C 20 140, 20 100, 10 0" 
                fill="none" 
                stroke="#1f1f1f" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              <path 
                d="M 10 300 C 30 260, 40 220, 30 180 C 20 140, 20 100, 10 0" 
                fill="none" 
                stroke="#2a2a2a" 
                strokeWidth="8" 
                strokeLinecap="round" 
              />

              {/* 중요 지점들을 핀으로 렌더링 */}
              {mapPoints.map((point) => {
                const isSelected = selectedIsland.includes(point.name.split(' ')[1]);
                return (
                  <g 
                    key={point.name}
                    className="cursor-pointer group"
                    onClick={() => setSelectedIsland(point.name)}
                  >
                    {/* 호버 시 파동 원 */}
                    <circle 
                      cx={point.x} 
                      cy={point.y} 
                      r={isSelected ? "14" : "10"} 
                      className={`${isSelected ? 'fill-editorial-accent/20' : 'fill-white/5 group-hover:fill-white/10'} transition-all`} 
                    />
                    
                    {/* 메인 핀 */}
                    <circle 
                      cx={point.x} 
                      cy={point.y} 
                      r={isSelected ? "7" : "5"} 
                      fill={point.name === '독도 (Dokdo)' ? 'var(--color-editorial-accent)' : point.name === '울릉도 (Ulleungdo)' ? '#3b82f6' : point.name.includes('죽변') ? '#10b981' : '#64748b'} 
                      stroke="#0d0d0d"
                      strokeWidth={isSelected ? "2.5" : "1"}
                    />
                    
                    {/* 텍스트 표기 */}
                    <text 
                      x={point.x} 
                      y={point.y - 14} 
                      fontSize="9.5" 
                      fontWeight={isSelected ? "bold" : "medium"}
                      fill={isSelected ? "#fff" : "#888"}
                      textAnchor="middle"
                    >
                      {point.name.split(' ')[1]} {isSelected ? '📍' : ''}
                    </text>
                    
                    {/* 거리 라벨 */}
                    <text 
                      x={point.x} 
                      y={point.y + 18} 
                      fontSize="8" 
                      fontWeight="bold"
                      fill="#555"
                      textAnchor="middle"
                    >
                      {point.distance}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* 가상 축척/정보 오버레이 */}
            <div className="absolute bottom-3 left-3 bg-black/90 text-editorial-text-muted px-2.5 py-1.5 rounded text-[9px] font-mono border border-editorial-border">
              <p className="font-bold text-[10px] text-white">동해 평화지도 축척</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-8 h-[2px] bg-editorial-accent" />
                <span>100km 단위 공간 도식</span>
              </div>
            </div>
          </div>
        </div>

        {/* 지리 수치 수집 카드 (LG: 5컬럼) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* 주요 수치 요약 */}
          <div className="bg-editorial-card rounded-xl p-6 border border-editorial-border text-editorial-text-main shadow-md flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-editorial-text-muted uppercase tracking-widest font-mono mb-4 border-b border-editorial-border pb-2">독도 좌표 및 면적 제원</h4>
            <div className="space-y-4">
              <div>
                <span className="text-editorial-text-muted text-[10px] uppercase tracking-wider block font-sans">위치 (동도 우산봉 최적 관측 기준)</span>
                <p className="text-sm font-bold text-white flex items-center space-x-2 mt-1.5">
                  <MapPin className="w-4 h-4 text-editorial-accent shrink-0" />
                  <span>북위 37°14′26.8″, 동경 131°52′10.4″</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#121212] p-3 rounded border border-editorial-border">
                  <span className="text-editorial-text-muted text-[9px] block uppercase">총면적</span>
                  <span className="text-base font-serif font-bold text-editorial-accent mt-1.5 block">187,554 m²</span>
                  <span className="text-[10px] text-neutral-500 mt-1 block leading-tight">지적공부 공식 등재 면적</span>
                </div>
                <div className="bg-[#121212] p-3 rounded border border-editorial-border">
                  <span className="text-editorial-text-muted text-[9px] block uppercase">부속 도서 목록</span>
                  <span className="text-base font-serif font-bold text-editorial-accent mt-1.5 block">89개 섬</span>
                  <span className="text-[10px] text-neutral-500 mt-1 block leading-tight font-medium">동도·서도 및 바위들</span>
                </div>
              </div>
            </div>
          </div>

          {/* 선택한 섬과의 상호작용 피드백 */}
          <div className="bg-editorial-card rounded-xl p-6 border border-editorial-border flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-editorial-border pb-3 mb-4">
                <span className="text-[10px] font-bold text-editorial-text-muted uppercase tracking-wider">주요 기점 기준 거리 비교</span>
                <span className="text-xs px-2.5 py-1 rounded bg-editorial-accent/10 border border-editorial-accent/20 text-editorial-accent font-bold font-mono">{selectedDistanceData.distance} km</span>
              </div>
              <h4 className="text-base font-serif font-bold text-white">{selectedDistanceData.name}</h4>
              <p className="text-[10px] text-editorial-text-muted font-mono mt-1">{selectedDistanceData.coordinates}</p>
              <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed bg-[#1c1c1c] p-3.5 rounded border border-editorial-border font-light">
                {selectedDistanceData.description}
              </p>
            </div>

            {/* 지도 섬 직접 선택 버튼 패널 */}
            <div className="mt-5 pt-4 border-t border-editorial-border">
              <span className="text-[9px] text-editorial-text-muted font-bold block mb-2 uppercase tracking-widest font-mono">기점 선택</span>
              <div className="flex flex-wrap gap-1.5">
                {distances.map((island) => (
                  <button
                    key={island.name}
                    id={`btn-island-${island.name.split(' ')[1]}`}
                    onClick={() => setSelectedIsland(island.name)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                      selectedIsland === island.name
                        ? 'bg-editorial-accent text-black font-bold'
                        : 'bg-[#222] text-[#888] border border-editorial-border hover:bg-[#2e2e2e]'
                    }`}
                  >
                    {island.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 육안 관측성의 역사적 의의 */}
      <section className="bg-editorial-card rounded-xl p-6 border border-editorial-border">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2 border-b border-editorial-border pb-3 mb-4">
          <Eye className="w-4 h-4 text-editorial-accent" />
          <span>지리적 육안 관측성(Visibility)의 영토 주권적 가치</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121212] p-5 rounded border border-editorial-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-editorial-accent" />
            <h4 className="text-sm font-serif font-bold text-white flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-editorial-accent/10 border border-editorial-accent/20 text-xs text-editorial-accent font-mono">1</span>
              <span>울릉도에서의 독도 관측성 (역사적 인지)</span>
            </h4>
            <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed font-light">
              울릉도의 사동, 석포마을 등 높은 산지대에서는 대기가 맑은 날 수평선 너머로 솟아 있는 독도(동·서도)가 육안으로 또렷이 포착됩니다. 옛날 울릉도 주민들은 특별한 현대식 기구가 없어도 동쪽 바다 끝에 엄연히 존재하는 영토의 가치를 자연스럽게 깨닫고 자신들의 생활 구역이자 어업 관제권의 일부로 자연스럽게 귀속 및 편입했습니다.
            </p>
          </div>

          <div className="bg-[#121212] p-5 rounded border border-editorial-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-neutral-600" />
            <h4 className="text-sm font-serif font-bold text-white flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 font-mono">2</span>
              <span>일본 오키섬에서의 불가능성 (자연적 무인지)</span>
            </h4>
            <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed font-light">
              일본에서 독도와 지리적으로 가장 가깝다고 하는 조그마한 시마네현 오키섬 조차도, 지구는 둥글다는 과학적 굴률의 조건과 거리적 공간 조건(157.5km) 때문에 기상이 좋은 수준을 넘어 아무리 날씨가 극한으로 맑을지라도 독도를 육안으로 보는 것은 물리적으로 절대 불가능합니다. 즉, 에도 시대 일본 어민들은 평상적 자각 속에 영토를 인지한 것이 아니라 의도적인 영토 도해 행위로 침입했음을 증명해 줍니다.
            </p>
          </div>
        </div>
      </section>

      {/* 국가 영역의 삼요소와 주권 */}
      <section className="space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-editorial-accent" />
          <span>국가 영역(Territory)의 삼요소와 주권 권한</span>
        </h3>
        <p className="text-xs text-editorial-text-muted">각 세그먼트를 짚어가며 독도에 행사되는 대한민국의 헌법적 주권 실태를 확인하세요.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {territoryFactors.map((factor) => (
            <div 
              key={factor.id} 
              className="bg-editorial-card p-5 rounded border border-editorial-border hover:border-editorial-accent/40 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] text-editorial-text-muted font-bold uppercase tracking-wider block font-mono border-b border-editorial-border pb-1.5">{factor.englishTitle}</span>
                <h4 className="text-sm font-serif font-bold text-white mt-3.5">{factor.title}</h4>
                <p className="text-[11px] text-editorial-accent font-semibold mt-1 leading-tight">{factor.concept}</p>
                <p className="text-xs text-editorial-text-muted mt-3 leading-relaxed font-light">{factor.implementation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 독도의 주소와 도로명 주소 체계 */}
      <section className="bg-editorial-card text-editorial-text-main rounded-xl p-6 border border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 rounded">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-white">독도의 정식 주소와 도로명 체계</h3>
              <p className="text-[11px] text-editorial-text-muted mt-0.5">상주하는 주민과 수비대원이 실거주하는 자랑스런 법률상 유인도(有人島)</p>
            </div>
          </div>

          {/* 주소 탭 */}
          <div className="flex space-x-1 bg-[#121212] p-1 rounded border border-editorial-border">
            <button
              id="address-tab-dongdo"
              onClick={() => setCurrentAddressTab('dongdo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                currentAddressTab === 'dongdo'
                  ? 'bg-editorial-accent text-black font-bold'
                  : 'text-editorial-text-muted hover:text-white'
              }`}
            >
              동도 (이사부길)
            </button>
            <button
              id="address-tab-seodo"
              onClick={() => setCurrentAddressTab('seodo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
                currentAddressTab === 'seodo'
                  ? 'bg-editorial-accent text-black font-bold'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              서도 (안용복길)
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] text-editorial-accent font-bold uppercase font-mono tracking-widest">정식 우편 주소</span>
              <p className="text-base font-serif font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>{addresses[currentAddressTab].roadName}</span>
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-editorial-text-muted font-bold block uppercase tracking-widest font-mono">주요 공공 시설물 및 구성</span>
              <ul className="grid grid-cols-2 gap-2">
                {addresses[currentAddressTab].facilities.map((fac, idx) => (
                  <li key={idx} className="bg-[#121212] p-2.5 rounded border border-editorial-border flex items-center space-x-2 text-xs text-editorial-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-editorial-accent shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 bg-editorial-accent/5 p-5 rounded border border-editorial-accent/15 space-y-3">
            <div className="flex items-start space-x-2.5 text-editorial-text-muted text-xs leading-relaxed font-light">
              <Info className="w-4.5 h-4.5 text-editorial-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-serif font-bold mb-1">역사적 도로명 명명의 가치</strong>
                동도에는 신라 이찬으로서 독도(우산국)를 한국 영사 최초로 우리 영토에 복속(512년)한 영웅 <span className="text-editorial-accent font-semibold">이사부</span>의 길을, 서도에는 조선 숙종 시대에 일본에 당당히 맞서 독도가 조선 영속권 하에 있음을 에도 막부에 조회시켰던 의사 <span className="text-editorial-accent font-semibold">안용복</span>의 길을 부여함으로써 지리 명명으로 국가 영유권의 정체성을 한층 단단히 세웠습니다.
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
