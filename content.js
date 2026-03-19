(function() {
  const MF_VERSION = 5;
  if (window._mfVersion >= MF_VERSION) return;
  if (window._mfLoaded) {
    const old = document.getElementById('mf-host');
    if (old) old.remove();
  }
  window._mfLoaded = true;
  window._mfVersion = MF_VERSION;

  let allBiz = [], filtered = [], savedNotes = [], isScanning = false, cancelScan = false;
  let SR = null;

  const ic = {
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    gps: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>',
    scan: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
    dl: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    min: '<svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    close: '<svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    map: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
    chat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    clip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>',
    stop: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    link: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
  };

  function $id(id) { return SR ? SR.getElementById(id) : null; }
  function $q(sel) { return SR ? SR.querySelector(sel) : null; }
  function $all(sel) { return SR ? SR.querySelectorAll(sel) : []; }

  const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
#mf-panel-v4{position:fixed;top:70px;right:20px;width:420px;max-height:88vh;background:#0c0c10;border:1px solid #1f1f28;border-radius:16px;box-shadow:0 32px 80px rgba(0,0,0,0.85);z-index:2147483647;font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:#c8c8d8;display:flex;flex-direction:column;overflow:hidden;pointer-events:all}
#mf-panel-v4.mfHidden{display:none!important}
#mf-panel-v4.mfMin{max-height:56px;overflow:hidden}
#mfHeader{background:#0c0c10;border-bottom:1px solid #1a1a22;flex-shrink:0}
#mfDrag{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 10px;cursor:grab;user-select:none}
#mfDrag:active{cursor:grabbing}
#mfBrand{display:flex;align-items:center;gap:10px}
#mfLogoBox{width:30px;height:30px;background:linear-gradient(145deg,#1c0f3f,#3b1d8a);border:1px solid rgba(139,92,246,0.35);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(139,92,246,0.25)}
#mfLogoBox svg{color:#a78bfa;width:16px;height:16px}
#mfTitle{font-size:15px;font-weight:800;color:#f0f0f8;letter-spacing:-0.3px}
#mfBadge{font-size:8.5px;font-weight:700;letter-spacing:0.8px;padding:3px 7px;border-radius:5px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;box-shadow:0 2px 8px rgba(124,58,237,0.4)}
#mfWinBtns{display:flex;gap:6px}
.mfWBtn{width:28px;height:28px;border-radius:8px;border:1px solid #1f1f28;background:#141418;color:#5a5a72;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.mfWBtn:hover{background:#1e1e28;color:#e0e0f0}
#mfTabs{display:flex;padding:0 18px;gap:4px;border-bottom:1px solid #1a1a22}
.mfTab{background:none;border:none;border-bottom:2px solid transparent;color:#4a4a62;font-size:12.5px;font-weight:600;cursor:pointer;padding:8px 10px 10px;transition:all 0.15s;margin-bottom:-1px;font-family:inherit}
.mfTab:hover{color:#9090a8}
.mfTab.mfTActive{color:#f0f0f8;border-bottom-color:#8b5cf6}
#mfBody{flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#222230 transparent;padding:8px 0}
#mfBody::-webkit-scrollbar{width:4px}
#mfBody::-webkit-scrollbar-thumb{background:#222230;border-radius:4px}
#mfViewScanner,#mfViewNotes{display:none}
#mfViewScanner.mfVActive,#mfViewNotes.mfVActive{display:block}
#mfSearch{padding:12px 18px 16px}
.mfField{display:flex;align-items:center;background:#111116;border:1px solid #1e1e28;border-radius:10px;margin-bottom:10px;overflow:hidden;transition:border-color 0.2s,box-shadow 0.2s}
.mfField:focus-within{border-color:#6d28d9;box-shadow:0 0 0 3px rgba(109,40,217,0.15)}
.mfFSvg{margin:0 8px 0 14px;color:#3e3e55;flex-shrink:0;display:flex;align-items:center}
.mfField input[type="text"]{flex:1;padding:12px 8px;background:none;border:none;color:#e8e8f4;font-size:13px;outline:none;font-family:inherit}
.mfField input[type="text"]::placeholder{color:#3e3e55}
#mfGps,#mfHGGps{background:none;border:none;border-left:1px solid #1e1e28;color:#3e3e55;padding:12px 16px;cursor:pointer;display:flex;align-items:center;transition:all 0.15s}
#mfGps:hover,#mfHGGps:hover{color:#8b5cf6;background:rgba(139,92,246,0.06)}
#mfRadiusBox{background:#111116;border:1px solid #1e1e28;border-radius:10px;padding:14px 16px;margin-bottom:14px}
#mfRadiusTop{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
#mfRadiusLabel{font-size:10px;font-weight:700;color:#3e3e55;text-transform:uppercase;letter-spacing:1.2px}
#mfRadiusVal,#mfHGRadiusVal{font-size:13px;font-weight:700;color:#a78bfa;background:rgba(139,92,246,0.12);padding:3px 10px;border-radius:20px}
#mfRadiusSlider,#mfHGRadiusSlider{-webkit-appearance:none;appearance:none;width:100%;height:4px;background:#1e1e28;border-radius:2px;outline:none;cursor:pointer;display:block}
#mfRadiusSlider::-webkit-slider-thumb,#mfHGRadiusSlider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:4px solid #0c0c10;box-shadow:0 0 0 2px #7c3aed,0 2px 8px rgba(0,0,0,0.5);cursor:pointer}
#mfRadiusMarks{display:flex;justify-content:space-between;font-size:10px;color:#2e2e42;margin-top:8px;font-weight:500}
#mfScanBtn{width:100%;padding:14px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:all 0.2s;box-shadow:0 4px 20px rgba(124,58,237,0.4);font-family:inherit}
#mfScanBtn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(124,58,237,0.55)}
#mfScanBtn.scanning{background:#141418;color:#c8c8d8;border:1px solid #2e2e3e;box-shadow:none}
#mfProg{margin-top:12px}
#mfProgTrack{height:3px;background:#1a1a22;border-radius:2px;overflow:hidden;margin-bottom:8px}
#mfProgBar{height:100%;background:linear-gradient(90deg,#4c1d95,#8b5cf6,#c4b5fd,#8b5cf6,#4c1d95);background-size:200% 100%;width:0%;transition:width 0.3s ease;border-radius:2px}
#mfProgText{font-size:11px;color:#4a4a62;font-weight:500}
#mfHotGigs{width:calc(100% - 36px);display:flex;align-items:center;gap:14px;padding:14px 16px;margin:4px 18px 16px;background:#111116;border:1px solid #1e1e28;border-left:3px solid #ca8a04;border-radius:10px;cursor:pointer;color:#c8c8d8;font-family:inherit;font-size:13px;text-align:left;transition:all 0.2s}
#mfHotGigs:hover{background:#141418;transform:translateY(-1px);border-left-color:#eab308}
#mfHGIcon{width:38px;height:38px;background:rgba(202,138,4,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
#mfHGText{flex:1}
#mfHGText b{color:#fbbf24;font-size:13px;font-weight:600;display:block}
#mfHGText small{color:#4a4a62;font-size:11.5px;margin-top:2px;display:block}
#mfHGPrompt{padding:16px 18px;background:#0e0e14;border-top:1px solid #1a1a22;display:none}
#mfHGPromptTitle{font-size:13.5px;font-weight:600;color:#fbbf24;margin-bottom:14px;display:flex;align-items:center;gap:8px}
#mfHGScanBtn{width:100%;padding:13px;background:linear-gradient(135deg,#92400e,#78350f);color:#fef3c7;border:1px solid rgba(251,191,36,0.2);border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:8px;transition:all 0.2s}
#mfHGScanBtn:hover{background:linear-gradient(135deg,#b45309,#92400e);transform:translateY(-1px)}
#mfHGCancel{width:100%;padding:11px;background:none;border:1px solid #1e1e28;color:#4a4a62;border-radius:9px;font-size:12.5px;cursor:pointer;font-family:inherit;margin-top:6px;transition:all 0.15s;font-weight:500}
#mfHGCancel:hover{border-color:#2e2e42;color:#9090a8}
#mfStats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:4px 18px 16px}
.mfStat{text-align:center;background:#111116;border:1px solid #1e1e28;padding:14px 4px 12px;border-radius:12px;transition:all 0.2s}
.mfStat:nth-child(2){background:linear-gradient(145deg,rgba(124,58,237,0.1),rgba(91,33,182,0.06));border-color:rgba(139,92,246,0.3)}
.mfStatN{display:block;font-size:22px;font-weight:800;color:#f0f0f8;margin-bottom:4px;letter-spacing:-1px;line-height:1}
.mfStat:nth-child(2) .mfStatN{color:#a78bfa}
.mfStat small{font-size:8.5px;color:#3e3e55;text-transform:uppercase;letter-spacing:0.8px;font-weight:700}
#mfChips{display:flex;gap:6px;padding:0 18px 14px;overflow-x:auto;scrollbar-width:none}
#mfChips::-webkit-scrollbar{display:none}
.mfChip{padding:6px 14px;border-radius:20px;border:1px solid #1e1e28;background:#111116;color:#4a4a62;font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;font-family:inherit}
.mfChip:hover{border-color:#2e2e42;color:#9090a8}
.mfChipOn{background:#7c3aed!important;border-color:#7c3aed!important;color:#fff!important;font-weight:600}
#mfFilters{padding:0 18px 12px;display:flex;flex-direction:column;gap:6px}
.mfFB{background:#111116;border:1px solid #1e1e28;border-radius:10px;overflow:hidden;transition:border-color 0.2s}
.mfFB[open]{border-color:#2a2a36}
.mfFB summary{padding:12px 14px;cursor:pointer;font-size:12px;font-weight:700;color:#9090a8;list-style:none;display:flex;align-items:center;gap:10px;transition:background 0.15s,color 0.15s}
.mfFB summary::-webkit-details-marker{display:none}
.mfFB summary:hover{background:#141418;color:#d0d0e0}
.mfFBIcon{color:#7c3aed;display:flex;align-items:center}
.mfFBody{padding:6px 14px 12px;border-top:1px solid #1a1a22;display:flex;flex-direction:column;gap:2px}
.mfChk{display:flex;align-items:center;justify-content:space-between;padding:8px 6px;border-radius:8px;cursor:pointer;font-size:12.5px;color:#6a6a82;font-weight:500;transition:all 0.15s}
.mfChk:hover{background:#141418;color:#c8c8d8}
.mfChk input[type="checkbox"]{-webkit-appearance:none;appearance:none;width:34px;height:19px;border-radius:10px;cursor:pointer;position:relative;flex-shrink:0;background:#1e1e28;border:1px solid #2a2a36;transition:all 0.22s;margin-left:12px}
.mfChk input[type="checkbox"]::after{content:'';position:absolute;top:2px;left:2px;width:13px;height:13px;background:#3a3a50;border-radius:50%;transition:all 0.22s}
.mfChk input[type="checkbox"]:checked{background:#7c3aed;border-color:#7c3aed}
.mfChk input[type="checkbox"]:checked::after{left:17px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
#mfActions{display:flex;gap:8px;padding:8px 18px 16px}
#mfApplyBtn{flex:1;padding:12px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(124,58,237,0.35);font-family:inherit}
#mfApplyBtn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,58,237,0.5)}
#mfClearBtn{padding:12px 18px;background:#111116;border:1px solid #1e1e28;color:#4a4a62;border-radius:10px;font-size:13px;cursor:pointer;transition:all 0.15s;font-weight:500;font-family:inherit}
#mfClearBtn:hover{border-color:#2e2e42;color:#9090a8}
.mfListBar{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;font-size:12px;color:#4a4a62}
.mfListBar b{color:#c8c8d8}
.mfSmlBtn{background:#111116;border:1px solid #1e1e28;color:#4a4a62;padding:7px 14px;border-radius:8px;font-size:11.5px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;transition:all 0.15s;font-weight:500}
.mfSmlBtn:hover{border-color:#2e2e42;color:#c8c8d8}
.mfCList{padding:0 18px 18px}
.mfRC{background:#111116;border:1px solid #1a1a22;border-radius:12px;padding:14px 16px;margin-bottom:8px;transition:all 0.2s;display:flex;flex-direction:column}
.mfRC:hover{border-color:#2a2a36;background:#131318;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.4)}
.mfRCTop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;cursor:pointer}
.mfRCName{font-weight:700;font-size:13.5px;color:#e8e8f4;flex:1;line-height:1.3}
.mfRCRat{font-size:12px;color:#4a4a62;display:flex;align-items:center;gap:3px;flex-shrink:0;margin-left:8px}
.mfRCStar{color:#f59e0b}
.mfRCCat{font-size:11.5px;color:#3e3e55;margin-bottom:10px;cursor:pointer}
.mfRCMeta{display:flex;gap:12px;font-size:11.5px;color:#4a4a62;margin-bottom:10px;align-items:center}
.mfRCBadges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}
.mfTag{padding:3px 9px;border-radius:5px;font-size:10px;font-weight:600;letter-spacing:0.2px}
.mfTR{background:rgba(239,68,68,0.1);color:#f87171}
.mfTG{background:rgba(34,197,94,0.1);color:#4ade80}
.mfTY{background:rgba(234,179,8,0.1);color:#facc15}
.mfRCActs{display:flex;align-items:center;gap:10px;padding-top:10px;border-top:1px solid #1a1a22;font-size:11.5px;color:#4a4a62;font-weight:500}
.mfRCAct{display:flex;align-items:center;gap:5px;cursor:pointer;transition:color 0.15s;padding:4px 0}
.mfRCAct:hover{color:#c8c8d8}
.mfRCNoteAct{color:#8b5cf6;margin-left:auto}
.mfRCNoteAct:hover{color:#a78bfa}
.mfCNoteArea{margin-top:10px;width:100%;background:#0e0e14;border:1px solid #1e1e28;border-radius:8px;color:#c8c8d8;padding:10px 12px;font-family:inherit;font-size:12px;resize:vertical;min-height:48px;outline:none;transition:border-color 0.2s;line-height:1.5}
.mfCNoteArea:focus{border-color:#7c3aed}
.mfNoteMeta{font-size:10px;color:#2e2e42;margin-top:5px;text-align:right}
#mfToast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(64px);padding:12px 24px;border-radius:10px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;z-index:2147483647;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;background:#131318;border:1px solid #2a2a36;border-left:3px solid #8b5cf6;color:#e8e8f4;box-shadow:0 12px 40px rgba(0,0,0,0.7);white-space:nowrap}
#mfToast.mfTShow{transform:translateX(-50%) translateY(0)}
#mfToast.mfTOk{border-left-color:#22c55e}
#mfToast.mfTErr{border-left-color:#ef4444}
#mfToast.mfTInfo{border-left-color:#8b5cf6}
  `;

  function createPanel() {
    if (document.getElementById('mf-host')) return;
    const host = document.createElement('div');
    host.id = 'mf-host';
    host.style.cssText = 'all:initial;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none';
    document.body.appendChild(host);
    SR = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = CSS;
    SR.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'mf-panel-v4';
    panel.innerHTML = `
      <div id="mfHeader">
        <div id="mfDrag">
          <div id="mfBrand">
            <div id="mfLogoBox">${ic.map}</div>
            <span id="mfTitle">MapFilter</span>
            <span id="mfBadge">PRO</span>
          </div>
          <div id="mfWinBtns">
            <button class="mfWBtn" id="mfMinBtn">${ic.min}</button>
            <button class="mfWBtn" id="mfCloseBtn">${ic.close}</button>
          </div>
        </div>
        <div id="mfTabs">
          <button class="mfTab mfTActive" data-tab="scanner">Scanner</button>
          <button class="mfTab" data-tab="notes">Saved Notes <span id="mfNCount" style="margin-left:4px;color:#a78bfa;font-size:11px">0</span></button>
        </div>
      </div>
      <div id="mfBody">
        <div id="mfViewScanner" class="mfVActive">
          <div id="mfSearch">
            <div class="mfField"><span class="mfFSvg">${ic.search}</span><input type="text" id="mfQuery" placeholder="Business type (plumber, dentist, cafe...)"></div>
            <div class="mfField"><span class="mfFSvg">${ic.pin}</span><input type="text" id="mfLocation" placeholder="Location (Austin TX, London...)"><button id="mfGps">${ic.gps}</button></div>
            <div id="mfRadiusBox"><div id="mfRadiusTop"><span id="mfRadiusLabel">Radius</span><span id="mfRadiusVal">5 km</span></div><input type="range" id="mfRadiusSlider" min="1" max="100" value="5"><div id="mfRadiusMarks"><span>1</span><span>25</span><span>50</span><span>75</span><span>100km</span></div></div>
            <button id="mfScanBtn"><span id="mfScanIcon">${ic.scan}</span><span id="mfScanText">Scan Area</span></button>
            <div id="mfProg" style="display:none"><div id="mfProgTrack"><div id="mfProgBar"></div></div><div id="mfProgText">Preparing scan...</div></div>
          </div>
          <button id="mfHotGigs"><div id="mfHGIcon">${ic.bolt}</div><div id="mfHGText"><b>Hot Gigs</b><small>No website · Has phone · Few reviews</small></div>${ic.chev}</button>
          <div id="mfHGPrompt">
            <div id="mfHGPromptTitle">${ic.bolt} Quick Area Scan</div>
            <div class="mfField" style="margin-bottom:12px"><span class="mfFSvg">${ic.pin}</span><input type="text" id="mfHGLocation" placeholder="Where? (city, area...)"><button id="mfHGGps">${ic.gps}</button></div>
            <div id="mfRadiusBox" style="margin-bottom:12px"><div id="mfRadiusTop"><span id="mfRadiusLabel">Radius</span><span id="mfHGRadiusVal">10 km</span></div><input type="range" id="mfHGRadiusSlider" min="1" max="100" value="10"></div>
            <button id="mfHGScanBtn">Scan for Hot Gigs</button>
            <button id="mfHGCancel">Cancel</button>
          </div>
          <div id="mfStats" style="display:none"><div class="mfStat"><span class="mfStatN" id="mfSTot">0</span><small>Total</small></div><div class="mfStat"><span class="mfStatN" id="mfSMatch">0</span><small>Matches</small></div><div class="mfStat"><span class="mfStatN" id="mfSNoWeb">0</span><small>No Site</small></div><div class="mfStat"><span class="mfStatN" id="mfSNoPh">0</span><small>No Phone</small></div></div>
          <div id="mfChips" style="display:none"><button class="mfChip mfChipOn" data-p="all">All Results</button><button class="mfChip" data-p="no-website">No Website</button><button class="mfChip" data-p="no-reviews">No Reviews</button><button class="mfChip" data-p="weak">Weak Online</button><button class="mfChip" data-p="leads">Hot Leads</button></div>
          <div id="mfFilters" style="display:none">
            <details class="mfFB" open><summary><span class="mfFBIcon">${ic.globe}</span>Website Filter</summary><div class="mfFBody"><label class="mfChk"><span>No website</span><input type="checkbox" data-f="no-website"></label><label class="mfChk"><span>Has website</span><input type="checkbox" data-f="has-website"></label><label class="mfChk"><span>Social media only</span><input type="checkbox" data-f="social-only"></label></div></details>
            <details class="mfFB"><summary><span class="mfFBIcon">${ic.chat}</span>Reviews Filter</summary><div class="mfFBody"><label class="mfChk"><span>No reviews</span><input type="checkbox" data-f="no-reviews"></label><label class="mfChk"><span>Under 10 reviews</span><input type="checkbox" data-f="few-reviews"></label></div></details>
            <details class="mfFB"><summary><span class="mfFBIcon">${ic.phone}</span>Contact Filter</summary><div class="mfFBody"><label class="mfChk"><span>Has phone number</span><input type="checkbox" data-f="has-phone"></label><label class="mfChk"><span>No phone number</span><input type="checkbox" data-f="no-phone"></label></div></details>
            <details class="mfFB"><summary><span class="mfFBIcon">${ic.clip}</span>Profile Filter</summary><div class="mfFBody"><label class="mfChk"><span>Incomplete profile</span><input type="checkbox" data-f="incomplete"></label><label class="mfChk"><span>No photos</span><input type="checkbox" data-f="no-photos"></label></div></details>
          </div>
          <div id="mfActions" style="display:none"><button id="mfApplyBtn">Apply Filters</button><button id="mfClearBtn">Clear All</button></div>
          <div id="mfResultsWrap" style="display:none">
            <div class="mfListBar"><span>Showing <b id="mfRCount">0</b> results</span><button class="mfSmlBtn" id="mfExportBtn">${ic.dl} Export CSV</button></div>
            <div id="mfRList" class="mfCList"></div>
          </div>
        </div>
        <div id="mfViewNotes">
          <div class="mfListBar"><span>You have <b id="mfNCountFull">0</b> saved notes</span><button class="mfSmlBtn" id="mfExportNotesBtn">${ic.dl} Export</button></div>
          <div id="mfNList" class="mfCList"></div>
        </div>
      </div>
      <div id="mfToast"></div>
    `;
    SR.appendChild(panel);
    bindEvents();
    loadSaved();
    loadNotes();
  }

  function bindEvents() {
    const panel = $id('mf-panel-v4');
    const drag = $id('mfDrag');
    let isDrag = false, sX, sY, sL, sT;
    drag.addEventListener('mousedown', e => { if (e.target.closest('.mfWBtn')) return; isDrag = true; sX = e.clientX; sY = e.clientY; const r = panel.getBoundingClientRect(); sL = r.left; sT = r.top; panel.style.transition = 'none'; });
    document.addEventListener('mousemove', e => { if (!isDrag) return; panel.style.left = (sL + e.clientX - sX) + 'px'; panel.style.top = (sT + e.clientY - sY) + 'px'; panel.style.right = 'auto'; });
    document.addEventListener('mouseup', () => { isDrag = false; panel.style.transition = ''; });
    $id('mfCloseBtn').onclick = () => panel.classList.add('mfHidden');
    $id('mfMinBtn').onclick = () => panel.classList.toggle('mfMin');
    $all('.mfTab').forEach(t => { t.onclick = () => { $all('.mfTab').forEach(b => b.classList.remove('mfTActive')); t.classList.add('mfTActive'); $id('mfViewScanner').classList.remove('mfVActive'); $id('mfViewNotes').classList.remove('mfVActive'); if (t.dataset.tab === 'scanner') $id('mfViewScanner').classList.add('mfVActive'); else { $id('mfViewNotes').classList.add('mfVActive'); renderNotes(); } }; });
    $id('mfRadiusSlider').oninput = e => { $id('mfRadiusVal').textContent = e.target.value + ' km'; };
    $id('mfGps').onclick = () => gpsFill($id('mfLocation'));
    $id('mfScanBtn').onclick = () => { if (isScanning) { cancelScan = true; } else startScan(false); };
    $id('mfQuery').onkeydown = e => { if (e.key === 'Enter') startScan(false); };
    $id('mfLocation').onkeydown = e => { if (e.key === 'Enter') startScan(false); };
    $id('mfHotGigs').onclick = () => { const q = $id('mfQuery')?.value?.trim(); if (allBiz.length && q) { applyHotGigs(); toast('Hot Gigs applied.', 'ok'); return; } const prompt = $id('mfHGPrompt'); const loc = $id('mfLocation')?.value?.trim(); if (loc) $id('mfHGLocation').value = loc; prompt.style.display = prompt.style.display === 'none' ? 'block' : 'none'; };
    $id('mfHGRadiusSlider').oninput = e => { $id('mfHGRadiusVal').textContent = e.target.value + ' km'; };
    $id('mfHGGps').onclick = () => gpsFill($id('mfHGLocation'));
    $id('mfHGCancel').onclick = () => { $id('mfHGPrompt').style.display = 'none'; };
    $id('mfHGScanBtn').onclick = () => { const loc = $id('mfHGLocation')?.value?.trim(); if (!loc) { toast('Please enter a location first.', 'err'); return; } $id('mfHGPrompt').style.display = 'none'; $id('mfLocation').value = loc; const r = $id('mfHGRadiusSlider').value; $id('mfRadiusSlider').value = r; $id('mfRadiusVal').textContent = r + ' km'; $id('mfQuery').value = 'businesses'; startScan(true); };
    $all('.mfChip').forEach(chip => { chip.onclick = () => { $all('.mfChip').forEach(c => c.classList.remove('mfChipOn')); chip.classList.add('mfChipOn'); $all('[data-f]').forEach(cb => cb.checked = false); const p = chip.dataset.p; if (p === 'no-website') fc('no-website'); else if (p === 'no-reviews') fc('no-reviews'); else if (p === 'weak') { fc('no-website'); fc('few-reviews'); } else if (p === 'leads') { fc('no-website'); fc('has-phone'); } applyFilters(); }; });
    $all('[data-f]').forEach(cb => { cb.onchange = applyFilters; });
    $id('mfApplyBtn').onclick = () => { applyFilters(); highlightResults(); toast(filtered.length + ' businesses highlighted', 'ok'); };
    $id('mfClearBtn').onclick = () => { $all('[data-f]').forEach(cb => cb.checked = false); $all('.mfChip').forEach(c => c.classList.remove('mfChipOn')); $q('[data-p="all"]').classList.add('mfChipOn'); applyFilters(); toast('Filters cleared', 'info'); };
    $id('mfExportBtn').onclick = () => exportCSV(filtered, 'mapfilter-scan');
    $id('mfExportNotesBtn').onclick = () => exportCSV(savedNotes, 'mapfilter-notes');
    panel.addEventListener('click', e => { const a = e.target.closest('[data-action]'); if (!a) return; const act = a.dataset.action; if (act === 'openBiz') openBiz(a.dataset.name); else if (act === 'toggleNote') toggleNote(a.dataset.idx); else if (act === 'openMapUrl') openMapUrl(a.dataset.url); else if (act === 'delNote') delNote(a.dataset.id); });
    panel.addEventListener('input', e => { const a = e.target.closest('[data-action="saveNote"]'); if (!a) return; saveNoteText(a.dataset.id, a); });
  }

  function gpsFill(inp) { inp.value = 'Locating...'; navigator.geolocation.getCurrentPosition(p => { inp.value = p.coords.latitude.toFixed(4) + ', ' + p.coords.longitude.toFixed(4); toast('Location acquired', 'ok'); }, () => { inp.value = ''; toast('Type location manually', 'info'); }, { enableHighAccuracy: true, timeout: 10000 }); }
  function fc(n) { const el = $q('[data-f="' + n + '"]'); if (el) el.checked = true; }
  function getRadius() { return parseInt($id('mfRadiusSlider')?.value) || 5; }

  function getSearchAreas(q, loc, km) {
    const a = [q + ' in ' + loc]; if (km <= 5) return a;
    const dirs = ['north','south','east','west'], subDirs = ['northeast','northwest','southeast','southwest'];
    if (km > 5) dirs.forEach(d => a.push(q + ' in ' + d + ' ' + loc));
    if (km > 15) subDirs.forEach(d => a.push(q + ' in ' + d + ' ' + loc));
    if (km >= 30) { for (let dist = 20; dist <= km; dist += 20) { [...dirs,...subDirs].forEach(d => a.push(q + ' ' + dist + 'km ' + d + ' of ' + loc)); } }
    return [...new Set(a)];
  }

  async function startScan(hotGigs) {
    const query = $id('mfQuery')?.value?.trim(), location = $id('mfLocation')?.value?.trim();
    if (!query) { toast('Enter a business type', 'err'); return; }
    if (!location) { toast('Enter a location', 'err'); return; }
    if (isScanning) return;
    isScanning = true; cancelScan = false;
    const btn = $id('mfScanBtn');
    btn.classList.add('scanning'); $id('mfScanText').textContent = 'Stop Scan'; $id('mfScanIcon').innerHTML = ic.stop; $id('mfProg').style.display = 'block'; $id('mfProgBar').style.width = '3%';
    const radius = getRadius(), searches = getSearchAreas(query, location, radius);
    allBiz = []; const seen = new Set();
    toast('Scanning ' + searches.length + ' zones...', 'info');
    try {
      for (let i = 0; i < searches.length; i++) {
        if (cancelScan) { toast('Scan aborted.', 'info'); break; }
        updateProgress(i + 1, searches.length, searches[i].substring(0, 35));
        const ok = await doSearch(searches[i]); if (!ok) continue;
        await wait(2000); await scrollFeed();
        const cards = getCards();
        for (let j = 0; j < cards.length; j++) {
          if (cancelScan) break;
          const basic = readCard(cards[j]);
          if (!basic.name || seen.has(basic.name)) continue;
          seen.add(basic.name);
          try { Object.assign(basic, await clickAndRead(cards[j])); } catch (e) {}
          if (basic.website) { const soc = ['facebook.com','instagram.com','twitter.com','x.com','linkedin.com','tiktok.com','youtube.com']; basic.isSocialOnly = soc.some(d => basic.website.toLowerCase().includes(d)); } else basic.isSocialOnly = false;
          const clean = { ...basic }; delete clean.el;
          clean.id = btoa(unescape(encodeURIComponent(clean.name + (clean.phone||'') + (clean.rating||'')))).substring(0, 20);
          allBiz.push(clean);
        }
      }
      chrome.storage.local.set({ lastScan: allBiz, lastScanTime: Date.now(), lastQuery: query, lastLocation: location });
      showResults(); if (hotGigs) applyHotGigs(); else applyFilters();
      if (!cancelScan) toast('Done. ' + allBiz.length + ' indexed.', 'ok');
    } catch (e) {
      if (allBiz.length) { chrome.storage.local.set({ lastScan: allBiz, lastScanTime: Date.now() }); showResults(); applyFilters(); toast('Partial scan saved.', 'ok'); }
      else toast('Scan failed: ' + e.message, 'err');
    }
    isScanning = false; cancelScan = false; btn.classList.remove('scanning'); $id('mfScanText').textContent = 'Scan Area'; $id('mfScanIcon').innerHTML = ic.scan; $id('mfProg').style.display = 'none';
  }

  function updateProgress(c, t, txt) { $id('mfProgBar').style.width = (Math.round((c/t)*90)+5)+'%'; $id('mfProgText').textContent = 'Zone '+c+'/'+t+' · '+(txt||''); }

  async function doSearch(query) {
    let sb = null; for (const s of ['#searchboxinput','input[aria-label="Search Google Maps"]','input[name="q"]']) { sb = document.querySelector(s); if (sb) break; } if (!sb) return false;
    sb.focus(); await wait(200); sb.select(); await wait(100); sb.value = ''; sb.dispatchEvent(new Event('input',{bubbles:true})); await wait(100);
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; set.call(sb,query);
    sb.dispatchEvent(new Event('input',{bubbles:true})); sb.dispatchEvent(new Event('change',{bubbles:true})); sb.dispatchEvent(new InputEvent('input',{bubbles:true,data:query,inputType:'insertText'})); await wait(400);
    if (sb.value !== query) { sb.value=''; sb.focus(); for (const ch of query) { sb.value+=ch; sb.dispatchEvent(new InputEvent('input',{bubbles:true,data:ch,inputType:'insertText'})); await wait(10); } await wait(200); }
    sb.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true})); await wait(200);
    const form=sb.closest('form'); if(form) try{form.dispatchEvent(new Event('submit',{bubbles:true}))}catch(e){} await wait(200);
    for (const s of ['#searchbox-searchbutton','button[aria-label="Search"]']) { const b=document.querySelector(s); if(b){b.click();break;} }
    let att=0; while(att<20){await wait(300);if(getCards().length>0){await wait(600);return true;}att++;} return false;
  }

  async function scrollFeed() {
    let feed=null; for (const s of ['div[role="feed"]','.m6QErb.DxyBCb','.m6QErb.WNBkOb','.m6QErb']) { feed=document.querySelector(s); if(feed) break; } if (!feed) return;
    let prev=0,stale=0; while(stale<3){feed.scrollTop=feed.scrollHeight;await wait(600);if(feed.scrollHeight===prev)stale++;else stale=0;prev=feed.scrollHeight;if(getCards().length>=120)break;} feed.scrollTop=0;await wait(150);
  }

  function getCards() { for(const s of ['div.Nv2PK','a.hfpxzc','div[jsaction*="mouseover:pane"]']){const f=document.querySelectorAll(s);if(f.length)return[...f];}return[]; }

  function readCard(card) {
    const info={name:'',category:'',rating:null,reviewCount:0,address:'',phone:'',website:'',isOpen:null,photoCount:0,hasHours:false,mapsUrl:'',el:card};
    for(const s of ['.qBF1Pd','.fontHeadlineSmall','.NrDZNb']){const el=card.querySelector(s);if(el?.textContent?.trim()){info.name=el.textContent.trim();break;}}
    if(!info.name)info.name=card.getAttribute('aria-label')?.trim()||'';
    const rat=card.querySelector('.MW4etd');if(rat)info.rating=parseFloat(rat.textContent)||null;
    const rev=card.querySelector('.UY7F9');if(rev){const m=rev.textContent.match(/([\d,]+)/);if(m)info.reviewCount=parseInt(m[1].replace(/,/g,''));}
    card.querySelectorAll('.W4Efsd').forEach(s=>{const t=s.textContent.trim();if(t.includes('·'))t.split('·').map(p=>p.trim()).forEach(p=>{if(p&&!p.match(/^[\d.]+$/)&&!p.match(/\(\d/)&&p.length<40&&!info.category)info.category=p;});if(t.toLowerCase().includes('open'))info.isOpen=true;if(t.toLowerCase().includes('closed'))info.isOpen=false;});
    return info;
  }

  async function clickAndRead(card) {
    const d={};
    try{(card.querySelector('a.hfpxzc')||card).click();}catch(e){card.click();}
    let att=0;while(att<15){if(document.querySelector('button[data-item-id="address"]')||document.querySelector('a[data-item-id="authority"]')||document.querySelector('button[data-item-id*="phone"]')||document.querySelector('.DkEaL')||document.querySelector('h1.DUwDvf'))break;await wait(200);att++;}
    for(const s of ['a[data-item-id="authority"]','a[aria-label*="ebsite"]','a[data-tooltip="Open website"]']){const el=document.querySelector(s);if(el?.href){d.website=el.href;break;}}
    for(const s of ['button[data-item-id*="phone"]','[data-tooltip="Copy phone number"]','button[aria-label*="Phone"]']){const el=document.querySelector(s);if(el){const m=(el.getAttribute('aria-label')||el.textContent||'').match(/[\d\s\-().+]{7,}/);if(m){d.phone=m[0].trim();break;}}}
    for(const s of ['button[data-item-id="address"]','[data-tooltip="Copy address"]']){const el=document.querySelector(s);if(el){d.address=(el.getAttribute('aria-label')||el.textContent||'').replace(/^Address:\s*/i,'').trim();break;}}
    d.hasHours=!!(document.querySelector('[data-item-id="oh"]')||document.querySelector('.t39EBf'));
    const ph=document.querySelector('button[aria-label*="photo"]');if(ph){const m=(ph.getAttribute('aria-label')||'').match(/([\d,]+)/);if(m)d.photoCount=parseInt(m[1].replace(/,/g,''));}
    const cat=document.querySelector('.DkEaL');if(cat)d.category=cat.textContent?.trim()||'';
    d.mapsUrl=window.location.href;
    for(const s of ['button[aria-label="Back"]','button[jsaction*="back"]']){const btn=document.querySelector(s);if(btn){btn.click();await wait(600);let w=0;while(w<12&&getCards().length===0){await wait(200);w++;}if(getCards().length===0){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,bubbles:true}));await wait(500);}break;}}
    return d;
  }

  function showResults() {
    ['mfStats','mfChips','mfFilters','mfActions','mfResultsWrap'].forEach(id=>{$id(id).style.display='';});
    animN('mfSTot',allBiz.length); animN('mfSNoWeb',allBiz.filter(b=>!b.website).length); animN('mfSNoPh',allBiz.filter(b=>!b.phone).length);
  }
  function animN(id,target){const el=$id(id);let c=0;const s=Math.max(1,Math.ceil(target/20));const t=setInterval(()=>{c+=s;if(c>=target){c=target;clearInterval(t);}el.textContent=c;},30);}

  function applyFilters() {
    const f={}; $all('[data-f]:checked').forEach(cb=>f[cb.dataset.f]=true);
    filtered=allBiz.filter(b=>{if(f['no-website']&&b.website)return false;if(f['has-website']&&!b.website)return false;if(f['social-only']&&!b.isSocialOnly)return false;if(f['no-reviews']&&(b.reviewCount||0)>0)return false;if(f['few-reviews']&&(b.reviewCount||0)>=10)return false;if(f['has-phone']&&!b.phone)return false;if(f['no-phone']&&b.phone)return false;if(f['incomplete']&&b.website&&b.phone)return false;if(f['no-photos']&&b.photoCount>0)return false;return true;});
    $id('mfSMatch').textContent=filtered.length; renderResults();
  }

  function applyHotGigs(){$all('[data-f]').forEach(cb=>cb.checked=false);fc('no-website');fc('has-phone');fc('few-reviews');$all('.mfChip').forEach(c=>c.classList.remove('mfChipOn'));showResults();applyFilters();highlightResults();}
  function isSaved(id){return savedNotes.some(n=>n.id===id);}

  function toggleNote(idx) {
    const b=filtered[parseInt(idx)]; if(!b) return;
    const exists=savedNotes.findIndex(n=>n.id===b.id);
    if(exists>-1){savedNotes.splice(exists,1);toast('Removed from Notes','info');}
    else{savedNotes.push({...b,noteText:'',dateSaved:Date.now()});toast('Lead Saved ⭐','ok');}
    chrome.storage.local.set({mfNotes:savedNotes}); refreshNoteCounts(); renderResults();
    if($id('mfViewNotes').classList.contains('mfVActive')) renderNotes();
  }

  function saveNoteText(id,textArea){const idx=savedNotes.findIndex(n=>n.id===id);if(idx>-1){savedNotes[idx].noteText=textArea.value;chrome.storage.local.set({mfNotes:savedNotes});}}

  function delNote(id) {
    if(!id) return; const prev=savedNotes.length;
    savedNotes=savedNotes.filter(n=>String(n.id)!==String(id));
    if(savedNotes.length<prev){chrome.storage.local.set({mfNotes:savedNotes});toast('Lead Trashed','ok');refreshNoteCounts();renderNotes();if($id('mfViewScanner')?.classList.contains('mfVActive'))renderResults();}
  }

  function refreshNoteCounts(){if($id('mfNCount'))$id('mfNCount').textContent=savedNotes.length;if($id('mfNCountFull'))$id('mfNCountFull').textContent=savedNotes.length;}

  function renderResults() {
    const list=$id('mfRList'); $id('mfRCount').textContent=filtered.length;
    if(!filtered.length){list.innerHTML='<div style="text-align:center;padding:32px 10px;color:#3e3e55;font-size:13px">No targets match filters</div>';return;}
    list.innerHTML=filtered.slice(0,50).map((b,i)=>{
      const saved=isSaved(b.id);
      return `<div class="mfRC">
        <div class="mfRCTop" data-action="openBiz" data-name="${esc(b.name)}"><span class="mfRCName">${esc(b.name)}</span><span class="mfRCRat">${b.rating?'<span class="mfRCStar">★</span> '+b.rating:'—'}</span></div>
        <div class="mfRCCat" data-action="openBiz" data-name="${esc(b.name)}">${esc(b.category||'Uncategorized')}</div>
        <div class="mfRCMeta">${b.phone?'<span>'+esc(b.phone)+'</span>':''}<span>${b.reviewCount||0} reviews</span></div>
        <div class="mfRCBadges">
          ${!b.website?'<span class="mfTag mfTR">No Website</span>':'<span class="mfTag mfTG">Has Website</span>'}
          ${!b.phone?'<span class="mfTag mfTR">No Phone</span>':''}
          ${(b.reviewCount||0)===0?'<span class="mfTag mfTY">Zero Reviews</span>':''}
        </div>
        <div class="mfRCActs">
          <div class="mfRCAct" data-action="openBiz" data-name="${esc(b.name)}">${ic.link} Profile</div>
          <div class="mfRCAct mfRCNoteAct" data-action="toggleNote" data-idx="${i}">${saved?ic.star:ic.bolt} ${saved?'Saved':'Save Lead'}</div>
        </div>
      </div>`;
    }).join('');
  }

  function renderNotes() {
    const list=$id('mfNList');
    if(!savedNotes.length){list.innerHTML='<div style="text-align:center;padding:40px;color:#3e3e55;font-size:13px">Saved leads appear here.</div>';return;}
    list.innerHTML=savedNotes.map(b=>`
      <div class="mfRC" style="border-color:rgba(139,92,246,0.2)">
        <div class="mfRCTop"><span class="mfRCName">${esc(b.name)}</span><span class="mfRCRat">${b.rating?'<span class="mfRCStar">★</span> '+b.rating:'—'}</span></div>
        <div class="mfRCCat">${esc(b.category||'Uncategorized')}</div>
        <div class="mfRCMeta">${b.phone?'<span>'+esc(b.phone)+'</span>':''}</div>
        <textarea class="mfCNoteArea" placeholder="Type notes here..." data-action="saveNote" data-id="${b.id}">${esc(b.noteText||'')}</textarea>
        <div class="mfNoteMeta">Saved ${new Date(b.dateSaved).toLocaleDateString()}</div>
        <div class="mfRCActs">
          <div class="mfRCAct" data-action="openMapUrl" data-url="${b.mapsUrl}">${ic.link} Link</div>
          <div class="mfRCAct mfRCNoteAct" data-action="delNote" data-id="${b.id}" style="color:#f87171">${ic.trash} Trash</div>
        </div>
      </div>`).join('');
  }

  function openMapUrl(url){if(url)window.open(url,'_blank');}
  function openBiz(name){for(const card of getCards()){const el=card.querySelector('.qBF1Pd')||card.querySelector('.fontHeadlineSmall');if((el?.textContent?.trim()||card.getAttribute('aria-label')?.trim()||'')===name){(card.querySelector('a.hfpxzc')||card).click();card.scrollIntoView({behavior:'smooth',block:'center'});return;}}}
  function highlightResults(){const names=new Set(filtered.map(b=>b.name));document.querySelectorAll('.mf-match,.mf-dim').forEach(el=>el.classList.remove('mf-match','mf-dim'));getCards().forEach(card=>{const el=card.querySelector('.qBF1Pd')||card.querySelector('.fontHeadlineSmall');const n=el?.textContent?.trim()||card.getAttribute('aria-label')?.trim()||'';if(names.has(n))card.classList.add('mf-match');else if(names.size>0)card.classList.add('mf-dim');});}
  function exportCSV(dataArray,filename){if(!dataArray||!dataArray.length){toast('No records to export','err');return;}const fields=['name','category','address','phone','website','rating','reviewCount','noteText'];const csv=[fields.join(','),...dataArray.map(r=>fields.map(f=>'"'+String(r[f]||'').replace(/"/g,'""')+'"').join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename+'.csv';a.click();toast('CSV generated','ok');}
  async function loadSaved(){try{const data=await chrome.storage.local.get(['lastScan','lastQuery','lastLocation']);if(data.lastScan?.length){allBiz=data.lastScan;if(data.lastQuery)$id('mfQuery').value=data.lastQuery;if(data.lastLocation)$id('mfLocation').value=data.lastLocation;showResults();applyFilters();}}catch(e){}}
  async function loadNotes(){try{const data=await chrome.storage.local.get(['mfNotes']);if(data.mfNotes){savedNotes=data.mfNotes;refreshNoteCounts();}}catch(e){}}
  function toggleMapFilter(){const host=document.getElementById('mf-host');if(!host){createPanel();return;}const panel=$id('mf-panel-v4');if(panel)panel.classList.toggle('mfHidden');}
  function toast(msg,type){let t=$id('mfToast');if(!t)return;t.className=type==='ok'?'mfTOk':type==='err'?'mfTErr':'mfTInfo';t.textContent=msg;requestAnimationFrame(()=>t.classList.add('mfTShow'));setTimeout(()=>t.classList.remove('mfTShow'),2500);}
  function esc(s){if(!s)return'';const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  createPanel();

  if(typeof chrome!=='undefined'&&chrome.runtime?.onMessage){
    chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
      if(msg.action==='togglePanel'){toggleMapFilter();sendResponse({ok:true});}
    });
  }

  console.log('[MapFilter Pro] v5 Shadow DOM Ready');
})();