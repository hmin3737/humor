# 분위기도 위기다

`~~도 ~~다.` 식의 유머를 친구들과 함께 모으는 사이트.

- 중간에 **도**가 자동으로 고정되어 들어갑니다.
- 겹치는 후반부 글자는 **파란색**으로 강조됩니다. (예: 분<span style="color:blue">위기</span>도 <span style="color:blue">위기</span>다)
- 누구나 창작자 이름과 함께 유머를 등록하고, 등록된 유머에 **좋아요**를 누를 수 있습니다.

## 기술 스택

- Next.js 15 (App Router) + React 19
- Vercel Postgres (`@vercel/postgres`)
- Vercel 배포

## 로컬 실행

```bash
npm install
npm run dev
```

DB 연결이 필요합니다. 프로젝트 루트에 `.env.local`을 만들고 Vercel Postgres 연결 정보를 넣으세요:

```
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

> 테이블(`humors`)은 첫 요청 시 자동으로 생성됩니다(`CREATE TABLE IF NOT EXISTS`). 별도 마이그레이션이 필요 없습니다.

## Vercel 배포

1. 이 저장소를 GitHub에 푸시합니다.
2. [vercel.com](https://vercel.com)에서 **New Project** → 해당 GitHub 저장소를 Import 합니다.
3. Vercel 대시보드 → **Storage** 탭 → **Create Database** → **Postgres** 를 생성하고 프로젝트에 연결(Connect)합니다.
   - 연결하면 위의 `POSTGRES_*` 환경 변수가 프로젝트에 자동으로 추가됩니다.
4. **Deploy** 를 누르면 끝. 이후 GitHub `main` 브랜치에 푸시할 때마다 자동 배포됩니다.

## 로컬에서 Vercel DB 환경 변수 받아오기 (선택)

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
```
