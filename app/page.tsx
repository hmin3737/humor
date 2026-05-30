import { listHumors } from '@/lib/db';
import { buildSegments } from '@/lib/highlight';
import HumorForm from './HumorForm';
import LikeButton from './LikeButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const humors = await listHumors();

  return (
    <main className="wrap">
      <header className="hero">
        <h1>
          분<span className="blue">위기</span>도 <span className="blue">위기</span>다
        </h1>
        <p>~~도 ~~다. 식의 유머를 친구들과 함께 모아요</p>
      </header>

      <HumorForm />

      <div className="section-title">등록된 유머 ({humors.length})</div>

      {humors.length === 0 ? (
        <div className="empty">아직 등록된 유머가 없어요. 첫 유머의 주인공이 되어보세요!</div>
      ) : (
        humors.map((h) => {
          const segs = buildSegments(h.front, h.back, h.overlap);
          return (
            <div className="card humor" key={h.id}>
              <div>
                <div className="text">
                  {segs.map((s, i) =>
                    s.highlight ? (
                      <span className="blue" key={i}>
                        {s.text}
                      </span>
                    ) : (
                      <span key={i}>{s.text}</span>
                    )
                  )}
                </div>
                <div className="author">by {h.author}</div>
              </div>
              <LikeButton id={h.id} initialLikes={h.likes} />
            </div>
          );
        })
      )}
    </main>
  );
}
