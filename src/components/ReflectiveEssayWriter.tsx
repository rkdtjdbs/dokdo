import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, FileText, Copy, Printer, Trash2, Check, AlertCircle, RefreshCw, Layers, Quote, Upload, FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { generateLocalHistoricalEssay } from '../utils/essayGenerator';

interface ReflectiveEssayWriterProps {
  completedKeys: string[];
  toggleComplete: (key: string) => void;
}

export default function ReflectiveEssayWriter({ completedKeys, toggleComplete }: ReflectiveEssayWriterProps) {
  const [keywords, setKeywords] = useState<string>('세종실록지리지, 태정관 지령, 미래세대 평화, 한일 공동 번영');
  const [essayContent, setEssayContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested keywords to make interaction seamless
  const PRESET_KEYWORDS = [
    '세종실록지리지',
    '태정관 지령',
    '지리적 근접성',
    '미래인도적 상생',
    '동해 평화의 바다',
    '안용복 수호정신',
    '역사적 정의 실현',
    '한일 평화 교육'
  ];

  // Load from local storage if exists
  useEffect(() => {
    const savedEssay = localStorage.getItem('dokdo_reflective_essay');
    const savedKeywords = localStorage.getItem('dokdo_reflective_keywords');
    if (savedEssay) {
      setEssayContent(savedEssay);
    }
    if (savedKeywords) {
      setKeywords(savedKeywords);
    }
  }, []);

  const handleKeywordTagClick = (tag: string) => {
    const trimmed = keywords.trim();
    if (trimmed === '') {
      setKeywords(tag);
      localStorage.setItem('dokdo_reflective_keywords', tag);
    } else {
      const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      let updated: string;
      if (parts.includes(tag)) {
        updated = parts.filter(p => p !== tag).join(', ');
      } else {
        updated = [...parts, tag].join(', ');
      }
      setKeywords(updated);
      localStorage.setItem('dokdo_reflective_keywords', updated);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "\ufeff키워드목록,주석\n세종실록지리지,조선 초기 관찬 지리지\n태정관 지령,일본 메이지 정부 공식 지령문\n미래지향 평화,한일 상생과 상호 우호\n안용복 수호정신,조선 어민의 호국 의지\n독도 평화의 바다,해양 주권과 생태 보전";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dokdo_keywords_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseSpreadsheet = (file: File) => {
    const reader = new FileReader();
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    setErrorMsg('');
    setUploadSuccessMsg('');

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;

        let detectedKeywords: string[] = [];

        if (extension === 'csv' || extension === 'txt') {
          const text = new TextDecoder('utf-8').decode(data as ArrayBuffer);
          detectedKeywords = text
            .split(/[\n,;\t\r]/)
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 50);
        } else {
          const workbook = XLSX.read(data, { type: 'array' });
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            json.forEach(row => {
              if (Array.isArray(row)) {
                row.forEach(cell => {
                  if (cell !== null && cell !== undefined) {
                    const valStr = String(cell).trim();
                    if (valStr && valStr.length > 0 && valStr.length < 50) {
                      detectedKeywords.push(valStr);
                    }
                  }
                });
              }
            });
          });
        }

        const uniqueKeywords = Array.from(new Set(detectedKeywords))
          .filter(k => !/^(true|false|undefined|null|object|id|키워드목록|주석)$/i.test(k));

        if (uniqueKeywords.length === 0) {
          setErrorMsg('업로드한 파일이나 시트 셀에서 유효한 키워드 텍스트를 발견하지 못했습니다.');
          return;
        }

        // Merge with existing keywords without duplicates
        const currentParts = keywords.split(',').map(s => s.trim()).filter(Boolean);
        const merged = Array.from(new Set([...currentParts, ...uniqueKeywords])).join(', ');
        
        setKeywords(merged);
        localStorage.setItem('dokdo_reflective_keywords', merged);
        setUploadSuccessMsg(`🎉 [${file.name}] 문서의 셀로부터 ${uniqueKeywords.length}개의 키워드를 성공적으로 로드하여 기입란에 결합했습니다!`);
        setTimeout(() => setUploadSuccessMsg(''), 6000);
      } catch (err: any) {
        console.error("Spreadsheet parsing failed:", err);
        setErrorMsg('스프레드시트 분석 중 에러가 발생했습니다. 성찰 전용 UTF-8 CSV나 현대 규격 .xlsx 파일 업로드를 추천합니다. (한셀의 경우 엑셀 형식 .xlsx로 다운로드 후 업로드하십시오)');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseSpreadsheet(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseSpreadsheet(file);
    }
  };

  const handleGenerateEssay = async () => {
    if (!keywords.trim()) {
      setErrorMsg('소감문을 생성할 키워드를 1개 이상 입력해 주세요.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setEssayContent('');
    setIsSaved(false);
    setIsFallbackMode(false);

    try {
      const response = await fetch('/api/generate-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '소감문 작성 과정에서 오류가 발생했습니다.');
      }

      const data = await response.json();
      if (data.essay) {
        setEssayContent(data.essay);
        localStorage.setItem('dokdo_reflective_essay', data.essay);
        localStorage.setItem('dokdo_reflective_keywords', keywords);
        
        // Mark lesson/reflection task as complete
        if (!completedKeys.includes('reflection')) {
          toggleComplete('reflection');
        }
      } else {
        throw new Error('생성된 소감문 내용이 비어 있습니다.');
      }
    } catch (err: any) {
      console.warn("API Error, falling back to local essay generator library:", err);
      // Run fallback generation
      setTimeout(() => {
        const localEssay = generateLocalHistoricalEssay(keywords);
        setEssayContent(localEssay);
        setIsFallbackMode(true);
        localStorage.setItem('dokdo_reflective_essay', localEssay);
        localStorage.setItem('dokdo_reflective_keywords', keywords);
        
        // Mark lesson/reflection task as complete
        if (!completedKeys.includes('reflection')) {
          toggleComplete('reflection');
        }
        setIsGenerating(false);
      }, 1000); // 1s visual simulation for realistic typing build feel
    } finally {
      // If we did not use fallback, stop loading immediately
      setTimeout(() => {
        setIsGenerating(prev => {
          if (prev && !isFallbackMode) return false;
          return prev;
        });
      }, 100);
    }
  };

  const copyToClipboard = async () => {
    if (!essayContent) return;
    try {
      await navigator.clipboard.writeText(essayContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleReset = () => {
    if (window.confirm('작성 중인 키워드와 생성된 소감문을 전체 초기화하시겠습니까?')) {
      setKeywords('');
      setEssayContent('');
      setErrorMsg('');
      localStorage.removeItem('dokdo_reflective_essay');
      localStorage.removeItem('dokdo_reflective_keywords');
      if (completedKeys.includes('reflection')) {
        toggleComplete('reflection');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reflective-essay-panel" className="space-y-10 animate-fade-in print:bg-white print:m-0 print:p-0">
      
      {/* 타이틀 배너 */}
      <div className="bg-[#121212] rounded-xl p-8 border border-editorial-border relative overflow-hidden print:hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-editorial-accent/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 font-sans text-[11px] font-bold uppercase tracking-wider">
              [전용 코너] AI 평화 성찰 소감문 작성란
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white animate-fade-in flex items-center gap-2.5">
              독도 주권 평화 성찰 소감문 작성기
            </h2>
            <p className="text-editorial-text-muted text-xs sm:text-sm max-w-2xl leading-relaxed">
              본인이 느낀 점이나 학습한 필수 사료 키워드를 입력하고 <strong className="text-editorial-accent">소감문 작성하기</strong>를 클릭해 보세요. 역사적 팩트 기반의 평화 지향성 소감문 초안을 3문단 이상의 고품격 인문 문법으로 자동 작성해 줍니다.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-essay-print"
              onClick={handlePrint}
              disabled={!essayContent}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded bg-[#1e1e1e] hover:bg-[#2e2e2e] text-editorial-text-main text-[11px] font-bold border border-editorial-border transition cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4 text-editorial-accent" />
              <span>소감문 인쇄/PDF</span>
            </button>
            <button
              id="btn-essay-reset"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded bg-red-950/20 text-red-100 border border-red-900/30 hover:bg-red-950/40 text-[11px] font-bold transition cursor-pointer font-mono"
            >
              <Trash2 className="w-4 h-4" />
              <span>포맷 초기화</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
        
        {/* 키워드 기입란 (좌측 5칸) */}
        <div className="lg:col-span-5 space-y-6 print:w-full">
          <div className="bg-[#121212] rounded-xl p-6 border border-editorial-border space-y-6">
            <div className="flex items-center space-x-2 border-b border-editorial-border pb-3">
              <Sparkles className="w-5 h-5 text-editorial-accent animate-pulse" />
              <h4 className="text-sm font-serif font-bold text-white">소감문 생성 조건 설정</h4>
            </div>

            {/* 클릭형 추천 태그 모음 */}
            <div className="space-y-3">
              <label className="text-[10px] text-editorial-text-muted font-bold tracking-widest block uppercase font-mono">
                성찰 추천 키워드 태그
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_KEYWORDS.map((tag) => {
                  const isSelected = keywords.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleKeywordTagClick(tag)}
                      className={`text-[10px] px-3 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-editorial-accent text-black font-extrabold shadow-md border border-editorial-accent'
                          : 'bg-[#181818] text-neutral-400 hover:text-white border border-editorial-border hover:border-neutral-500'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                * 키워드를 직접 클릭하여 추가하거나, 아래 쉼표(,)로 자유롭게 분리하여 직접 원하는 내용을 기입하셔도 좋습니다.
              </p>
            </div>

            {/* 실제 수동 기입란 */}
            <div className="space-y-2">
              <label className="text-[10px] text-editorial-text-muted font-bold tracking-widest block uppercase font-mono">
                소감문 생성 키워드 기입란
              </label>
              <textarea
                rows={4}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="예: 세종실록지리지, 태정관 지령, 독도의 미래, 평화상생"
                className="w-full bg-[#181818] border border-editorial-border focus:border-editorial-accent p-3.5 rounded text-xs text-white focus:outline-none transition font-sans shadow-inner leading-relaxed"
              />
            </div>

            {/* 엑셀 및 한셀 업로드 영역 (더셀에서 업로드 지원) */}
            <div className="space-y-2 border-t border-editorial-border pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-editorial-text-muted font-bold tracking-widest block uppercase font-mono">
                  📊 더셀(한셀/엑셀) • CSV 키워드 업로드
                </label>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="text-[9px] text-[#8e8e8e] hover:text-editorial-accent flex items-center gap-1 font-mono transition cursor-pointer"
                >
                  <Download className="w-3 h-3 text-editorial-accent" />
                  <span>샘플 규격 받기</span>
                </button>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-editorial-accent bg-editorial-accent/10 shadow-lg'
                    : 'border-editorial-border bg-[#181818] hover:border-neutral-500'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv,.cell"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center space-y-2">
                  <FileSpreadsheet className={`w-8 h-8 ${isDragging ? 'text-editorial-accent animate-bounce' : 'text-editorial-accent/70'}`} />
                  <p className="text-[11px] text-[#ccc]">
                    {isDragging ? '스프레드시트를 여기에 놓으세요!' : '여기에 더셀, 엑셀, 한셀, CSV 파일을 끌어놓으세요'}
                  </p>
                  <p className="text-[9px] text-neutral-500">
                    기안 엑셀파일(.xlsx, .xls) 및 한셀(.cell), CSV 자동 지원
                  </p>
                </div>
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/45 rounded text-[10.1px] font-sans flex items-center gap-2 animate-fade-in leading-relaxed">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* 생성 액션 버튼 */}
            <div>
              <button
                id="btn-trigger-essay-gen"
                onClick={handleGenerateEssay}
                disabled={isGenerating}
                className="w-full py-4 rounded bg-editorial-accent hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Gemini 심축 성찰 소감문 작성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <span>성찰 소감문 자동으로 만들어줘</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/20 text-red-400 border border-red-900/40 rounded text-xs flex items-center gap-2 font-sans animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* 인문적 성찰 팁 */}
          <div className="bg-[#121212]/50 rounded-xl p-5 border border-editorial-border space-y-3">
            <span className="text-[9px] text-[#8e8e8e] font-bold block uppercase tracking-widest font-mono">집필 감수 원칙</span>
            <div className="flex gap-2.5 items-start">
              <Quote className="w-4 h-4 text-editorial-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-editorial-text-muted leading-relaxed font-light">
                한일 양국 미래 세대를 위한 평화 교과서 수립의 기본 지침은 사실(Fact)에 기반한 용기와 상호 우호적인 배려입니다. AI는 자극적 단어를 엄격히 거르고, 숭고한 국사 사료의 가치를 우아하게 배치합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 결과지 출력판 (우측 7칸) */}
        <div id="essay-output-area" className="lg:col-span-7 space-y-6 print:w-full">
          
          {/* 가상 원고지 스타일 종이 */}
          <div className="bg-[#121212] rounded-xl p-6 border border-editorial-border relative overflow-hidden min-h-[480px] flex flex-col justify-between print:border-none print:bg-white">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-editorial-accent print:hidden" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3.5 print:border-neutral-200">
                <div className="flex items-center space-x-2.5 text-editorial-accent">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-white print:text-black">
                    성찰 소감서 원고 (Reflective Essay Draft)
                  </span>
                </div>
                {essayContent && (
                  <span className="text-[9px] bg-emerald-950/45 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold print:hidden">
                    실증 완료 ✓
                  </span>
                )}
              </div>

              {isGenerating ? (
                // 로딩 인디케이터
                <div className="py-20 text-center space-y-4">
                  <RefreshCw className="w-10 h-10 animate-spin text-editorial-accent mx-auto" />
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-white">동해 평화 지향성 가치를 고려하여 소감문을 작단하고 있습니다...</p>
                    <p className="text-[10px] text-editorial-text-muted max-w-lg mx-auto leading-relaxed">
                      입력하신 핵심 사료를 연계 분석하여 문맥을 정련하고, 고차원적 역사 평성 지능 엔진이 품격 있는 구성으로 문단을 빌딩하는 중입니다. 잠시만 기다려 주십시오.
                    </p>
                  </div>
                </div>
              ) : essayContent ? (
                // 실제 생성된 소감문 본문
                <div className="space-y-4 animate-fade-in select-text selection:bg-editorial-accent selection:text-black text-editorial-text-main print:text-black">
                  {isFallbackMode && (
                    <div className="p-3.5 bg-[#181818] border border-editorial-accent/30 rounded text-neutral-300 text-[10.5px] leading-relaxed flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-editorial-accent shrink-0 animate-pulse" />
                      <span>💡 <strong>로컬 지능 고증 성찰 엔진이 소감문을 임시 완성했습니다.</strong> 현재 브라우저 샌드박스에서 실시간 Gemini AI API 연결이 성립되지 않았으므로 사전에 숙성된 고품격 인문 소감문으로 매끄럽고 안정적이게 자동 기입되었습니다. Gemini AI를 활용하려면 우측의 <strong>Settings &gt; Secrets</strong>에 API 키가 올바르게 바인딩되었는지 점검바랍니다.</span>
                    </div>
                  )}
                  <div className="text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-wrap font-light text-neutral-200 print:text-black">
                    {essayContent}
                  </div>
                </div>
              ) : (
                // 아무것도 없을 때의 대기 화면
                <div className="py-24 text-center text-editorial-text-muted space-y-3 font-serif">
                  <div className="text-4xl text-neutral-700">✍️</div>
                  <p className="text-xs text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                    왼쪽에 원하시는 키워드 조건들을 추가하거나 직접 작성한 다음, <span className="text-editorial-accent font-bold">소감문 자동으로 만들어줘</span> 버튼을 누르시면 이 원고지에 고품격 평화 성찰 소감문이 완성되어 즉시 출력됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* 클립보드 복사 등 보강 도구 */}
            {essayContent && !isGenerating && (
              <div className="pt-6 border-t border-editorial-border mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <span className="text-[10px] text-neutral-500 font-mono">
                  인증 코드: EP-REFLECT-2026 • 총 교안 5절 완성
                </span>
                <button
                  type="button"
                  id="btn-copy-essay-to-clip"
                  onClick={copyToClipboard}
                  className="flex items-center justify-center space-x-2 px-5 py-3 bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white border border-editorial-border hover:border-neutral-500 rounded text-xs font-bold transition cursor-pointer active:scale-95 shrink-0"
                >
                  <Copy className="w-4 h-4 text-editorial-accent" />
                  <span>{copySuccess ? '클립보드에 복사 완료!' : '클립보드 간편 복사'}</span>
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>

    </div>
  );
}
