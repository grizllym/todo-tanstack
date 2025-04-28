#! /bin/bash
cd api
npm i
cp .env.example .env
npx drizzle-kit migrate

cd ../web
npm i