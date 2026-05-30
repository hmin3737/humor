'use server';

import { revalidatePath } from 'next/cache';
import { createHumor, likeHumor } from '@/lib/db';

export type ActionState = { error?: string; ok?: boolean };

export async function addHumorAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const author = String(formData.get('author') ?? '').trim();
  const front = String(formData.get('front') ?? '').trim();
  const back = String(formData.get('back') ?? '').trim();
  const overlap = String(formData.get('overlap') ?? '').trim();

  if (!author) return { error: '창작자 이름을 입력해 주세요.' };
  if (!front) return { error: "'도' 앞부분을 입력해 주세요." };
  if (!back) return { error: "'도' 뒷부분을 입력해 주세요." };
  if (!overlap) return { error: '겹치는(파란) 글자를 입력해 주세요.' };
  if (!front.includes(overlap) || !back.includes(overlap)) {
    return { error: '겹치는 글자는 앞부분과 뒷부분 모두에 들어가야 해요.' };
  }

  await createHumor({ author, front, back, overlap });
  revalidatePath('/');
  return { ok: true };
}

export async function likeAction(id: number): Promise<number> {
  const likes = await likeHumor(id);
  revalidatePath('/');
  return likes;
}
