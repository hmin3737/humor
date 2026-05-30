'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { addHumorAction, type ActionState } from './actions';
import { buildSegments } from '@/lib/highlight';

const initial: ActionState = {};

export default function HumorForm() {
  const [state, formAction, pending] = useActionState(addHumorAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [overlap, setOverlap] = useState('');

  // Reset fields after a successful submit.
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setFront('');
      setBack('');
      setOverlap('');
    }
  }, [state.ok]);

  const segs = buildSegments(front, back, overlap);
  const hasPreview = front || back;

  return (
    <form ref={formRef} action={formAction} className="card form-grid">
      <div className="field">
        <label htmlFor="author">창작자 이름</label>
        <input id="author" name="author" type="text" placeholder="예: 홍길동" />
      </div>

      <div className="field">
        <label>유머 ('도'는 자동으로 들어가요)</label>
        <div className="input-row">
          <input
            name="front"
            type="text"
            placeholder="앞부분 (예: 분위기)"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
          <span className="fixed-do">도</span>
          <input
            name="back"
            type="text"
            placeholder="뒷부분 (예: 위기다)"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="overlap">겹치는 글자 (파란색으로 강조돼요)</label>
        <input
          id="overlap"
          name="overlap"
          type="text"
          placeholder="예: 위기"
          value={overlap}
          onChange={(e) => setOverlap(e.target.value)}
        />
      </div>

      <div className="preview">
        {hasPreview ? (
          segs.map((s, i) =>
            s.highlight ? (
              <span className="blue" key={i}>
                {s.text}
              </span>
            ) : (
              <span key={i}>{s.text}</span>
            )
          )
        ) : (
          <span className="ph">여기에 미리보기가 표시돼요</span>
        )}
      </div>

      {state.error && <div className="error">{state.error}</div>}

      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? '등록 중…' : '유머 등록하기'}
      </button>
    </form>
  );
}
