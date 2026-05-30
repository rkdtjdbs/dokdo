import React, { useState, useEffect } from 'react';
import { debateQuestions } from '../data';
import { FileText, Users, Edit3, CheckCircle, RefreshCw, Award, AlertCircle, Heart, Check, Trash2, Printer } from 'lucide-react';
import { TextbookActivity, ReflectionAnswer } from '../types';

interface Lesson4ActivityProps {
  completedKeys: string[];
  toggleComplete: (key: string) => void;
  onActivitySubmit: (percentIncrease: boolean) => void;
}

export default function Lesson4Activity({ completedKeys, toggleComplete, onActivitySubmit }: Lesson4ActivityProps) {
  // 모둠원 기본 예시 세팅
  const initialActivity: TextbookActivity = {
    koreanStudent: '김민준',
    japaneseStudent: '사토 하루토',
    title: '동해의 평화로운 섬, 독도의 역사적 사료와 상호 수혜적 미래',
    content: `동해의 평화로운 섬 독도는 역사적 사료를 통해 그 지위가 증명된다. 한국의 『세종실록지리지(1454년)』에는 울릉도와 독도(우산)가 서로 거리가 멀지 않아 날씨가 맑으면 육안으로 관측 가능하다고 기록되어 양국의 고대 생활권과 인식을 보여준다. 또한, 일본 메이지 정부 최고 기관이 내린 『태정관 지령(1877년)』에서도 울릉도와 독도가 일본과 관계없는 조선의 영역임을 분명히 명시했다. 러일전쟁 중 일본에 의해 불법 편입되는 아픔을 겪기도 했으나, 2차 대전 후 연합국의 조치를 통해 한국의 관할로 환원되었다. 오늘날 양국은 배타적 경제수역(EEZ) 설정 과정에서 어업 갈등을 겪고 있으나, 영토 대립을 넘어 역사적 진실을 직시하고 동해를 평화와 공동 번영의 바다로 만들기 위해 상호 협력해야 한다.`
  };

  const [activity, setActivity] = useState<TextbookActivity>(initialActivity);
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswer[]>([
    { questionId: 1, answer: '태정관 지령과 기죽도약도는 일본의 유력한 최고 사법·정정 관청이 독도와 울릉도가 자국 영토가 아니며 조선 영속임을 공인했던 대외적이고 법리적인 국가 공문서이기 때문입니다.' },
    { questionId: 2, answer: '한·일 양국의 영해 범위가 200해리로 겹쳐 완충이 필요했고, 영유권 합의가 곤란하여 결국 어업 관리를 목적으로 보류하고 일시적으로 양국 공동 소조합 수역으로 칭하였습니다.' },
    { questionId: 3, answer: '어린 역사 교육의 대립 감정을 배격하고 객관적인 역사 사실을 같이 토론하고 공통 분모를 확립함으로써, 상호 미래에 국수주의 대립이 아닌 상호 평화적 동반자로 번영하기 위함입니다.' }
  ]);

  const [evaluation, setEvaluation] = useState<{
    score: string;
    grade: string;
    keywordsFound: string[];
    sentimentCheck: boolean;
    missingKeywords: string[];
    feedback: string;
    approvedBy: string;
  }>({
    score: '96',
    grade: 'A+',
    keywordsFound: ['세종실록지리지', '태정관 지령'],
    sentimentCheck: true,
    missingKeywords: [],
    feedback: '역사적 1차 사료들의 대조 분석 능력이 대단히 우수하며 세종실록지리지와 태정관 지령 간 논리적 연대가 일방적 비난 없이 객관적으로 기술되었습니다. 미래 번영 지향성 점수 만점입니다.',
    approvedBy: '한·일 공동 교과서 편찬 심의위원회'
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 로컬 스토리지 보존
  useEffect(() => {
    const savedActivity = localStorage.getItem('dokdo_textbook_activity');
    const savedReflections = localStorage.getItem('dokdo_reflections');
    const savedSubmitted = localStorage.getItem('dokdo_activity_submitted');

    if (savedActivity) {
      setActivity(JSON.parse(savedActivity));
    }
    if (savedReflections) {
      setReflectionAnswers(JSON.parse(savedReflections));
    }
    if (savedSubmitted === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  // 실시간 본문 채점 분석 엔진
  useEffect(() => {
    evaluateText(activity.content);
  }, [activity.content]);

  const evaluateText = (text: string) => {
    const requiredKeywords = ['세종실록지리지', '태정관 지령'];
    const found: string[] = [];
    const missing: string[] = [];

    requiredKeywords.forEach(kw => {
      if (text.includes(kw)) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });

    // 감정적 부수 단어 배제 필터
    const emotionalBadWords = ['왜놈', '도독놈', '강탈', '억지', '침략', '침탈', '원수'];
    let containsBadWords = false;
    emotionalBadWords.forEach(w => {
      if (text.includes(w)) {
        containsBadWords = true;
      }
    });

    // 가상의 총점 계산기
    let baseScore = 60;
    baseScore += found.length * 15; // 사료 가점 30점
    if (!containsBadWords) baseScore += 10; // 비방 배제 가점 10점
    if (text.length > 200 && text.length < 1000) baseScore += 10; // 적합한 분량 (10줄 이내)

    if (baseScore > 100) baseScore = 100;

    let grade = 'C';
    if (baseScore >= 95) grade = 'A+';
    else if (baseScore >= 90) grade = 'A';
    else if (baseScore >= 80) grade = 'B';
    else if (baseScore >= 70) grade = 'C';

    // 피드백 문구
    let comment = '교과서 서술 기준에 맞추어 보강이 필요합니다. ';
    if (found.length >= 2 && !containsBadWords) {
      comment = '세종실록지리지와 태정관 지령 사료가 완벽히 대치 기술되었으며, 일방적 적대 언어가 없는 고품격 평화 중심 문장으로 찬사받을 만합니다.';
    } else if (found.length === 1) {
      comment = `사서에서 근거 제시가 약간 부족합니다. 추가로 [${missing.join(', ')}] 사료를 포함해 보십시오.`;
    } else if (containsBadWords) {
      comment = '사료 활용은 충실하나 교과서 집필 원칙상 불필요한 감정적 비방 어구를 조금 더 정제하고 사실(Fact) 중심으로 교정해야 미래 세대가 상생을 이룰 수 있습니다.';
    }

    setEvaluation({
      score: baseScore.toString(),
      grade,
      keywordsFound: found,
      sentimentCheck: !containsBadWords,
      missingKeywords: missing,
      feedback: comment,
      approvedBy: '평화교육위원회 집필 평가소'
    });
  };

  const handleInputChange = (field: keyof TextbookActivity, value: string) => {
    const updated = { ...activity, [field]: value };
    setActivity(updated);
    localStorage.setItem('dokdo_textbook_activity', JSON.stringify(updated));
  };

  const handleReflectionChange = (id: number, value: string) => {
    const updated = reflectionAnswers.map(ans => 
      ans.questionId === id ? { ...ans, answer: value } : ans
    );
    setReflectionAnswers(updated);
    localStorage.setItem('dokdo_reflections', JSON.stringify(updated));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    localStorage.setItem('dokdo_activity_submitted', 'true');
    // 상위 컴포넌트에 이벤트를 전송하여, 최종 진도율 100% 달성 트리거!
    onActivitySubmit(true);
    toggleComplete('lesson4');
  };

  const handleReset = () => {
    if (window.confirm('작성하신 활동지와 성찰 답안을 초기화하시겠습니까?')) {
      setActivity(initialActivity);
      setReflectionAnswers([
        { questionId: 1, answer: '' },
        { questionId: 2, answer: '' },
        { questionId: 3, answer: '' }
      ]);
      setIsSubmitted(false);
      localStorage.removeItem('dokdo_textbook_activity');
      localStorage.removeItem('dokdo_reflections');
      localStorage.removeItem('dokdo_activity_submitted');
      onActivitySubmit(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="lesson4-container" className="space-y-12 animate-fade-in print:bg-white print:m-0 print:p-0">
      
      {/* 도입 배너 */}
      <div className="bg-[#121212] rounded-xl p-8 border border-editorial-border text-editorial-text-main relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-editorial-accent/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 font-sans text-[11px] font-bold uppercase tracking-wider">
              [수업 활동지] 한·일 평화 공동 집필
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white animate-fade-in">
              한·일 평화 공동 역사 교과서 집필실
            </h2>
            <p className="text-editorial-text-muted text-xs sm:text-sm max-w-2xl leading-relaxed">
              본인의 명철한 사료 지식을 증명하는 실질적 단계입니다. 한·일 학생이 한 팀이 되어 한일 우호 교과서의 독도 장을 직접 작성해 봅니다.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-print"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded bg-[#1e1e1e] hover:bg-[#2e2e2e] text-editorial-text-main text-[11px] font-bold border border-editorial-border transition cursor-pointer font-sans"
            >
              <Printer className="w-4 h-4 text-editorial-accent" />
              <span>PDF/인쇄 출력</span>
            </button>
            <button
              id="btn-reset-form"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded bg-red-950/20 text-red-100 border border-red-900/30 hover:bg-red-950/40 text-[11px] font-bold transition cursor-pointer font-mono"
            >
              <Trash2 className="w-4 h-4" />
              <span>포맷 초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* 모둠 활동 지침 안내상자 */}
      <section className="bg-[#121212] rounded-xl p-6 border border-editorial-border print:mb-6">
        <h3 className="text-[10px] text-editorial-text-muted font-bold uppercase tracking-widest block mb-4 font-mono">집필 심의 기준 및 약정 규칙</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#181818] p-4 rounded border border-editorial-border">
            <span className="text-[9px] text-[#8e8e8e] font-bold block uppercase tracking-widest font-mono">기획 의무 1</span>
            <strong className="text-xs text-[#eaeaea] font-serif block mt-1">2개 이상 사료 핵심 배점</strong>
            <p className="text-[11px] text-editorial-text-muted mt-2 leading-relaxed font-light">
              한국의 『세종실록지리지』나 일본 관선 결정문인 『태정관 지령』 중 <strong className="text-editorial-accent">최소 2건 이상</strong>을 본문 서사 속에 녹여 객관성을 획득하십시오.
            </p>
          </div>
          <div className="bg-[#181818] p-4 rounded border border-editorial-border">
            <span className="text-[9px] text-[#8e8e8e] font-bold block uppercase tracking-widest font-mono">기획 의무 2</span>
            <strong className="text-xs text-[#eaeaea] font-serif block mt-1">비방 배제 및 중립 factual</strong>
            <p className="text-[11px] text-editorial-text-muted mt-2 leading-relaxed font-light">
              일본을 향한 노골적 원색어 비방을 엄격히 차단하고, 미래 평화 지향성과 지구 공동체 가치 및 합리를 수립해 서술하십시오.
            </p>
          </div>
          <div className="bg-[#181818] p-4 rounded border border-editorial-accent/20">
            <span className="text-[9px] text-[#d4af37] font-bold block uppercase tracking-widest font-mono">기획 의무 3</span>
            <strong className="text-xs text-editorial-accent font-serif block mt-1">용량 10줄 이내 규칙</strong>
            <p className="text-[11px] text-editorial-text-muted mt-2 leading-relaxed font-light">
              학생들이 간편히 소안할 수 있도록 핵심 논리와 평화 방침을 담아 짧지만 단단한 교과서 글(10줄 미만)로 집대성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 활동지 폼 레이아웃 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
        
        {/* 입력란 (LP: 7컬럼) */}
        <div className="lg:col-span-7 space-y-6 print:w-full">
          <div className="bg-[#121212] rounded-xl p-6 border border-editorial-border space-y-5">
            <div className="flex items-center space-x-2 border-b border-editorial-border pb-3.5">
              <Users className="w-5 h-5 text-editorial-accent" />
              <h4 className="text-sm font-serif font-bold text-white">제안 전초: 필자 및 원안 배정</h4>
            </div>

            {/* 이름 기입 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] text-editorial-text-muted font-bold tracking-widest block mb-1.5 uppercase font-mono">우리 모둠원 (한국 학생)</label>
                <input 
                  type="text" 
                  value={activity.koreanStudent} 
                  onChange={(e) => handleInputChange('koreanStudent', e.target.value)}
                  placeholder="한국 학생 성명"
                  className="w-full bg-[#181818] border border-editorial-border focus:border-editorial-accent p-2.5 rounded text-xs font-semibold text-white focus:outline-none transition font-sans"
                />
              </div>
              <div>
                <label className="text-[9px] text-editorial-text-muted font-bold tracking-widest block mb-1.5 uppercase font-mono">우리 모둠원 (일본 학생)</label>
                <input 
                  type="text" 
                  value={activity.japaneseStudent} 
                  onChange={(e) => handleInputChange('japaneseStudent', e.target.value)}
                  placeholder="일본 학생 성명"
                  className="w-full bg-[#181818] border border-editorial-border focus:border-editorial-accent p-2.5 rounded text-xs font-semibold text-white focus:outline-none transition font-sans"
                />
              </div>
            </div>

            {/* 교과서 제안 단원 제목 */}
            <div>
              <label className="text-[9px] text-editorial-text-muted font-bold tracking-widest block mb-1.5 uppercase font-mono">우리가 제안하는 독도 단원 명제</label>
              <input 
                type="text" 
                value={activity.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="제목을 입력하십시오."
                className="w-full bg-[#181818] border border-editorial-border focus:border-editorial-accent p-3 rounded text-xs font-bold text-white focus:outline-none transition font-serif"
              />
            </div>

            {/* 공동 집필 본문 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] text-editorial-text-muted font-bold tracking-widest uppercase font-mono">집필 공동 본문 (10줄 이내 서술형)</label>
                <span className="text-[9px] text-[#666] font-mono">글자 수: {activity.content.length}자</span>
              </div>
              <textarea 
                rows={10}
                value={activity.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="필수 키워드: 세종실록지리지, 태정관 지령을 포함하여 수용력 높은 아름다운 공동 문장을 지어 보십시오."
                className="w-full bg-[#181818] border border-editorial-border focus:border-editorial-accent focus:bg-[#151515] p-4 rounded text-xs leading-relaxed text-white focus:outline-none transition resize-y font-serif font-light shadow-inner"
              />
            </div>
            
            {/* 제출 버튼 */}
            <div className="pt-2">
              <button
                id="btn-submit-activity"
                onClick={handleSubmit}
                disabled={activity.content.length < 50}
                className={`w-full py-3.5 rounded font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  isSubmitted 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                    : 'bg-editorial-accent hover:bg-white text-black hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>활동지 제출 완료 (인증 승인됨)</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5 shrink-0" />
                    <span>이대로 편찬 심의 제출 및 인증서 발급</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 심의 리포트 피드백 (LG: 5컬럼) - 실시간 반응형 채점 엔진 */}
        <div className="lg:col-span-5 space-y-6 print:w-full print:mt-6 animate-fade-in">
          <div className="bg-[#121212] text-editorial-text-main rounded-xl p-6 border border-editorial-border flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <span className="text-[9px] text-editorial-accent font-extrabold tracking-widest uppercase font-mono">가상 인공지능 평가원 채점</span>
                <span className="text-[10px] text-[#666] font-mono">실시간 반영 엔진</span>
              </div>

              {/* 점수 및 배지 */}
              <div className="flex items-center justify-between bg-editorial-card p-4 rounded border border-editorial-border">
                <div>
                  <span className="text-[9px] text-editorial-text-muted block font-bold uppercase font-mono">심의 평점</span>
                  <span className="text-3xl font-serif font-bold text-editorial-accent mt-0.5 block">{evaluation.grade}</span>
                </div>
                
                <div className="h-10 w-[1px] bg-editorial-border" />
                
                <div className="text-right">
                  <span className="text-[9px] text-editorial-text-muted block font-bold uppercase font-mono">종합 채점수</span>
                  <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{evaluation.score}<span className="text-xs text-editorial-text-muted font-normal"> / 100</span></span>
                </div>
              </div>

              {/* 필수 조건 체크 현황 */}
              <div className="space-y-2">
                <span className="text-[9px] text-[#8e8e8e] font-bold block uppercase tracking-widest font-mono">사서 고증 부합율</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-editorial-card p-2.5 rounded border border-editorial-border text-xs text-editorial-text-muted">
                    <span>『세종실록지리지』 검출</span>
                    {evaluation.keywordsFound.includes('세종실록지리지') ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5" />
                        <span>통과</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>부족</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-editorial-card p-2.5 rounded border border-editorial-border text-xs text-editorial-text-muted">
                    <span>『태정관 지령』 검출</span>
                    {evaluation.keywordsFound.includes('태정관 지령') ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5" />
                        <span>통과</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>부족</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-editorial-card p-2.5 rounded border border-editorial-border text-xs text-editorial-text-muted">
                    <span>자극성 비방 배제 중립도</span>
                    {evaluation.sentimentCheck ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <Heart className="w-3.5 h-3.5 fill-emerald-500" />
                        <span>합격 ✓</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center space-x-1 font-sans text-[11px] uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>비치료성 단어 포함됨</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 상세 피드백 리포트 */}
              <div className="bg-editorial-card p-4 rounded border border-editorial-border space-y-2">
                <span className="text-[9px] text-editorial-accent font-bold uppercase block tracking-wider font-mono">가상 심의위원회 총평</span>
                <p className="text-xs text-editorial-text-muted leading-relaxed font-light">
                  {evaluation.feedback}
                </p>
                <div className="h-[1px] bg-editorial-border mt-2" />
                <p className="text-[10px] text-neutral-600 font-mono text-right italic">- 의결처: {evaluation.approvedBy}</p>
              </div>

            </div>

            <div className="pt-4 border-t border-editorial-border mt-6 text-[10px] text-[#666] font-mono flex items-center justify-between">
              <span>수업 수수 기금 부여</span>
              <span className="text-emerald-400 font-bold">인증 교과서 코드: EP-DOKDO-2026</span>
            </div>

          </div>

          {/* 인증서 발부 (제출 시 나타나는 예쁜 보상 요증 카드) */}
          {isSubmitted && (
            <div className="bg-gradient-to-tr from-[#d4af37]/5 via-transparent to-transparent border border-[#d4af37]/30 rounded-xl p-6 shadow-inner relative overflow-hidden animate-fade-in">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-editorial-accent/10 rounded-full blur-2xl" />
              <div className="flex space-x-4">
                <div className="p-3 bg-editorial-accent/10 text-editorial-accent rounded border border-editorial-accent/20 shrink-0 self-start">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <strong className="text-editorial-accent font-serif font-bold text-sm block tracking-tight">한일 학술 평학 공동자 인정 수여</strong>
                  <p className="text-xs text-editorial-text-muted leading-relaxed font-light">
                    축하합니다! 한국의 <span className="font-bold text-white">{activity.koreanStudent}</span> 학생과 일본의 <span className="font-bold text-white">{activity.japaneseStudent}</span> 학생은 한일 양국의 역사를 사실과 학술을 토대로 중용하여 훌륭하게 기필하여 위원회 공동 저자로 인정 승인되었습니다.
                  </p>
                  <span className="text-[9px] text-editorial-accent block font-mono font-bold pt-1">교부 연월일: 2026년 5월 30일</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 토론 및 성찰 질문 리스트 (1, 2, 3) */}
      <section className="bg-[#121212] rounded-xl p-6 border border-editorial-border print:break-before-page">
        <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2 border-b border-editorial-border pb-3.5 mb-6 font-serif">
          <FileText className="w-4 h-4 text-editorial-accent" />
          <span>토론 및 개별 성찰 질문 리포트</span>
        </h3>

        <div className="space-y-6">
          {debateQuestions.map((q) => {
            const currentAnsObj = reflectionAnswers.find(ans => ans.questionId === q.id);
            return (
              <div key={q.id} className="space-y-3.5 p-4 bg-editorial-card rounded border border-editorial-border">
                <div className="flex items-start space-x-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-editorial-accent/10 text-[10px] font-bold text-editorial-accent border border-editorial-accent/20 shrink-0 mt-0.5 font-mono">
                    {q.id}
                  </span>
                  <p className="text-xs font-bold text-white leading-relaxed font-sans">{q.question}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-editorial-text-muted font-mono tracking-widest block uppercase">나의 탐구 및 성찰 생각 기술</label>
                  <textarea
                    rows={3}
                    value={currentAnsObj?.answer || ''}
                    onChange={(e) => handleReflectionChange(q.id, e.target.value)}
                    placeholder="성찰과 심층 탐구 의견을 논리적으로 기입하십시오."
                    className="w-full bg-[#121212] border border-editorial-border focus:border-editorial-accent p-3 rounded text-xs leading-relaxed text-white focus:outline-none transition resize-y font-light shadow-inner placeholder-neutral-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
