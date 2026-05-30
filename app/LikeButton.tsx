'use client';

import { useState, useTransition } from 'react';
import { likeAction } from './actions';

export default function LikeButton({
  id,
  initialLikes,
}: {
  id: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    setLikes((n) => n + 1); // optimistic
    startTransition(async () => {
      const next = await likeAction(id);
      setLikes(next);
    });
  }

  return (
    <button
      className="like-btn"
      onClick={handleClick}
      disabled={pending}
      aria-label="좋아요"
    >
      <span className="heart">💙</span>
      <span className="count">{likes}</span>
    </button>
  );
}
